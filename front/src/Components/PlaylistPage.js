import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import "../styles/PlaylistPage.css";

const PageContainer = styled.div`
  padding: 20px;
  background-color: #000; /* Màu nền đen */
  color: #1ed760; /* Màu chữ xanh neon */
  min-height: 100vh;
  width: 80vw;
  font-size: 25px;
`;

const Title = styled.h2`
  color: #1ed760; /* Tiêu đề màu xanh neon */
  text-align: center;
  margin-bottom: 20px;
  text-shadow: 0 0 8px #1ed760; /* Hiệu ứng đèn neon */
`;

const PlaylistContainer = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const PlaylistItem = styled.li`
  background: #121212; /* Nền danh sách playlist */
  color: #ffffff;
  padding: 15px;
  margin: 10px 0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 0 10px #1ed760; /* Shadow xanh neon */
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: scale(1.02);
    background: #1ed760; /* Hover đổi màu */
    color: #000;
  }
`;

const Input = styled.input`
  padding: 10px;
  background: #333333; /* Input màu xám */
  color: #1ed760;
  border: 1px solid #1ed760;
  border-radius: 5px;
  width: calc(100% - 130px);
  margin-right: 5px;

  &::placeholder {
    color: #aaa;
  }
`;

const Button = styled.button`
  padding: 10px 15px;
  background-color: #1ed760; /* Nút xanh neon */
  color: #000;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #00c853; /* Màu xanh neon đậm hơn */
    box-shadow: 0 0 10px #1ed760;
  }
`;

const RemoveButton = styled.button`
  padding: 5px 10px;
  background-color: #d32f2f;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #b71c1c;
  }
`;

function PlaylistPage() {
  const [playlists, setPlaylists] = useState([]);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const userId = JSON.parse(localStorage.getItem("user"))._id;

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/api/playlists/${userId}`
        );
        const data = await response.json();
        setPlaylists(data);
      } catch (error) {
        console.error("Lỗi khi lấy playlist:", error);
      }
    };
    fetchPlaylists();
  }, [userId]);

  const createPlaylist = async () => {
    if (!newPlaylistName) return;
    try {
      const response = await fetch("http://localhost:4000/api/playlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, name: newPlaylistName }),
      });
      const data = await response.json();
      setPlaylists([...playlists, data]);
      setNewPlaylistName("");
    } catch (error) {
      console.error("Lỗi khi tạo playlist:", error);
    }
  };

  const deletePlaylist = async (playlistId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/playlist/${playlistId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setPlaylists(
          playlists.filter((playlist) => playlist._id !== playlistId)
        );
      } else {
        console.error("Lỗi khi xóa playlist");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API xóa playlist:", error);
    }
  };

  return (
    <PageContainer>
      <Title>Danh Sách Playlist</Title>
      <div style={{ display: "flex", marginBottom: "20px" }}>
        <Input
          type="text"
          placeholder="Tên playlist mới"
          value={newPlaylistName}
          onChange={(e) => setNewPlaylistName(e.target.value)}
        />

        <Button onClick={createPlaylist}>Tạo Playlist</Button>
      </div>

      <PlaylistContainer>
        {playlists.map((playlist) => (
          <PlaylistItem key={playlist._id}>
            <Link
              to={`/playlist/${playlist._id}`}
              style={{ textDecoration: "none", color: "#1ed760" }}
            >
              {playlist.name}
            </Link>
            <RemoveButton onClick={() => deletePlaylist(playlist._id)}>
              Xóa
            </RemoveButton>
          </PlaylistItem>
        ))}
      </PlaylistContainer>
    </PageContainer>
  );
}

export default PlaylistPage;
