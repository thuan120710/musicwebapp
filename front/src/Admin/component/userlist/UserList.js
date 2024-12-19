import React, { useState, useEffect } from "react";
import axios from "axios";
import UserForm from "./UserForm";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../userlist/UserList.css";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(false); // Trạng thái để hiển thị form
  const [searchQuery, setSearchQuery] = useState(""); // Trạng thái lưu giá trị tìm kiếm

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Đã có lỗi khi tải người dùng.");
      }
    };

    fetchUsers();
  }, []);

  // Hàm tìm kiếm người dùng
  const filteredUsers = users.filter((user) => {
    return (
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) || // Kiểm tra username
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) // Kiểm tra email
    );
  });

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`/api/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Xóa người dùng thành công!");
      setUsers(users.filter((user) => user._id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Đã có lỗi khi xóa người dùng.");
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
  };

  const handleUpdate = (updatedUser) => {
    setUsers(
      users.map((user) => (user._id === updatedUser._id ? updatedUser : user))
    );
    setEditingUser(null);
    toast.success("Cập nhật người dùng thành công!");
  };

  const handleAddUser = (newUser) => {
    setUsers([...users, newUser]);
    toast.success("Thêm người dùng thành công!");
  };

  const toggleForm = () => {
    setShowForm(!showForm); // Chuyển đổi trạng thái của form
    setEditingUser(null); // Đảm bảo form luôn ở trạng thái thêm mới khi mở ra
  };

  // Hàm xử lý thay đổi giá trị ô tìm kiếm
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // Cập nhật giá trị tìm kiếm
  };

  return (
    <div className="user-list">
      <h2>Danh Sách Người Dùng</h2>

      {/* Tính năng tìm kiếm */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Tìm kiếm theo Username hoặc Email..."
          value={searchQuery}
          onChange={handleSearchChange} // Gọi hàm khi giá trị tìm kiếm thay đổi
        />
      </div>

      <button onClick={toggleForm} className="add-user-btn">
        {showForm ? "Hủy" : "Thêm Người Dùng"}
      </button>

      {showForm && <UserForm onSubmit={handleAddUser} />}

      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Vai trò</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button onClick={() => handleEdit(user)}>Sửa</button>
                  <button onClick={() => handleDelete(user._id)}>Xóa</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">Không tìm thấy người dùng nào.</td>
            </tr>
          )}
        </tbody>
      </table>

      {editingUser ? (
        <UserForm user={editingUser} onSubmit={handleUpdate} />
      ) : null}
    </div>
  );
};

export default UserList;
