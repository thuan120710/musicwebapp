import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "../styles/search.css";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import { FaUserCircle } from "react-icons/fa";

export default function Header({ onSearch, onPrevSlide, onNextSlide }) {
  const history = useHistory();
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Lấy thông tin user từ localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  // Xử lý logout
  const handleLogout = () => {
    // Xóa token và thông tin user khỏi localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Chuyển hướng người dùng về trang login
    window.location.href = "/login";
  };

  const handleProfileClick = () => {
    window.location.href = "/user-profile";
  };

  const handleButtonClick = () => {
    window.location.href = "/favorites";
  };

  // Hàm logic trở về trang chủ
  const handleHomeClick = () => {
    history.push("/");
  };

  // Hàm logic tìm kiếm theo tên nhạc
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className="container-fluid" style={{ backgroundColor: "black" }}>
      <header>
        <div className="row pt-4" style={{ backgroundColor: "black" }}>
          <div className="col-md-2 header__logo"></div>
          <div className="col-md-5 header__middle d-flex justify-content-center">
            {/* Nút điều khiển bên trái và bên phải */}
            <button
              className="header__middle-RxCare header__middle-RxCare--Left rounded-full hover-btn"
              onClick={onPrevSlide}
            >
              <RxCaretLeft size={35} className="text-white" />
            </button>
            <button
              className="header__middle-RxCare header__middle-RxCare--Right rounded-full hover-btn"
              onClick={onNextSlide}
            >
              <RxCaretRight size={35} className="text-white" />
            </button>

            {/* Nút trở về trang chủ */}
            <div className="header__home hover-btn" onClick={handleHomeClick}>
              <i className="header__home-icon fa-solid fa-house" />
            </div>

            {/* Input tìm kiếm tên nhạc */}
            <div className="header__search d-flex">
              <div className="header__search-icon">
                <i className="header__search-icon--glass fa-solid fa-magnifying-glass" />
              </div>
              <input
                type="text"
                className="header__search-input"
                placeholder="Bạn muốn nghe nhạc gì?"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          {/* Nút đăng xuất */}
          <div className="col-md-5 header__auth d-flex justify-content-end align-items-center">
            {user && (
              <div
                className="flex items-center gap-x-2 me-4"
                style={{ fontSize: "1.6rem" }}
              >
                {user.avatarImage ? (
                  <img
                    src={user.avatarImage}
                    alt="Avatar"
                    className="rounded-full object-cover cursor-pointer"
                    onClick={handleProfileClick}
                    style={{ width: "50px", height: "50px" }}
                  />
                ) : (
                  <FaUserCircle
                    size={40}
                    className="text-white cursor-pointer"
                    onClick={handleProfileClick}
                  />
                )}
                <span className="text-white font-medium">{user.username}</span>
              </div>
            )}
            <div className="header__auth-form d-flex float-end">
              <div className="header__auth-logout">
                <button
                  className="header__auth-logout--btn header__auth-btn hover-btn"
                  type="button"
                  onClick={handleLogout}
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
