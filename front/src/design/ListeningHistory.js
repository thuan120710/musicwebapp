import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";

const ListeningHistory = ({ userId, onSongSelect }) => {
  const [history, setHistory] = useState([]);

  // Fetch lịch sử nghe nhạc khi component mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/listening-history/${userId}`
        );
        // Kiểm tra xem có lịch sử nghe nhạc không
        if (
          response.data.listeningHistory &&
          response.data.listeningHistory.length > 0
        ) {
          setHistory(response.data.listeningHistory);
        } else {
          console.warn("Không có lịch sử nghe nhạc.");
          setHistory([]); // Cập nhật lịch sử thành mảng rỗng nếu không có dữ liệu
        }
      } catch (error) {
        console.error("Lỗi khi lấy lịch sử nghe nhạc:", error);
      }
    };

    fetchHistory();
  }, [userId]);

  // Hàm để định dạng thời gian và ngày thực tế
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

  return (
    <Container>
      <Title>Lịch sử nghe nhạc</Title>
      <SongList>
        {/* Nếu không có lịch sử nghe nhạc thì hiển thị thông báo */}
        {history.length === 0 ? (
          <Message>Không có lịch sử nghe nhạc nào.</Message>
        ) : (
          history.map((entry, index) => (
            <Song
              key={index}
              onClick={() =>
                onSongSelect({
                  song: entry.song?.songURL, // Song URL
                  imgSrc: entry.song?.imgSrc, // Hình ảnh bài hát
                  songName: entry.song?.songName || "Unknown Song", // Tên bài hát, fallback nếu không có
                  artist: entry.song?.artist || "Unknown Artist", // Tên nghệ sĩ, fallback nếu không có
                })
              }
            >
              <SongImage
                src={
                  entry.song?.imgSrc
                    ? `http://localhost:4000/${entry.song.imgSrc}` // Nếu có hình ảnh, hiển thị từ server
                    : "/path_to_default_image/default_image.jpg" // Nếu không có, dùng ảnh mặc định
                }
                alt={entry.song?.songName || "Unknown Song"} // Nếu không có tên bài hát, dùng "Unknown Song"
              />

              <SongInfo>
                <SongName>{entry.song?.songName || "Unknown Song"}</SongName>
                <Artist>{entry.song?.artist || "Unknown Artist"}</Artist>
                <Time>Nghe vào: {formatDateTime(entry.listenedAt)}</Time>
              </SongInfo>
            </Song>
          ))
        )}
      </SongList>
    </Container>
  );
};

// Styled Components
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

const Time = styled.p`
  font-size: 12px;
  color: #999;
`;

const Message = styled.p`
  text-align: center;
  color: #999;
`;

export default ListeningHistory;
