const mongoose = require("mongoose");

const PlaylistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AdminUser",
    required: true,
  }, // Liên kết với user
  name: { type: String, required: true }, // Tên playlist
  songs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }], // Các bài hát trong playlist
  createdAt: { type: Date, default: Date.now }, // Ngày tạo playlist
});

module.exports = mongoose.model("Playlist", PlaylistSchema);
