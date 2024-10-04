import React, { useState } from "react";
import axios from "axios";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4000/api/login", {
        email,
        password,
      });

      const { token, role } = response.data;

      // Lưu token vào localStorage
      localStorage.setItem("token", token);

      // Điều hướng dựa trên vai trò
      if (role === "admin") {
        window.location.href = "/admin/dashboard"; // Điều hướng admin đến trang quản trị
      } else {
        window.location.href = "/home"; // Điều hướng người dùng đến trang nghe nhạc
      }
    } catch (error) {
      console.error("Đăng nhập thất bại:", error);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Đăng nhập</h2>
      <div>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Mật khẩu</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Đăng nhập</button>
    </form>
  );
};

export default LoginForm;
