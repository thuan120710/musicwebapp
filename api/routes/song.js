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
router.get("/suggested-songs/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Lấy lịch sử nghe nhạc của người dùng
    const userHistory = await User.findById(userId).select("listenedSongs");

    if (!userHistory) {
      return res.status(404).json({ error: "User not found" });
    }

    const listenedSongs = userHistory.listenedSongs;

    // Dựa trên lịch sử nghe, gợi ý các bài hát
    const suggestedSongs = await Song.find({
      _id: { $nin: listenedSongs }, // Gợi ý các bài hát chưa nghe
    }).limit(10); // Giới hạn 10 bài hát

    res.json({ suggestedSongs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Route to create a new category
router.post("/song", songController.createSongs);

router.put("/updatesong/:id", songController.updateSongDetails);
module.exports = router;
