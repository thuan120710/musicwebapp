const Song = require("../models/Song");
const User = require("../models/AdminUser");
const multer = require("multer");
const upload = require("../Middleware/uploadMiddleware"); // Import the Multer middleware
const fs = require("fs");
const AdminUser = require("../models/AdminUser");

const Rating = require("../models/Rating");
const mongoose = require("mongoose");
const Comment = require("../models/Comment");
// Controller function to fetch all songs
exports.getSongs = async (req, res) => {
  try {
    const songs = await Song.find();
    res.json(songs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Hàm lấy chi tiết bài hát

exports.getSongDetails = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Received songId:", id); // Log để kiểm tra songId nhận được

    const song = await Song.findById(id); // Truy vấn MongoDB theo songId

    if (!song) {
      return res.status(404).json({ error: "Song not found" }); // Nếu không tìm thấy bài hát
    }

    res.status(200).json(song); // Trả về dữ liệu bài hát
  } catch (error) {
    console.error("Error fetching song details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//getSongDetails
// Multer configuration for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Ensure the directory exists and is writable by the server
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Add a unique identifier
  },
});

// Initialize multer with the configured storage
const uploadStorage = multer({ storage: storage });

// // Controller function to create a new song
exports.createSongs = async (req, res) => {
  try {
    // Handle potential errors during upload
    uploadStorage.fields([
      { name: "song", maxCount: 1 },
      { name: "imgSrc", maxCount: 1 },
    ])(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: err.message }); // Use err.message for more details
      }

      // Extract fields from request body
      const { favourite, category, type, songName, artist, color } = req.body;

      // Check if uploaded files exist
      if (!req.files) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      // Extract file paths (assuming successful upload)
      const songFilePath = req.files["song"][0].path; // File path of the uploaded song
      const imgFilePath = req.files["imgSrc"][0].path; // File path of the uploaded image

      // Create new song object
      const song = new Song({
        favourite,
        category,
        type,
        songName,
        artist,
        song: songFilePath,
        imgSrc: imgFilePath,
        color,
      });

      // Save song to database
      const savedSong = await song.save();

      res.status(201).json(savedSong);
    });
  } catch (error) {
    // Handle other errors
    res.status(500).json({ error: error.message });
  }
};

// Hàm lấy thể loại nghe nhiều nhất từ lịch sử nghe nhạc
const getTopGenres = (listeningHistory) => {
  const genreCount = {};

  // Đếm số lần nghe của mỗi thể loại
  listeningHistory.forEach((entry) => {
    const genre = entry.category; // Giả sử bạn đã lưu thông tin thể loại vào listeningHistory
    if (genre) {
      if (!genreCount[genre]) {
        genreCount[genre] = 1;
      } else {
        genreCount[genre]++;
      }
    }
  });

  // Sắp xếp thể loại theo tần suất nghe
  const sortedGenres = Object.entries(genreCount).sort((a, b) => b[1] - a[1]);

  // Trả về thể loại có tần suất nghe nhiều nhất
  return sortedGenres.length > 0 ? sortedGenres[0][0] : null;
};

