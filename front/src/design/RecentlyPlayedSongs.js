import React, { useState, useEffect } from "react";
import styled from "styled-components";

const RecentlyPlayedSongs = ({ setCurrentSong, audioRef, isPlaying }) => {
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);

  // Lấy danh sách từ localStorage khi component được render
  useEffect(() => {
    const storedSongs =
      JSON.parse(localStorage.getItem("recentlyPlayed")) || [];
    setRecentlyPlayed(storedSongs);
  }, []);

  const playSong = (song) => {
    setCurrentSong(song);

    // Phát bài hát
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = `http://localhost:4000/${song.song}`;
      audioRef.current.play();
    }

    // Cập nhật danh sách Recently Played
    let updatedRecentlyPlayed = [...recentlyPlayed];
    const existingIndex = updatedRecentlyPlayed.findIndex(
      (item) => item.id === song.id
    );

    if (existingIndex > -1) {
      // Nếu bài hát đã tồn tại trong danh sách, xóa nó đi và thêm lại vào đầu
      updatedRecentlyPlayed.splice(existingIndex, 1);
    }

    // Thêm bài hát vào đầu danh sách
    updatedRecentlyPlayed.unshift(song);

    // Giới hạn danh sách chỉ chứa tối đa 10 bài hát
    if (updatedRecentlyPlayed.length > 10) {
      updatedRecentlyPlayed.pop(); // Xóa bài cuối nếu danh sách quá dài
    }

    // Lưu danh sách mới vào localStorage
    localStorage.setItem(
      "recentlyPlayed",
      JSON.stringify(updatedRecentlyPlayed)
    );

    // Cập nhật state để giao diện hiển thị thay đổi
    setRecentlyPlayed(updatedRecentlyPlayed);
  };

  const clearRecentlyPlayed = () => {
    localStorage.removeItem("recentlyPlayed");
    setRecentlyPlayed([]); // Xóa danh sách trong state để giao diện cập nhật
    console.log("Recently played songs have been cleared.");
  };

  return (
    <Container>
      <Title>Recently Played Songs</Title>
      <button onClick={clearRecentlyPlayed}>Clear Recently Played</button>
      {recentlyPlayed.length === 0 ? (
        <Message>No songs played recently.</Message>
      ) : (
        <SongList>
          {recentlyPlayed.map((song, index) => (
            <Song key={index} onClick={() => playSong(song)}>
              <SongImage
                src={
                  song.imgSrc
                    ? `http://localhost:4000/${song.imgSrc}`
                    : "/path_to_default_image/default_image.jpg"
                }
                alt={song.songName || "Unknown Song"}
              />
              <SongInfo>
                <SongName>{song.songName || "Unknown Song"}</SongName>
                <Artist>{song.artist || "Unknown Artist"}</Artist>
              </SongInfo>
            </Song>
          ))}
        </SongList>
      )}
    </Container>
  );
};

// Styled components
const Container = styled.div`
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: 20px auto;
`;

const Title = styled.h2`
  text-align: center;
  color: #ffa500;
`;

const SongList = styled.div`
  display: flex;
  flex-direction: column;
`;

const Song = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f0f0f0;
  }

  img {
    width: 50px;
    height: 50px;
    border-radius: 5px;
    margin-right: 10px;
  }
`;

const SongImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 5px;
  margin-right: 10px;
`;

const SongInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const SongName = styled.p`
  font-size: 16px;
  font-weight: bold;
  color: #333;
`;

const Artist = styled.p`
  font-size: 14px;
  color: #666;
`;

const Message = styled.p`
  text-align: center;
  color: #999;
`;

export default RecentlyPlayedSongs;
