// // routes/listeningHistory.js
// const express = require("express");
// const router = express.Router();
// const AdminUser = require("../models/AdminUser");
// const verifyToken = require("../middleware/verifyToken"); // Middleware để xác thực token

// // API lấy listeningHistory của người dùng
// router.get("/listening-history", verifyToken, async (req, res) => {
//   try {
//     const userId = req.user._id; // Lấy userId từ token
//     const admin = await AdminUser.findById(userId).populate(
//       "listeningHistory.song"
//     );

//     if (!admin) {
//       return res.status(404).json({ error: "Không tìm thấy người dùng" });
//     }

//     // Trả về listeningHistory của người dùng
//     res.status(200).json({ listeningHistory: admin.listeningHistory });
//   } catch (error) {
//     console.error("Lỗi khi lấy lịch sử nghe nhạc:", error);
//     res.status(500).json({ error: "Lỗi máy chủ" });
//   }
// });

// module.exports = router;