// Controller gợi ý bài hát dựa trên sở thích người dùng hoặc gợi ý ngẫu nhiên nếu không có dữ liệu
exports.getSuggestedSongs = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Kiểm tra xem userId có tồn tại không
    if (!userId) {
      return res.status(400).json({ error: "Thiếu userId" });
    }

    // Lấy lịch sử nghe nhạc của người dùng
    const user = await AdminUser.findById(userId).populate(
      "listeningHistory.song"
    );

    // Kiểm tra nếu không tìm thấy người dùng
    if (!user) {
      return res.status(404).json({ error: "Không tìm thấy người dùng" });
    }

    // Lấy thể loại mà người dùng nghe nhiều nhất
    const topGenre = getTopGenres(user.listeningHistory);

    let suggestedSongs;

    // Nếu có thể loại yêu thích, tìm bài hát thuộc thể loại đó
    if (topGenre) {
      suggestedSongs = await Song.find({ category: topGenre })
        .sort({ createdAt: -1 }) // Sắp xếp bài hát mới nhất
        .limit(10); // Giới hạn kết quả
    } else {
      // Nếu không có thể loại yêu thích, gợi ý bài hát ngẫu nhiên
      suggestedSongs = await Song.aggregate([{ $sample: { size: 10 } }]);
    }

    // Nếu không có bài hát nào được tìm thấy
    if (suggestedSongs.length === 0) {
      return res.status(404).json({ error: "Không tìm thấy bài hát gợi ý" });
    }

    // Trả về danh sách bài hát gợi ý
    res.status(200).json({ suggestedSongs });
  } catch (error) {
    console.error("Lỗi khi lấy bài hát gợi ý:", error);
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
};
// Lấy lịch sử nghe nhạc
exports.getListeningHistory = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log("userId", userId);
    // Tìm người dùng dựa trên userId và populate để lấy thông tin bài hát
    const adminuser = await AdminUser.findById(userId).populate(
      "listeningHistory.song"
    );

    if (!adminuser) {
      return res.status(404).json({ error: "Không tìm thấy người dùng" });
    }

    res.status(200).json({ listeningHistory: adminuser.listeningHistory });
  } catch (error) {
    console.error("Lỗi khi lấy lịch sử nghe nhạc:", error);
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
};
// Theo dõi bài hát đã nghe
// Theo dõi bài hát đã nghe
exports.trackListenedSong = async (req, res) => {
  try {
    const { userId, songId } = req.body;

    // Tìm người dùng
    const adminuser = await AdminUser.findById(userId);
    if (!adminuser) {
      return res.status(404).json({ error: "Không tìm thấy người dùng" });
    }

    // Kiểm tra xem bài hát đã có trong lịch sử nghe chưa
    const songIndex = adminuser.listeningHistory.findIndex(
      (entry) => entry.song.toString() === songId
    );

    if (songIndex !== -1) {
      // Nếu đã tồn tại, di chuyển bài hát lên đầu danh sách
      const [existingSong] = adminuser.listeningHistory.splice(songIndex, 1);
      adminuser.listeningHistory.unshift(existingSong);
    } else {
      // Nếu chưa có, thêm bài hát mới vào lịch sử
      adminuser.listeningHistory.unshift({
        song: songId,
        listenedAt: new Date(),
      });
    }

    // Lưu người dùng đã cập nhật
    await adminuser.save();

    res.status(200).json({
      message: "Cập nhật lịch sử nghe thành công",
      listeningHistory: adminuser.listeningHistory,
    });
  } catch (error) {
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
};

// Lấy chi tiết bài hát
exports.getSongDetails = async (req, res) => {
  try {
    const songId = req.params.id;
    const song = await Song.findById(songId);

    if (!song) {
      return res.status(404).json({ error: "Không tìm thấy bài hát" });
    }

    res.status(200).json(song);
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết bài hát:", error);
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
};
// Controller function to create a new song

exports.updateSongDetails = async (req, res) => {
  try {
    // Handle potential errors during upload
    uploadStorage.fields([
      { name: "song", maxCount: 1 },
      { name: "imgSrc", maxCount: 1 },
    ])(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: err.message }); // Use err.message for more details
      }

      // Extract fields from request body
      const { favourite, category, type, songName, artist, color } = req.body;

      // Check if uploaded files exist
      if (!req.files) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      // Extract file paths (assuming successful upload)
      const songFilePath = req.files["song"][0].path; // File path of the uploaded song
      const imgFilePath = req.files["imgSrc"][0].path; // File path of the uploaded image

      // Find the song by ID and update its details
      const updatedSong = await Song.findByIdAndUpdate(
        req.params.id,
        {
          favourite,
          category,
          type,
          songName,
          artist,
          song: songFilePath,
          imgSrc: imgFilePath,
          color,
        },
        { new: true }
      ); // { new: true } returns the updated document

      res.status(200).json({ updatedSong });
    });
  } catch (error) {
    // Handle other errors
    res.status(500).json({ error: error.message });
  }
};

