const Favorites = require("../models/Favorites");
const Song = require("../models/Song"); // Assuming you have a Song model
// Controller function to fetch all categories

exports.getfavourites = async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Truy vấn tất cả bài hát yêu thích của người dùng và populate song_id
    const favorites = await Favorites.find({ user_id }).populate("song_id");

    if (!favorites || favorites.length === 0) {
      return res.status(404).json({ message: "No favorites found" });
    }

    res.json(favorites); // Trả về danh sách yêu thích của người dùng
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.createfavourites = async (req, res) => {
  try {
    const { song_id, user_id } = req.body;

    if (!song_id || !user_id) {
      return res
        .status(400)
        .json({ error: "Song ID and User ID are required" });
    }

    // Kiểm tra xem bài hát đã có trong danh sách yêu thích của người dùng chưa
    const existingFavorite = await Favorites.findOne({ user_id, song_id });
    if (existingFavorite) {
      return res
        .status(400)
        .json({ error: "Song is already in favorites for this user" });
    }

    // Tạo bản ghi yêu thích mới
    const favorite = new Favorites({ user_id, song_id });
    const savedFavorite = await favorite.save();

    // Sau khi lưu, populate để lấy thông tin bài hát đầy đủ
    const populatedFavorite = await Favorites.findById(
      savedFavorite._id
    ).populate("song_id");

    res.status(201).json(populatedFavorite); // Trả về dữ liệu bài hát và người dùng
  } catch (error) {
    console.error("Error while creating favorite: ", error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteFavorites = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.query; // Hoặc lấy từ body

    if (!user_id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const deletedFavorite = await Favorites.findOneAndDelete({
      user_id,
      song_id: id,
    });

    if (!deletedFavorite) {
      return res.status(404).json({ error: "Favorite not found" });
    }

    res.json({ success: true, message: "Favorite deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
