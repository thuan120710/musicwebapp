// Import necessary modules
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("./models/AdminUser");
const Favorites = require("./models/Favorites");
const Song = require("./models/Song");
const Category = require("./models/Category");
const cookieParser = require("cookie-parser");
const adminRouter = require("./routes/auth");
const deleteRouter = require("./routes/song");
const categoryRouter = require("./routes/category");
const songRouter = require("./routes/song");
const userRoutes = require("./routes/userRoutes");
const favoriteRouter = require("./routes/favorite");
const playListRouter = require("./routes/PlaylistRoutes");
const multer = require("multer");
const adminRoutes = require("./routes/adminRoutes"); // Đường dẫn tới file router của bạn
const listeningHistoryRoute = require("./routes/listeningHistory");
const { PlayList } = require("../front/src/Components/PlayList");
const authRoutes = require("./routes/authRoutes");
const path = require("path"); // Đảm bảo bạn đã require module 'path'
// const songRouter = require("./routes/song");

// Load environment variables
require("dotenv").config();

// Initialize Express app
const app = express();
// const cookieSession = require("cookie-session");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

app.use(cors()); // Allow all origins for testing. Adjust in production.
// Middleware
app.use(express.json());

// app.use(cookieParser());

// app.use("/uploads", express.static(__dirname + "/uploads")); // Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
module.exports = app;
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

function generateToken(user) {
  // Bạn có thể thay đổi payload và thời gian hết hạn theo nhu cầu của mình
  const payload = {
    id: user._id,
    username: user.username,
    email: user.email,
  };

  // Tạo token với payload và secret key (cần bảo mật secret key)
  const token = jwt.sign(payload, "your_secret_key", { expiresIn: "1h" });

  return token;
}

app.use(
  cors({
    origin: "http://localhost:3001",
    methods: "GET, POST, PUT, DELETE",
    credentials: true,
  })
);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false, // Không lưu lại session nếu không thay đổi
    saveUninitialized: false, // Lưu lại session ngay cả khi không có thay đổi
    cookie: { secure: false }, // Nếu đang sử dụng HTTP (chưa dùng HTTPS), set secure là false
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Lưu thông tin người dùng vào session
passport.serializeUser((user, done) => {
  done(null, user.id); // Lưu ID người dùng vào session
});

passport.deserializeUser(async (id, done) => {
  console.log("Deserialize User ID:", id);
  try {
    const user = await User.findById(id);
    if (!user) {
      console.error("User not found in database");
      return done(null, false);
    }
    console.log("Deserialized User:", user);
    done(null, user);
  } catch (err) {
    console.error("Error in deserializeUser:", err);
    done(err, null);
  }
});

app.use((req, res, next) => {
  console.log("Request Path:", req.path);
  console.log("Request Session:", req.session);
  console.log("Request User:", req.user);
  next();
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:4000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("Google profile:", profile); // Log thông tin profile từ Google
      console.log("Access Token:", accessToken);

      try {
        // Kiểm tra xem người dùng đã tồn tại trong cơ sở dữ liệu chưa qua googleId hoặc email
        let user = await User.findOne({
          $or: [{ googleId: profile.id }, { email: profile.emails[0].value }],
        });

        if (!user) {
          // Nếu không tìm thấy người dùng, tạo mới
          user = new User({
            googleId: profile.id,
            username: profile.displayName,
            email: profile.emails[0].value,
            avatarUrl: profile.photos[0].value,
          });

          await user.save();
        }

        // Gọi hàm done để tiếp tục với quá trình đăng nhập
        return done(null, user);
      } catch (err) {
        console.error("Error during authentication:", err); // Log lỗi nếu có
        return done(err, false);
      }
    }
  )
);

// Route khởi tạo quá trình đăng nhập bằng Google
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"], // Các quyền cần lấy từ Google
  })
);

// // Route xử lý callback sau khi Google xác thực
// app.get(
//   "/auth/google",
//   passport.authenticate("google", {
//     scope: ["profile", "email"], // Các quyền cần lấy từ Google
//   })
// );

