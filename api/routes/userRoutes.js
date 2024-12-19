// Trong routes/users.js
const express = require("express");
const router = express.Router();
const {
  addUser,
  deleteUser,
  updateUser,
} = require("../controllers/AdminController");
const { verifyAdmin } = require("../Middleware/verifyAdmin");

router.post("/add", verifyAdmin, addUser); // Chỉ admin mới có thể thêm người dùng
router.delete("/:id", verifyAdmin, deleteUser); // Chỉ admin mới có thể xóa người dùng
router.put("/:id", verifyAdmin, updateUser); // Chỉ admin mới có thể chỉnh sửa người dùng

module.exports = router;
