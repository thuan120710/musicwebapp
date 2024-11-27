import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom"; // Import useHistory và Link từ React Router
import axios from "axios";
import "./Login.css"; // Import CSS riêng

const Login = () => {
  const history = useHistory(); // Hook dùng để điều hướng
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn reload lại trang khi submit form

    try {
      // Gửi request login tới server
      const response = await axios.post("http://localhost:4000/api/login", {
        username,
        password,
      });

      if (response.data && response.data.token) {
        // Lưu token và thông tin user vào localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        // Điều hướng dựa trên vai trò (role) của user
        const userRole = response.data.user.role;
        if (userRole === "admin") {
          history.push("/admin"); // Điều hướng tới dashboard admin
        } else {
          history.push("/"); // Điều hướng tới trang chính của user
        }
      }
    } catch (error) {
      // Hiển thị lỗi nếu login thất bại
      setErrorMessage("Invalid username or password");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1 className="login-title">Login</h1>
        <input
          type="text"
          placeholder="Username"
          className="login-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="login-button">
          Login
        </button>

        {/* Hiển thị lỗi nếu có */}
        {errorMessage && <p className="login-error">{errorMessage}</p>}

        {/* Link tới trang đăng ký */}
        <span>
          Don't have an account? <Link to="/registration">Sign up</Link>.
        </span>
      </form>
    </div>
  );
};

export default Login;