// Route xử lý callback sau khi Google xác thực
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login", // Nếu xác thực thất bại, chuyển hướng tới trang login
  }),
  (req, res) => {
    // Sau khi xác thực qua Google thành công
    console.log("User session:", req.session);
    console.log("User:", req.user); // Kiểm tra xem người dùng đã được thêm vào session chưa

    // Tạo JWT cho người dùng
    const token = generateToken(req.user);

    // Bạn có thể lưu token vào cookie nếu muốn
    res.cookie("token", token, { httpOnly: true }); // Thêm token vào cookie

    // Chuyển hướng người dùng về trang chủ "/"
    res.redirect("http://localhost:3001/artist"); // Chuyển hướng người dùng về trang chủ sau khi đăng nhập thành công
  }
);

// Route đăng xuất
app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error(err);
    }
    res.redirect("http://localhost:3001/login");
  });
});

// app.get("/api/getAdminProfile", (req, res) => {
//   // Kiểm tra nếu người dùng đã đăng nhập
//   if (!req.user) {
//     return res.status(401).json({ error: "Unauthorized" });
//   }

//   // Trả về thông tin người dùng từ session
//   res.json({
//     user: {
//       id: req.user.id,
//       displayName: req.user.username, // Hoặc từ profile
//       email: req.user.email,
//       avatarUrl: req.user.avatarUrl,
//     },
//   });
// });

exports.deleteComment = async (req, res) => {
  try {
    let { songId, commentId } = req.params;

    songId = songId.trim();
    commentId = commentId.trim();

    console.log("Cleaned Params:", { songId, commentId });

    if (!mongoose.Types.ObjectId.isValid(songId)) {
      console.error("Invalid songId:", songId);
      return res.status(400).json({ error: "ID bài hát không hợp lệ" });
    }
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      console.error("Invalid commentId:", commentId);
      return res.status(400).json({ error: "ID bình luận không hợp lệ" });
    }

    const comment = await Comment.findOne({ _id: commentId, song: songId });
    if (!comment) {
      return res.status(404).json({ error: "Không tìm thấy bình luận" });
    }

    // Kiểm tra quyền sở hữu
    if (comment.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "Bạn không có quyền xóa bình luận này" });
    }

    // Xóa bình luận
    await Comment.deleteOne({ _id: commentId });

    res.status(200).json({ message: "Bình luận đã được xóa thành công" });
  } catch (error) {
    console.error("Error while deleting comment:", error.message);
    res
      .status(500)
      .json({ message: "Error deleting comment", details: error.message });
  }
};

// app.delete("/api/song/:songId/comment/:commentId", async (req, res) => {
//   const { songId, commentId } = req.params;
//   try {
//     // Giả sử bạn có mô hình Song với các bình luận được lưu trữ
//     const song = await Song.findById(songId);
//     if (!song) {
//       return res.status(404).json({ message: "Song not found" });
//     }

//     // Tìm và xóa bình luận
//     song.comments = song.comments.filter(
//       (comment) => comment._id.toString() !== commentId
//     );
//     await song.save();

//     return res.status(200).json({ message: "Comment deleted successfully" });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Error deleting comment" });
//   }
// });
// // API sửa bình luận và đánh giá
// app.put("/api/song/:songId/comment/:commentId", async (req, res) => {
//   const { songId, commentId } = req.params;
//   const { content, score } = req.body; // Nội dung và đánh giá mới
//   try {
//     const song = await Song.findById(songId);
//     if (!song) {
//       return res.status(404).json({ message: "Song not found" });
//     }

//     // Tìm bình luận cần sửa
//     const comment = song.comments.id(commentId);
//     if (!comment) {
//       return res.status(404).json({ message: "Comment not found" });
//     }

//     // Cập nhật nội dung và điểm đánh giá
//     comment.content = content;
//     comment.score = score;
//     await song.save();

//     return res
//       .status(200)
//       .json({ message: "Comment updated successfully", comment });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Error updating comment" });
//   }
// });
// Function to generate JWT token

// app.get("/api/getAdminProfile", async (req, res) => {
//   try {
//     const adminProfile = await User.findOne(); // You need to implement this function

//     // Check if admin profile data is retrieved successfully
//     if (adminProfile) {
//       // Send the admin profile data as JSON response
//       res.json({
//         AdminProfile: adminProfile,
//         successMsg: "Admin profile retrieved successfully",
//       });
//     } else {
//       // If admin profile data retrieval fails, send an error response
//       res.status(500).json({ errorMsg: "Failed to retrieve admin profile" });
//     }
//   } catch (error) {
//     console.error("Error retrieving admin profile:", error);
//     res.status(500).json({ errorMsg: "Error retrieving admin profile" }); // Return an error response
//   }
// });