exports.addOrUpdateRating = async (req, res) => {
  try {
    const { userId, score } = req.body;
    const songId = req.params.songId;
    // Kiểm tra giá trị và kiểu dữ liệu của songId và userId
    console.log("Received songId:", songId);
    console.log("Received userId:", userId);

    // Kiểm tra tính hợp lệ của `songId` và `userId`
    if (!mongoose.Types.ObjectId.isValid(songId)) {
      return res.status(400).json({ error: "ID bài hát không hợp lệ" });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "ID người dùng không hợp lệ" });
    }

    // Chuyển đổi `songId` và `userId` thành `ObjectId`
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const songObjectId = new mongoose.Types.ObjectId(songId);

    // Thực hiện tìm kiếm hoặc tạo đánh giá
    const existingRating = await Rating.findOne({
      user: userObjectId,
      song: songObjectId,
    });

    if (existingRating) {
      existingRating.score = score;
      await existingRating.save();
    } else {
      const newRating = new Rating({
        user: userObjectId,
        song: songObjectId,
        score,
      });
      await newRating.save();
    }

    res.status(201).json({ message: "Đánh giá thành công" });
  } catch (error) {
    console.error("Error while saving rating:", error);
    res.status(500).json({ error: "Lỗi khi thêm đánh giá" });
  }
};

// Hàm để thêm bình luận mới vào bài hát
exports.addComment = async (req, res) => {
  try {
    const { userId, content, score } = req.body;
    const songId = req.params.songId;

    // Kiểm tra tính hợp lệ của songId
    if (!mongoose.Types.ObjectId.isValid(songId)) {
      return res.status(400).json({ error: "ID bài hát không hợp lệ" });
    }

    const newComment = new Comment({
      user: userId,
      song: songId,
      content,
      score,
    });

    const savedComment = await newComment.save();
    res.status(201).json({ comment: savedComment });
  } catch (error) {
    console.error("Error while saving comment:", error);
    res.status(500).json({ error: "Lỗi khi thêm bình luận" });
  }
};

// Hàm để lấy bình luận theo songId
exports.getCommentsBySongId = async (req, res) => {
  try {
    const songId = req.params.songId;

    // Kiểm tra tính hợp lệ của songId
    if (!mongoose.Types.ObjectId.isValid(songId)) {
      return res.status(400).json({ error: "ID bài hát không hợp lệ" });
    }

    const comments = await Comment.find({ song: songId }).populate("user");
    res.status(200).json({ comments });
  } catch (error) {
    console.error("Error while fetching comments:", error);
    res.status(500).json({ error: "Lỗi khi lấy bình luận" });
  }
};
exports.updateComment = async (req, res) => {
  try {
    const { commentId, newContent } = req.body;

    // Lấy bình luận cần cập nhật
    const comment = await Comment.findById(commentId);
    if (!comment)
      return res.status(404).json({ error: "Không tìm thấy bình luận" });

    // Lưu lịch sử trước khi cập nhật
    comment.history.push({ content: comment.content });
    comment.content = newContent; // Cập nhật nội dung mới
    await comment.save();

    res.status(200).json({ message: "Cập nhật bình luận thành công", comment });
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi cập nhật bình luận" });
  }
};

exports.getCommentsWithHistory = async (req, res) => {
  try {
    const songId = req.params.songId;
    const comments = await Comment.find({ song: songId }).populate("user");

    res.status(200).json({ comments });
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi lấy bình luận" });
  }
};

exports.updateRating = async (req, res) => {
  try {
    const { userId, newScore } = req.body;
    const songId = req.params.songId;

    const rating = await Rating.findOne({ user: userId, song: songId });
    if (!rating)
      return res.status(404).json({ error: "Không tìm thấy đánh giá" });

    rating.history.push({ score: rating.score });
    rating.score = newScore;
    await rating.save();

    res.status(200).json({ message: "Cập nhật đánh giá thành công", rating });
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi cập nhật đánh giá" });
  }
};

exports.getListeningHistory = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Kiểm tra nếu userId là null hoặc không hợp lệ
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ error: "User ID không hợp lệ hoặc bị thiếu" });
    }

    // Tìm người dùng dựa trên userId và lấy lịch sử nghe nhạc
    const adminuser = await AdminUser.findById(userId).populate(
      "listeningHistory.song"
    );

    if (!adminuser) {
      return res.status(404).json({ error: "Không tìm thấy người dùng" });
    }

    res.status(200).json({ listeningHistory: adminuser.listeningHistory });
  } catch (error) {
    console.error("Lỗi khi lấy lịch sử nghe nhạc:", error);
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
};
