import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import MusicPlayer from "./MusicPlayer";
import { useParams, useHistory } from "react-router-dom";
import "../styles/PlaylistDetail.css";

// Styled Components với cải tiến giao diện
const Container = styled.div`
  padding: 20px;
  background-color: #000; /* Nền đen */
  color: #e0e0e0;
  min-height: 100vh;
  width: 100%;
  font-family: "Arial", sans-serif;
`;

const Title = styled.h2`
  color: #1ed760; /* Màu xanh neon */
  text-align: center;
  margin-bottom: 20px;
  font-size: 40px;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 0 0 10px #1ed760;
`;

const SongList = styled.ul`
  list-style-type: none;
  padding: 0;
  max-height: 400px; /* Giới hạn chiều cao */
  overflow-y: auto; /* Cho phép cuộn dọc khi danh sách dài */
  margin-bottom: 20px;
`;

const SongItem = styled.li`
  display: flex;
  align-items: center;
  background: #121212;
  padding: 15px;
  margin: 15px auto;
  border: 2px solid transparent;
  border-radius: 10px;
  width: 80%;
  max-width: 800px;
  box-shadow: 0 0 10px #1ed760;
  transition: all 0.3s ease-in-out;

  &:hover {
    border-color: #1ed760;
    transform: translateY(-5px) scale(1.03);
    background: #1a1a1a;
  }
`;

const SongImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 8px;
  border: 2px solid #1ed760;
`;

const SongDetails = styled.div`
  margin-left: 20px;
  flex-grow: 1;
  color: #e0e0e0;

  p {
    margin: 0;
    font-size: 18px;
  }

  p:first-child {
    font-weight: bold;
    font-size: 20px;
    color: #1ed760;
  }
`;

const RemoveButton = styled.button`
  padding: 8px 12px;
  background-color: #e57373;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 0 0 8px rgba(255, 0, 0, 0.6);
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #b71c1c;
    transform: scale(1.1);
  }
`;

const BackButton = styled.button`
  padding: 10px 15px;
  background-color: #1ed760;
  color: black;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  margin-bottom: 20px;
  box-shadow: 0 0 10px #1ed760;
  transition: all 0.3s ease;

  &:hover {
    background-color: #00c853;
    transform: scale(1.05);
  }
`;

const StyledLink = styled(Link)`
  display: block;
  padding: 12px 20px;
  margin: 20px auto;
  background-color: #1ed760;
  color: black;
  text-align: center;
  border-radius: 5px;
  text-decoration: none;
  font-weight: bold;
  box-shadow: 0 0 10px #1ed760;
  width: 200px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #00c853;
    transform: scale(1.05);
    color: black;
  }
`;

function PlaylistDetail({ match }) {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const playlistId = match.params.id;
  const history = useHistory();

  useEffect(() => {
    const fetchPlaylistSongs = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/api/playlists/${playlistId}/songs`
        );
        const data = await response.json();
        setSongs(data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách bài hát từ playlist:", error);
      }
    };
    fetchPlaylistSongs();
  }, [playlistId]);

  const handleSongClick = (song) => {
    setCurrentSong(song); // Cập nhật bài hát hiện tại
  };

  const handleRemoveSong = async (songId) => {
    try {
      const response = await fetch(
        "http://localhost:4000/api/playlist/remove-song",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            playlistId: playlistId,
            songId: songId,
          }),
        }
      );
      if (response.ok) {
        setSongs(songs.filter((song) => song._id !== songId));
      } else {
        console.error("Lỗi khi xóa bài hát khỏi playlist");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API xóa bài hát:", error);
    }
  };

  return (
    <Container>
      <BackButton onClick={() => history.goBack()}>← Trở về</BackButton>
      <Title>Danh Sách Bài Hát</Title>
      <SongList>
        {songs.length > 0 ? (
          songs.map((song) => (
            <SongItem key={song._id} onClick={() => handleSongClick(song)}>
              <SongImage
                src={`http://localhost:4000/${song.imgSrc}`}
                alt={song.songName}
              />
              <SongDetails>
                <p>{song.songName}</p>
                <p>{song.artist}</p>
              </SongDetails>
              <RemoveButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveSong(song._id);
                }}
              >
                Xóa
              </RemoveButton>
            </SongItem>
          ))
        ) : (
          <p style={{ textAlign: "center", color: "#888" }}>
            Playlist này chưa có bài hát
          </p>
        )}
      </SongList>

      <StyledLink to={`/playlist/${playlistId}/add-songs`}>
        Thêm bài hát +
      </StyledLink>

      {currentSong && (
        <MusicPlayer
          song={currentSong.song}
          imgSrc={currentSong.imgSrc}
          title={currentSong.songName}
          artist={currentSong.artist}
          currentSongId={currentSong._id}
        />
      )}
    </Container>
  );
}

export default PlaylistDetail;