// Backend (Express.js)

const suggestedSongs = [
  {
    songName: "Song 1",
    artist: "Artist 1",
    song: "song1.mp3",
    imgSrc: "song1.jpg",
  },
  {
    songName: "Song 2",
    artist: "Artist 2",
    song: "song2.mp3",
    imgSrc: "song2.jpg",
  },
  {
    songName: "Song 3",
    artist: "Artist 3",
    song: "song3.mp3",
    imgSrc: "song3.jpg",
  },
];

// Hàm gợi ý nhạc dựa trên thể loại và ca sĩ
// Hàm gợi ý nhạc dựa trên thể loại và ca sĩ từ trường 'favorite'
async function getContentBasedRecommendations(userId) {
  try {
    if (!userId || userId === "undefined") {
      throw new Error("Invalid userId");
    }

    // Lấy tất cả bài hát yêu thích của người dùng hiện tại từ bảng 'Favorites'
    const userFavorites = await Favorites.find({ user_id: userId }).populate(
      "song_id"
    );

    // Kiểm tra nếu người dùng không có bài hát yêu thích
    if (!userFavorites || userFavorites.length === 0) {
      throw new Error("User has no favorite songs");
    }

    // Lấy danh sách bài hát yêu thích
    const likedSongs = userFavorites.map((favorite) => favorite.song_id);

    // Lấy các thể loại (categories) và nghệ sĩ (artists) duy nhất từ các bài hát yêu thích
    const genres = likedSongs
      .map((song) => song.category)
      .filter((value, index, self) => self.indexOf(value) === index);

    const artists = likedSongs
      .map((song) => song.artist)
      .filter((value, index, self) => self.indexOf(value) === index);

    // Tìm bài hát gợi ý theo thể loại và nghệ sĩ
    const recommendedSongs = await Song.find({
      $or: [{ category: { $in: genres } }, { artist: { $in: artists } }],
    }).limit(10);

    return recommendedSongs;
  } catch (error) {
    console.error("Error in getContentBasedRecommendations:", error);
    throw error;
  }
}

// Hàm Cosine Similarity
function cosineSimilarity(song1, song2) {
  const categorySimilarity = song1.category === song2.category ? 1 : 0;
  const artistSimilarity = song1.artist === song2.artist ? 1 : 0;
  return categorySimilarity + artistSimilarity; // Tính tổng tương đồng
}

