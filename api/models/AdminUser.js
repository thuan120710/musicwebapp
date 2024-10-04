const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },

  avatarImage: {
    type: String,
    required: true,
  },

  listenedSongs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }], // Lưu các bài hát đã nghe
  favoriteSongs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }], // Lưu bài hát yêu thích

  role: { type: String, default: "user" }, // Mặc định là người dùng, 'admin' sẽ là quản trị viên
});

module.exports = mongoose.model("AdminUser", UserSchema, "adminuser");
