// Trong middleware/verifyAdmin.js
const jwt = require("jsonwebtoken");

module.exports.verifyAdmin = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res
      .status(403)
      .json({ status: false, message: "Không có quyền truy cập" });
  }

  console.log("Received token:", token); // Log token để kiểm tra

  // Loại bỏ từ "Bearer " nếu có
  const tokenWithoutBearer = token.startsWith("Bearer ")
    ? token.slice(7)
    : token;

  jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("Error verifying token:", err); // Log lỗi khi xác minh token
      return res
        .status(403)
        .json({ status: false, message: "Token không hợp lệ hoặc đã hết hạn" });
    }

    console.log("Decoded token:", decoded); // Log decoded token

    if (decoded.role !== "admin") {
      return res
        .status(403)
        .json({ status: false, message: "Bạn không có quyền admin" });
    }

    req.user = decoded;
    next();
  });
};
