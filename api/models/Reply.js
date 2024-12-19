const mongoose = require("mongoose");

const ReplySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AdminUser", // Người dùng tạo phản hồi
    required: true,
  },
  comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment", // Bình luận mà phản hồi liên quan đến
    required: true,
  },
  content: { type: String, required: true }, // Nội dung phản hồi
  createdAt: { type: Date, default: Date.now }, // Thời gian tạo phản hồi
});

module.exports = mongoose.model("Reply", ReplySchema);
