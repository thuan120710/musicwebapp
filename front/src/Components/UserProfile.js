import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/UserProfile.css";

const UserProfile = () => {
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [avatar, setAvatar] = useState(null); // Lưu trữ ảnh người dùng mới

  // Lấy thông tin người dùng từ localStorage khi component mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user._id) {
      setUserId(user._id); // Lưu userId từ localStorage
    } else {
      console.error("Không tìm thấy ID người dùng trong localStorage");
    }
  }, []); // Chạy 1 lần khi component mount

  // Lấy thông tin người dùng khi userId thay đổi
  useEffect(() => {
    if (userId) {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Gửi yêu cầu đến API để lấy dữ liệu người dùng
      axios
        .get(`/api/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUserData(response.data);
          setFormData(response.data);
          setLoading(false);
          setAvatar(response.data.avatarImage); // Cập nhật lại avatar sau khi lấy thông tin người dùng
        })
        .catch((error) => {
          setLoading(false);
          setError("Lỗi khi tải dữ liệu người dùng.");
          console.error("Lỗi khi lấy dữ liệu người dùng:", error);
        });
    }
  }, [userId]);

  // Xử lý thay đổi trong form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Xử lý chọn ảnh
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const avatarUrl = URL.createObjectURL(file); // Lưu trữ ảnh mới và tạo URL tạm thời để hiển thị
      setAvatar(avatarUrl); // Cập nhật ảnh mới vào state ngay lập tức
      setFormData({ ...formData, avatarImage: file }); // Lưu file ảnh vào formData
    }
  };

  // Lưu thông tin khi người dùng nhấn Save
  const handleSave = () => {
    const token = localStorage.getItem("token");

    // Tạo form data để gửi ảnh lên server
    const formDataToSend = new FormData();

    // Nếu có ảnh mới, thêm vào FormData
    if (formData.avatarImage) {
      formDataToSend.append("avatarImage", formData.avatarImage);
    }

    // Thêm các dữ liệu khác vào FormData
    formDataToSend.append("username", formData.username);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("bio", formData.bio);
    formDataToSend.append("phoneNumber", formData.phoneNumber);
    formDataToSend.append("address", formData.address);

    // Gửi PUT request để cập nhật dữ liệu người dùng
    axios
      .put(`/api/profile/${userId}`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // Cần để gửi file
        },
      })
      .then((response) => {
        setUserData(response.data); // Cập nhật lại dữ liệu người dùng từ server
        setFormData(response.data); // Cập nhật formData mới
        setIsEditing(false); // Hủy chế độ chỉnh sửa

        // Cập nhật lại avatar mới từ server
        setAvatar(response.data.avatarImage); // Đảm bảo rằng server trả về URL đúng

        // Reload lại trang sau khi cập nhật
        window.location.reload();
      })
      .catch((error) => {
        setError("Lỗi khi cập nhật thông tin người dùng.");
        console.error("Lỗi khi cập nhật thông tin người dùng:", error);
      });
  };

  // Hủy chỉnh sửa và khôi phục lại dữ liệu ban đầu
  const handleCancel = () => {
    setFormData(userData); // Khôi phục lại dữ liệu ban đầu
    setAvatar(userData.avatarImage); // Khôi phục avatar khi hủy
    setIsEditing(false);
  };

  // Hiển thị khi đang tải hoặc có lỗi
  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="user-profile">
      <h2>Thông tin người dùng</h2>

      <div className="profile-picture">
        <img
          src={
            avatar || userData.avatarImage || "https://via.placeholder.com/150"
          }
          alt="Avatar"
        />

        {isEditing && (
          <div>
            <input
              type="file"
              onChange={handleAvatarChange} // Chọn ảnh
              accept="image/*" // Chỉ chấp nhận file ảnh
            />
          </div>
        )}
      </div>

      <div className="profile-info">
        <label>Email:</label>
        <p>{userData.email}</p>

        <label>Tên người dùng:</label>
        {isEditing ? (
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
          />
        ) : (
          <p>{userData.username}</p>
        )}

        <label>Họ tên:</label>
        {isEditing ? (
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
          />
        ) : (
          <p>{userData.fullName}</p>
        )}

        <label>Tiểu sử:</label>
        {isEditing ? (
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
          />
        ) : (
          <p>{userData.bio}</p>
        )}

        <label>Địa chỉ:</label>
        {isEditing ? (
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
          />
        ) : (
          <p>{userData.address}</p>
        )}

        <label>Số điện thoại:</label>
        {isEditing ? (
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
          />
        ) : (
          <p>{userData.phoneNumber}</p>
        )}
      </div>

      <div className="profile-actions">
        {isEditing ? (
          <>
            <button onClick={handleSave}>Lưu</button>
            <button onClick={handleCancel}>Hủy</button>
          </>
        ) : (
          <button onClick={() => setIsEditing(true)}>Chỉnh sửa</button>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
