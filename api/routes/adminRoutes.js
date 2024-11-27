const express = require("express");
const router = express.Router();
const verifyToken = require("../Middleware/verifyToken");
const checkRole = require("../Middleware/checkRole");

router.get(
  "/admin",
  verifyToken, // Middleware kiểm tra token
  checkRole(["admin"]), // Middleware kiểm tra vai trò
  (req, res) => {
    res.json({ message: "Welcome to Admin Dashboard!" });
  }
);

module.exports = router;
