const express = require("express");
const router = express.Router();
const songController = require("../controllers/SongController");
// const songRouter = require("./routes/song");
const Song = require("../models/Song"); // Mô hình bài hát trong MongoDB
const User = require("../models/AdminUser"); // Mô hình người dùng trong MongoDB
const AuthMiddleware = require("../Middleware/AuthMiddleware");
const Comment = require("../models/Comment"); // Đường dẫn đúng với thư mục của bạn
const Reply = require("../models/Reply");

// app.use("/api", songRouter);

// Route to fetch all categories
router.get("/songs", songController.getSongs);
router.get("/getsongs/:id", songController.getSongDetails);

// router.post("/track-listened", songController.trackListenedSong); // Route để theo dõi bài hát đã nghe
// router.get("/recommend/:userId", songController.recommendSongs); // Route để gợi ý bài hát

// API gợi ý nhạc
// API để lấy các bài hát gợi ý cho người dùng
router.get("/suggested-songs/:userId", songController.getSuggestedSongs);
router.post("/track-listened", songController.trackListenedSong);
router.put("/updatesong/:id", songController.updateSongDetails); // Cập nhật thông tin bài hát
router.get("/listening-history/:userId", songController.getListeningHistory);
// router.get("/listening-history/:userId", songController.getListeningHistory);
// Route to create a new category
router.post("/song", songController.createSongs);
// router.get("/admin-profile", songController.getAdminProfile);

router.put("/updatesong/:id", songController.updateSongDetails);
router.get(
  "/song/:songId/comments-and-rating",
  songController.getCommentsAndRating
);
router.get("/song/:songId/rating", songController.getRatingBySongId);
router.post("/song/:songId/comment", songController.addComment);
router.post("/song/:songId/rating", songController.addOrUpdateRating);
router.put(
  "/song/:songId/comment/:commentId",
  AuthMiddleware,
  songController.updateComment
);
router.delete(
  "/song/:songId/comment/:commentId",
  AuthMiddleware,
  songController.deleteComment
);

// **Route Xóa Bài Hát** (mới thêm vào)
// Trong routes/song.js
router.delete(
  "/listening-history/:userId/:songId",
  songController.deleteHistory
); // Route xóa bài hát trong lịch sử

// Route để xóa bài hát
router.delete("/song/:id", songController.deleteSong);

router.post("/comment/:commentId/reply", async (req, res) => {
  const { commentId } = req.params;
  const { userId, content } = req.body;

  try {
    // Kiểm tra bình luận tồn tại
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Bình luận không tồn tại" });
    }

    // Tạo phản hồi mới
    const newReply = await Reply.create({
      user: userId,
      comment: commentId,
      content,
    });

    res.status(201).json({
      message: "Phản hồi đã được thêm thành công",
      reply: newReply,
    });
  } catch (error) {
    console.error("Lỗi khi thêm phản hồi:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi", error });
  }
});

router.get("/comment/:commentId/replies", async (req, res) => {
  const { commentId } = req.params;

  try {
    // Tìm tất cả phản hồi liên quan đến commentId
    const replies = await Reply.find({ comment: commentId }).populate(
      "user",
      "username"
    );

    res.status(200).json({ replies });
  } catch (error) {
    console.error("Lỗi khi lấy phản hồi:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi", error });
  }
});

module.exports = router;
