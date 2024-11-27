const express = require("express");
const router = express.Router();
const songController = require("../controllers/SongController");
// const songRouter = require("./routes/song");
const Song = require("../models/Song"); // Mô hình bài hát trong MongoDB
const User = require("../models/AdminUser"); // Mô hình người dùng trong MongoDB

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

router.post("/song/:songId/comment", songController.addComment);
router.post("/song/:songId/rating", songController.addOrUpdateRating);
module.exports = router;
