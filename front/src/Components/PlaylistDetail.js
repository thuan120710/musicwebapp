import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link từ react-router-dom
import styled from "styled-components";
import MusicPlayer from "./MusicPlayer"; // Import MusicPlayer
import { useParams, useHistory } from "react-router-dom";

const Container = styled.div`
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

const SongList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const SongItem = styled.li`
  display: flex;
  align-items: center;
  background: #1e1e1e;
  padding: 15px;
  margin: 10px 0;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  transition: background 0.2s, transform 0.2s;
  cursor: pointer;

  &:hover {
    background: #333333;
    transform: scale(1.02);
  }
`;

const SongDetails = styled.div`
  margin-left: 15px;
  flex-grow: 1;
  color: #e0e0e0;

  p {
    margin: 0;
  }

  p:first-child {
    font-weight: bold;
  }
`;
// Định nghĩa BackButton
const BackButton = styled.button`
  padding: 10px 15px;
  background-color: #bb86fc;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 20px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #9b63dc;
  }
`;

// Thay đổi từ Button thành Link
const StyledLink = styled(Link)`
  display: inline-block;
  padding: 10px 15px;
  background-color: #bb86fc;
  color: white;
  border: none;
  border-radius: 5px;
  text-decoration: none;
  text-align: center;
  margin-top: 20px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #9b63dc;
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

  return (
    <Container>
      <BackButton onClick={() => history.goBack()}>Trở về</BackButton>
      <Title>Danh Sách Bài Hát Trong Playlist</Title>
      <SongList>
        {songs.length > 0 ? (
          songs.map((song) => (
            <SongItem key={song._id} onClick={() => handleSongClick(song)}>
              <img
                src={`http://localhost:4000/${song.imgSrc}`}
                alt={song.songName}
                style={{ width: "50px", height: "50px", borderRadius: "5px" }}
              />
              <SongDetails>
                <p>{song.songName}</p>
                <p>{song.artist}</p>
              </SongDetails>
            </SongItem>
          ))
        ) : (
          <p>Playlist này chưa có bài hát</p>
        )}
      </SongList>

      <StyledLink to={`/playlist/${playlistId}/add-songs`}>
        Thêm bài hát vào playlist
      </StyledLink>

      {/* Hiển thị MusicPlayer nếu có bài hát được chọn */}
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
