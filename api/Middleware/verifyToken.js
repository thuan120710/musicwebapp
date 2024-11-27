const jwt = require("jsonwebtoken");
const User = require("../models/AdminUser");

const verifyToken = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "").trim();

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Giải mã token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Tìm user từ database
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User from database:", user);

    // Gắn thông tin user vào req để sử dụng trong middleware tiếp theo
    req.user = user;
    next();
  } catch (error) {
    console.error("Error in verifyToken:", error.message);
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = verifyToken;
