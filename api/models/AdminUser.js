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

  // avatarImage: {
  //   type: String,
  //   required: true,
  // },

  listenedSongs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }], // Lưu các bài hát đã nghe
  favoriteSongs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }], // Lưu bài hát yêu thích
  listeningHistory: [
    {
      song: { type: mongoose.Schema.Types.ObjectId, ref: "Song" },
      listenedAt: { type: Date, default: Date.now }, // Lưu thời gian người dùng nghe bài hát
    },
  ],

  role: { type: String, default: "user" },
  // Mặc định là người dùng, 'admin' sẽ là quản trị viên
  // Đếm số lần nghe nhạc theo thể loại (mỗi thể loại sẽ đếm số lần nghe)
  genreCounts: {
    type: Map,
    of: Number, // Định dạng cho đếm thể loại
  },
});

module.exports = mongoose.model("AdminUser", UserSchema, "adminuser");
