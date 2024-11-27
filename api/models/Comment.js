const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AdminUser",
    required: true,
  },
  song: { type: mongoose.Schema.Types.ObjectId, ref: "Song", required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  history: [
    {
      content: String,
      updatedAt: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("Comment", CommentSchema);