// Hàm gợi ý bài hát dựa trên độ tương đồng Cosine
app.get("/api/content-based-recommendations/:songId", async (req, res) => {
  try {
    const songId = req.params.songId;
    const song = await Song.findById(songId);

    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    const allSongs = await Song.find(); // Lấy tất cả các bài hát từ database
    let recommendations = [];

    allSongs.forEach((s) => {
      if (s._id.toString() !== songId.toString()) {
        const similarity = cosineSimilarity(song, s);
        if (similarity > 0) {
          recommendations.push({ song: s, similarity });
        }
      }
    });

    // Sắp xếp theo độ tương đồng giảm dần
    recommendations.sort((a, b) => b.similarity - a.similarity);
    res.json(recommendations.slice(0, 5)); // Gợi ý top 5 bài hát tương tự
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const getCollaborativeRecommendations = async (userId) => {
  try {
    // Lấy tất cả bài hát yêu thích của người dùng hiện tại
    const currentUserFavorites = await Favorites.find({
      user_id: userId,
    }).populate("song_id");

    if (!currentUserFavorites || currentUserFavorites.length === 0) {
      throw new Error("User not found or no liked songs");
    }

    const users = await User.find();
    let similarUsers = [];

    // Tìm người dùng tương tự
    for (let user of users) {
      if (user._id.toString() !== userId.toString()) {
        const userFavorites = await Favorites.find({
          user_id: user._id,
        }).populate("song_id");

        let commonLikedSongs = currentUserFavorites.filter(
          (currentUserSong) => {
            return userFavorites.some((userSong) => {
              // Kiểm tra null hoặc undefined trước khi truy cập _id
              if (userSong.song_id && currentUserSong.song_id) {
                return (
                  userSong.song_id._id.toString() ===
                  currentUserSong.song_id._id.toString()
                );
              }
              return false;
            });
          }
        );

        // Kiểm tra commonLikedSongs có chứa bài hát chung không
        console.log(
          "Common liked songs for user:",
          user.username,
          commonLikedSongs
        );

        if (commonLikedSongs.length > 0) {
          similarUsers.push({ user, userFavorites, commonLikedSongs });
        }
      }
    }

    let recommendations = [];
    for (let { user, userFavorites, commonLikedSongs } of similarUsers) {
      for (let { song_id } of userFavorites) {
        if (
          song_id && // Kiểm tra song_id tồn tại
          !currentUserFavorites.some(
            (userSong) =>
              userSong.song_id && // Kiểm tra userSong.song_id tồn tại
              userSong.song_id._id.toString() === song_id._id.toString()
          )
        ) {
          // Chỉ thêm bài hát vào gợi ý nếu chưa có trong danh sách yêu thích của người dùng
          recommendations.push(song_id);
        }
      }
    }

    console.log("Recommendations:", recommendations); // Debug output
    return recommendations;
  } catch (error) {
    console.error("Error in getCollaborativeRecommendations:", error);
    throw error;
  }
};

// API cho Collaborative Filtering
app.get("/api/collaborative-recommendations/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const recommendations = await getCollaborativeRecommendations(userId);
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// API cho Collaborative Filtering
// API cho Collaborative Filtering

// Hàm Hybrid Recommendation
app.get("/api/hybrid-recommendations/:userId/:songId", async (req, res) => {
  try {
    const { userId, songId } = req.params;

    // Gợi ý dựa trên Content-based Filtering
    const contentRecommendations = await getContentBasedRecommendations(userId);

    // Gợi ý dựa trên Collaborative Filtering
    const collaborativeRecommendations = await getCollaborativeRecommendations(
      userId
    );

    // Kết hợp cả hai
    let combinedRecommendations = [
      ...contentRecommendations,
      ...collaborativeRecommendations,
    ];

    // Lọc những bài hát duy nhất (tránh trùng lặp)
    combinedRecommendations = [...new Set(combinedRecommendations)];

    // Sắp xếp các bài hát theo độ ưu tiên (ví dụ: theo độ tương đồng, rating, v.v.)
    combinedRecommendations.sort((a, b) => b.score - a.score);

    res.json(combinedRecommendations.slice(0, 5)); // Trả về top 5 gợi ý
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// app.get("/recommendations/:userId", async (req, res) => {
//   const userId = req.params.userId;

//   // Kiểm tra nếu userId không được cung cấp
//   if (!userId) {
//     return res.status(400).send({ error: "UserId is required" });
//   }

//   try {
//     // Gọi hàm getContentBasedRecommendations để lấy gợi ý bài hát
//     const recommendations = await getContentBasedRecommendations(userId);
//     res.json(recommendations); // Trả kết quả về cho client
//   } catch (error) {
//     // Nếu có lỗi, trả lại lỗi với status 500
//     res.status(500).send({ error: error.message });
//   }
// });

// Tạo API cho gợi ý bài hát
app.get("/api/suggested-songs", (req, res) => {
  res.json(suggestedSongs); // Trả về dữ liệu gợi ý nhạc
});
console.log("MongoDB URL:", process.env.MONGO_URL);
console.log("JWT Secret:", process.env.JWT_SECRET);

// // Khởi động server
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });

// Routes for songs and categories
app.use("/api", adminRouter);
app.use("/api", songRouter);
app.use("/api", categoryRouter);
app.use("/api", favoriteRouter);
app.use("/api", playListRouter);
app.use("/api", adminRoutes);
app.use("/api", deleteRouter);
app.use("/api", userRoutes);
// const isAdmin = (req, res, next) => {
//   if (req.isAuthenticated() && req.user.role === "admin") {
//     return next();
//   } else {
//     res.status(403).json({ message: "Permission denied" });
//   }
// };

// app.use("/api/admin", isAdmin, adminRoutes);

app.use(authRoutes);
// app.use(
//   cookieSession({
//     name: "session",
//     keys: [process.env.SESSION_SECRET || "secret"], // Khóa bảo mật session
//     maxAge: 24 * 60 * 60 * 1000, // Thời gian tồn tại của session
//   })
// );

// Cấu hình Passport

// app.use("/api/admin", adminRoutes); // Cấu hình để các route bắt đầu với /api/admin
// app.use("/api", listeningHistoryRoute);
// // Sử dụng route songRouter cho các đường dẫn bắt đầu bằng '/api'
// app.use("/api", songRouter);
// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
