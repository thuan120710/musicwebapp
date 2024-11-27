const mongoose = require("mongoose");

// Define the schema for the favorites table
const FavoritesSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "AdminUser",
  },
  song_id: {
    type: mongoose.Schema.Types.ObjectId, // Nếu liên kết với bảng bài hát, chuyển về ObjectId
    required: true,
    ref: "Song",
  },
});

// Create the model for the favorites table
const Favorites = mongoose.model("Favorites", FavoritesSchema);

module.exports = Favorites;
