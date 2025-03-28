const express = require("express");
const passport = require("passport");

const router = express.Router();

// Khởi tạo đăng nhập Google
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Xử lý callback từ Google
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
  }),
  (req, res) => {
    // Đăng nhập thành công, điều hướng về trang chính
    res.redirect("/");
  }
);

// Xử lý đăng xuất
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

module.exports = router;
