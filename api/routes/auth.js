const express = require("express");
const router = express.Router();

const adminController = require("../controllers/AdminController");
const userController = require("../controllers/userController");
const AdminUser = require("../models/AdminUser"); // Import mô hình AdminUser
const uploadMiddleware = require("../Middleware/uploadMiddleware"); // Import middleware
router.post("/register", adminController.register);
router.post("/login", adminController.login);
router.post("/logout", adminController.logOut);
// router.get("/getAdminProfile", adminController.getAdminProfile);

router.get("/users", adminController.getAllUsers);
router.put("/users/:id/avatar", adminController.setAvatar);

// Route xử lý upload avatar
router.post(
  "/api/upload-avatar/:userId",
  uploadMiddleware.single("avatar"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).send("Không có file nào được tải lên.");
      }

      const userId = req.params.userId;
      const avatarImageUrl = `/uploads/avatars/${req.file.filename}`; // Đường dẫn tới ảnh đã lưu

      // Tìm và cập nhật user
      const user = await AdminUser.findById(userId);
      if (!user) {
        return res.status(404).send("Người dùng không tồn tại.");
      }

      user.avatarImage = avatarImageUrl; // Cập nhật trường avatarImage
      await user.save(); // Lưu thay đổi vào database

      res.status(200).json({
        message: "Ảnh đã được tải lên thành công!",
        avatarImage: avatarImageUrl,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Đã xảy ra lỗi khi tải ảnh lên.");
    }
  }
);
router.get("/profile/:id", async (req, res) => {
  try {
    const user = await AdminUser.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cập nhật hồ sơ người dùng
router.put(
  "/profile/:id",
  uploadMiddleware.single("avatarImage"),
  async (req, res) => {
    try {
      const userId = req.params.id;
      const { username, email, fullName, bio, phoneNumber, address } = req.body;

      // Kiểm tra nếu có file avatar được gửi lên
      let avatarImage = null;
      if (req.file) {
        avatarImage = `/uploads/avatars/${req.file.filename}`; // Đường dẫn tới ảnh
      }

      // Tìm người dùng trong database
      const user = await AdminUser.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Cập nhật thông tin người dùng
      if (username) user.username = username;
      if (email) user.email = email;
      if (fullName) user.fullName = fullName;
      if (bio) user.bio = bio;
      if (phoneNumber) user.phoneNumber = phoneNumber;
      if (address) user.address = address;
      if (avatarImage) user.avatarImage = avatarImage;

      await user.save(); // Lưu thay đổi vào database

      // Trả về thông tin người dùng sau khi cập nhật
      res.status(200).json({
        message: "User profile updated successfully!",
        user,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "An error occurred while updating the profile." });
    }
  }
);

// Xóa tài khoản người dùng
router.delete("/profile/:id", async (req, res) => {
  try {
    const user = await AdminUser.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
