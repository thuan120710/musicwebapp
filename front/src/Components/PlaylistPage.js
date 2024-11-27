import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const PageContainer = styled.div`
  padding: 20px;
  background-color: #121212;
  color: #e0e0e0;
  min-height: 100vh;
`;

const Title = styled.h2`
  color: #bb86fc;
  text-align: center;
  margin-bottom: 20px;
`;

const PlaylistContainer = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const PlaylistItem = styled.li`
  background: #1e1e1e;
  color: #ffffff;
  padding: 15px;
  margin: 10px 0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);

  &:hover {
    background: #333333;
    transform: scale(1.02);
  }
`;

const Input = styled.input`
  padding: 10px;
  background: #333333;
  color: #e0e0e0;
  border: 1px solid #444;
  border-radius: 5px;
  width: calc(100% - 130px);
  margin-right: 5px;

  &::placeholder {
    color: #aaa;
  }
`;

const Button = styled.button`
  padding: 10px 15px;
  background-color: #bb86fc;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #9b63dc;
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
          <Link
            to={`/playlist/${playlist._id}`}
            key={playlist._id}
            style={{ textDecoration: "none" }}
          >
            <PlaylistItem>{playlist.name}</PlaylistItem>
          </Link>
        ))}
      </PlaylistContainer>
    </PageContainer>
  );
}

export default PlaylistPage;
