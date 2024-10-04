router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Email hoặc mật khẩu không đúng!" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Email hoặc mật khẩu không đúng!" });
    }

    // Nếu người dùng là admin, bạn có thể chuyển họ đến trang admin
    if (user.role === "admin") {
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        "secretKey",
        { expiresIn: "1h" }
      );
      return res.json({
        token,
        role: "admin",
        message: "Đăng nhập admin thành công!",
      });
    }

    // Người dùng thông thường
    const token = jwt.sign({ userId: user._id, role: user.role }, "secretKey", {
      expiresIn: "1h",
    });

    res.json({
      token,
      role: "user",
      message: "Đăng nhập người dùng thành công!",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
});
