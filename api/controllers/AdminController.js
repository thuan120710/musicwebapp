const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/AdminUser");
const bcrypt = require("bcrypt");
const multer = require("multer");
const verify = require("../Middleware/verifyToken");
const upload = multer();
const song = require("../models/Song");

const generateToken = (user) => {
  const payload = {
    userId: user._id,
    username: user.username,
    role: user.role, // Thêm vai trò vào payload
    avatarImage: user.avatarImage,
  };
  console.log(payload);
  console.log("JWT_SECRET when generating token:", process.env.JWT_SECRET);

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" });
};

// Đăng nhập
module.exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Kiểm tra nếu thiếu username hoặc password
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    // Tìm user trong cơ sở dữ liệu
    const user = await User.findOne({ username });
    if (!user) {
      console.log(`User with username ${username} not found`);
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Kiểm tra mật khẩu
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log(`Incorrect password for user ${username}`);
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Tạo token
    const token = generateToken(user);
    console.log("Generated Token:", token); // Log token

    // Gửi phản hồi bao gồm token
    res.json({
      status: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatarImage: user.avatarImage,
      },
      token, // Đảm bảo token được gửi về client
    });
  } catch (error) {
    console.error("Error in login:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Đăng ký
module.exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Kiểm tra nếu thiếu username, email hoặc password
    if (!username || !email || !password) {
      return res.status(400).json({
        status: false,
        message: "Username, Email and Password are required",
      });
    }

    // Kiểm tra định dạng email hợp lệ
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid email format" });
    }

    // Kiểm tra nếu username hoặc email đã tồn tại
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ status: false, message: "Username or email already exists." });
    }

    // Mã hóa mật khẩu trước khi lưu
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Lưu người dùng vào cơ sở dữ liệu
    await user.save();

    // Tạo token cho người dùng vừa đăng ký
    const token = generateToken(user);

    // Gửi phản hồi bao gồm token
    res.status(201).json({
      status: true,
      message: "User registered successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token, // Đảm bảo gửi token về phía client
    });
  } catch (error) {
    console.error("Error in registration:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

module.exports.logOut = (req, res, next) => {
  try {
    res.clearCookie("token").json("Logged out");
  } catch (ex) {
    next(ex);
  }
};

// module.exports.getAdminProfile = async (req, res, next) => {
//   try {
//     const adminProfile = await User.findOne(); // You need to implement this function

//     // Check if admin profile data is retrieved successfully
//     if (adminProfile) {
//       // Send the admin profile data as JSON response
//       res.json({
//         AdminProfile: adminProfile,
//         successMsg: "Admin profile retrieved successfully",
//       });
//     } else {
//       // If admin profile data retrieval fails, send an error response
//       res.status(500).json({ errorMsg: "Failed to retrieve admin profile" });
//     }
//   } catch (error) {
//     console.error("Error retrieving admin profile:", error);
//     res.status(500).json({ errorMsg: "Error retrieving admin profile" }); // Return an error response
//   }
// };

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "role",
      "_id",
    ]);
    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};

module.exports.addUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Kiểm tra xem tài khoản đã tồn tại chưa
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ status: false, message: "Tài khoản đã tồn tại" });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo người dùng mới
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "user", // Mặc định role là "user"
    });

    await newUser.save();

    return res.status(201).json({
      status: true,
      message: "Tạo tài khoản thành công",
      user: newUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Lỗi hệ thống" });
  }
};

// Trong controllers/userController.js
module.exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra xem người dùng có tồn tại không
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "Người dùng không tồn tại" });
    }

    // Xóa người dùng
    await User.findByIdAndDelete(id);

    return res
      .status(200)
      .json({ status: true, message: "Xóa tài khoản thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Lỗi hệ thống" });
  }
};

// Trong controllers/userController.js
module.exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, role } = req.body;

    // Kiểm tra xem người dùng có tồn tại không
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "Người dùng không tồn tại" });
    }

    // Cập nhật thông tin người dùng
    user.username = username || user.username;
    user.email = email || user.email;
    user.role = role || user.role;

    await user.save();

    return res
      .status(200)
      .json({ status: true, message: "Cập nhật tài khoản thành công", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Lỗi hệ thống" });
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true }
    );
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (ex) {
    next(ex);
  }
};
module.exports.dashboard = (req, res) => {
  res.json({ message: "Welcome to Admin Dashboard!" });
};
