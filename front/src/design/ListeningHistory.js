import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import MusicPlayer from "../Components/MusicPlayer"; // Import MusicPlayer component

const ListeningHistory = ({ onSongSelect }) => {
  const [history, setHistory] = useState([]);
  const [userId, setUserId] = useState(null);
  const [selectedSong, setSelectedSong] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser._id) {
          setUserId(parsedUser._id);
        } else {
          console.error("User _id not found.");
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    } else {
      console.error("User data not found in localStorage.");
    }
  }, []);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!userId) return;

      try {
        const response = await axios.get(
          `http://localhost:4000/api/listening-history/${userId}`
        );

        if (
          response.data.listeningHistory &&
          response.data.listeningHistory.length > 0
        ) {
          setHistory(response.data.listeningHistory);
        } else {
          console.warn("No listening history.");
          setHistory([]);
        }
      } catch (error) {
        console.error("Error fetching listening history:", error);
      }
    };

    fetchHistory();
  }, [userId]);

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(date);
  };

  const handleDeleteHistory = async (songId) => {
    try {
      const response = await axios.delete(
        `http://localhost:4000/api/listening-history/${userId}/${songId}`
      );
      alert(response.data.message);
      setHistory(history.filter((entry) => entry.song._id !== songId));
    } catch (error) {
      console.error("Error deleting history:", error);
      alert("Lỗi khi xóa bài hát khỏi lịch sử.");
    }
  };

  return (
    <Container>
      <ContentWrapper>
        <Title>Lịch sử nghe nhạc</Title>
        <SongList>
          {history.length === 0 ? (
            <Message>Không có lịch sử nghe nhạc nào.</Message>
          ) : (
            history.map((entry, index) => (
              <Song
                key={index}
                onClick={() => {
                  setSelectedSong({
                    song: entry.song?.song,
                    imgSrc: entry.song?.imgSrc,
                    songName: entry.song?.songName || "Unknown Song",
                    artist: entry.song?.artist || "Unknown Artist",
                  });
                }}
              >
                <SongImage
                  src={
                    entry.song?.imgSrc
                      ? `http://localhost:4000/${entry.song.imgSrc}`
                      : "/path_to_default_image/default_image.jpg"
                  }
                  alt={entry.song?.songName || "Unknown Song"}
                />
                <SongInfo>
                  <SongName>{entry.song?.songName || "Unknown Song"}</SongName>
                  <Artist>{entry.song?.artist || "Unknown Artist"}</Artist>
                  <Time>Nghe vào: {formatDateTime(entry.listenedAt)}</Time>
                  <DeleteButton
                    onClick={() => handleDeleteHistory(entry.song._id)}
                  >
                    Xóa khỏi lịch sử
                  </DeleteButton>
                </SongInfo>
              </Song>
            ))
          )}
        </SongList>
        {selectedSong && (
          <MusicPlayer
            song={selectedSong.song}
            imgSrc={selectedSong.imgSrc}
            currentSongId={selectedSong._id}
          />
        )}
      </ContentWrapper>
    </Container>
  );
};

// Styled Components với màu xanh lá và nền tối
const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 20px;
  background-color: #0d1b2a; /* Nền xanh đen */
  display: flex;
  justify-content: center;
`;

const ContentWrapper = styled.div`
  max-width: 900px;
  width: 100%;
  background-color: #1b263b; /* Nền xanh đậm */
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
`;

const Title = styled.h2`
  text-align: center;
  font-size: 28px;
  color: #4caf50; /* Xanh lá cây */
  margin-bottom: 20px;
  font-weight: bold;
`;

const SongList = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 600px; /* Chiều cao tối đa của danh sách */
  overflow-y: auto; /* Hiển thị thanh cuộn dọc khi quá nhiều mục */
  padding-right: 10px; /* Đảm bảo không bị cắt nội dung khi thanh cuộn xuất hiện */

  /* Tùy chỉnh thanh cuộn cho hiện đại */
  &::-webkit-scrollbar {
    width: 8px; /* Độ rộng thanh cuộn */
  }

  &::-webkit-scrollbar-track {
    background: #112240; /* Màu nền của thanh cuộn */
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #4caf50; /* Màu xanh lá cho thanh kéo */
    border-radius: 10px;
    border: 2px solid #112240; /* Viền tạo khoảng cách với nền */
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #388e3c; /* Màu đậm hơn khi hover */
  }
`;

const Song = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  padding: 15px;
  background-color: #112240; /* Xanh navy đậm */
  border: 1px solid #4caf50; /* Viền xanh lá */
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 15px rgba(76, 175, 80, 0.5); /* Đổ bóng xanh lá */
  }
`;

const SongImage = styled.img`
  width: 70px;
  height: 70px;
  border-radius: 10px;
  margin-right: 20px;
  border: 2px solid #4caf50;
`;

const SongInfo = styled.div`
  display: flex;
  flex-direction: column;
  color: #e0f2f1; /* Màu chữ trắng xanh nhạt */
`;

const SongName = styled.p`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
`;

const Artist = styled.p`
  font-size: 16px;
  color: #80cbc4;
  margin-bottom: 5px;
`;

const Time = styled.p`
  font-size: 14px;
  color: #b2dfdb;
`;

const DeleteButton = styled.button`
  margin-top: 10px;
  align-self: flex-start;
  background-color: #388e3c; /* Xanh lá đậm */
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #2e7d32; /* Màu đậm hơn */
  }
`;

const Message = styled.p`
  text-align: center;
  font-size: 18px;
  color: #cfd8dc;
`;

export default ListeningHistory;
