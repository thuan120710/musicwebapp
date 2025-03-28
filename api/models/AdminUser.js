const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false,
  },
  fullName: {
    type: String,
    required: false, // Tùy chọn, người dùng có thể thêm nếu muốn
  },
  avatarImage: {
    type: String, // Đường dẫn hoặc URL ảnh đại diện
    default: "", // Mặc định là chuỗi rỗng nếu chưa có ảnh
  },
  bio: {
    type: String,
    required: false, // Mô tả ngắn về người dùng
    default: "",
  },
  address: {
    type: String,
    required: false,
    default: "",
  },
  phoneNumber: {
    type: String,
    required: false,
    default: "",
  },
  dateOfBirth: {
    type: Date,
    required: false,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
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
UserSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("AdminUser", UserSchema, "adminuser");
