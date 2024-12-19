import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../userlist/UserForm.css";

const UserForm = ({ user, onSubmit }) => {
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    role: user?.role || "user",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        role: user.role,
        password: "",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      let response;
      if (user) {
        response = await axios.put(
          `http://localhost:4000/api/${user._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.status === 200) {
          toast.success("Cập nhật tài khoản thành công!");
          onSubmit(response.data.user);
          setFormData({ username: "", email: "", role: "user", password: "" });
        } else {
          throw new Error("Cập nhật thất bại");
        }
      } else {
        response = await axios.post("http://localhost:4000/api/add", formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.status === 201) {
          toast.success("Thêm người dùng thành công!");
          onSubmit(response.data.user);
          setFormData({ username: "", email: "", role: "user", password: "" });
        } else {
          throw new Error("Thêm người dùng thất bại");
        }
      }
    } catch (error) {
      console.error("Lỗi khi xử lý:", error);
      setErrorMessage(
        error.response
          ? error.response.data.message
          : "Đã xảy ra lỗi, vui lòng thử lại."
      );
      toast.error(errorMessage || "Đã có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>{user ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}</h2>
      {errorMessage && <div className="message error">{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Vai trò</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleInputChange}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        {!user && (
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
        )}
        <button type="submit" disabled={loading}>
          {loading ? "Đang xử lý..." : "Lưu thông tin"}
        </button>
      </form>
    </div>
  );
};

export default UserForm;
