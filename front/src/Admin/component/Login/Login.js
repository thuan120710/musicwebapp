import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Login.css";
import { loginRoute } from "../../utils/APIRoutes";
import { jwtDecode } from "jwt-decode";
import { useHistory } from "react-router-dom";

const Login = () => {
  const history = useHistory(); // Hook dùng để điều hướng

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn reload lại trang khi submit form

    try {
      // Gửi request login tới server
      const response = await axios.post(loginRoute, {
        username,
        password,
      });

      if (response.status === 200) {
        const token = response.data.token;
        const userLogin = jwtDecode(token);
        console.log(userLogin);

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        console.log(response.data.user);

        const userRole = response.data.user.role;

        if (userRole === "admin") {
          window.location.href = "/admin";
        } else {
          window.location.href = "/";
        }
      }

      // if (response.data && response.data.token) {
      //   // Lưu token và thông tin user vào localStorage
      //   localStorage.setItem("token", response.data.token);
      //   localStorage.setItem("user", JSON.stringify(response.data.user));

      //   // Điều hướng dựa trên vai trò (role) của user
      //   const userRole = response.data.user.role;
      //   if (userRole === "admin") {
      //     // history.push("/admin"); // Điều hướng tới dashboard admin
      //     window.location.href = "/admin";
      //   } else {
      //     // history.push("/"); // Điều hướng tới trang chính của user
      //     window.location.href = "/";
      //   }

      // }
    } catch (error) {
      setErrorMessage("Invalid username or password");
    }
  };
  const handleGoogleLogin = () => {
    // Điều hướng trực tiếp đến Google OAuth
    window.location.href = "http://localhost:4000/auth/google";
  };
  return (
    <div className="app w-100">
      <div className="background-login">
        <div className="login__form">
          <div className="login__form-title">
            <div className="login__form-title--logo">
              <img
                src="./assets/img/logo_spotify.webp"
                alt="Logo Spotify"
                className="login__form-title--img w-100"
              />
            </div>
            <div className="login__form-title--text">
              <h1>Log in to Spotify</h1>
            </div>
          </div>
          <div className="login__socialMedia">
            <button
              className="login__socialMedia-btn login__socialMedia-btn--google mb-3 input-50"
              onClick={handleGoogleLogin}
            >
              <i className="fa-brands fa-google login__socialMedia-icon login__socialMedia-icon--google" />
              <span className="login__socialMedia-text">
                Đăng nhập bằng Google
              </span>
            </button>

            <button className="login__socialMedia-btn login__socialMedia-btn--facebook input-50">
              <i className="fa-brands fa-facebook login__socialMedia-icon login__socialMedia-icon--facebook" />
              <span className="login__socialMedia-text">
                Đăng nhập bằng Facebook
              </span>
            </button>
          </div>
          <div className="login__or">
            <div className="login__or-line" />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="login__input-form">
              <div className="login__input-item login__input--email mb-3">
                <input
                  className="px-3"
                  type="text"
                  placeholder="Tên người dùng"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="login__input-item login__input--password mb-3">
                <input
                  className="px-3"
                  type="password"
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="login__input-btn mt-5 input-50">
                <button type="submit" className="login__input-submit">
                  Đăng nhập
                </button>
              </div>
            </div>
            {errorMessage && <p className="login-error">{errorMessage}</p>}
          </form>

          <div className="login__password-forgot">
            <button className="login__password-link">Quên mật khẩu?</button>
          </div>
          <div className="login__account">
            <span className="login__account-text">Bạn chưa có tài khoản?</span>
            <Link to="/registration" className="login__account-link">
              {" "}
              Đăng ký Spotify.
            </Link>
          </div>
        </div>
        <footer className="footer__reCAPTCHA">
          <p className="footer__reCAPTCHA-text">
            <span>Trang web này được bảo vệ bởi reCAPTCHA và áp dụng </span>
            <button className="footer__reCAPTCHA-link">
              Điều khoản dịch vụ
            </button>
            <span> của </span>
            <button className="footer__reCAPTCHA-link">
              Chính sách quyền riêng tư
            </button>
            <span> của Google.</span>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Login;
