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
const favoriteRouter = require("./routes/favorite");
const playListRouter = require("./routes/PlaylistRoutes");
const multer = require("multer");
const adminRoutes = require("./routes/adminRoutes"); // Đường dẫn tới file router của bạn
const listeningHistoryRoute = require("./routes/listeningHistory");
const { PlayList } = require("../front/src/Components/PlayList");
// const songRouter = require("./routes/song");

// Load environment variables
require("dotenv").config();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors()); // Allow all origins for testing. Adjust in production.
app.use("/uploads", express.static(__dirname + "/uploads")); // Serve static files

module.exports = app;
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

// Function to generate JWT token

app.get("/api/getAdminProfile", async (req, res) => {
  try {
    const adminProfile = await User.findOne(); // You need to implement this function

    // Check if admin profile data is retrieved successfully
    if (adminProfile) {
      // Send the admin profile data as JSON response
      res.json({
        AdminProfile: adminProfile,
        successMsg: "Admin profile retrieved successfully",
      });
    } else {
      // If admin profile data retrieval fails, send an error response
      res.status(500).json({ errorMsg: "Failed to retrieve admin profile" });
    }
  } catch (error) {
    console.error("Error retrieving admin profile:", error);
    res.status(500).json({ errorMsg: "Error retrieving admin profile" }); // Return an error response
  }
});

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
// app.use("/api/admin", adminRoutes); // Cấu hình để các route bắt đầu với /api/admin
// app.use("/api", listeningHistoryRoute);
// // Sử dụng route songRouter cho các đường dẫn bắt đầu bằng '/api'
// app.use("/api", songRouter);
// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
