// Middleware xử lý upload file
const multer = require("multer");
const path = require("path");

// Cấu hình lưu trữ và tên file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/avatars/"); // Lưu vào thư mục avatars
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Tên file bao gồm timestamp và tên gốc
  },
});

// Kiểm tra loại file (chỉ cho phép hình ảnh)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Cho phép nếu loại file hợp lệ
  } else {
    cb(new Error("Chỉ cho phép tải lên ảnh (JPEG, PNG, GIF)."), false); // Từ chối nếu không hợp lệ
  }
};

// Giới hạn kích thước file (5MB)
const limits = {
  fileSize: 5 * 1024 * 1024, // 5MB
};

// Tạo middleware multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: limits,
});

module.exports = upload;
