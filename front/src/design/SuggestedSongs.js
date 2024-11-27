import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";

const SuggestedSongs = ({ userId, onSongSelect }) => {
  const [suggestedSongs, setSuggestedSongs] = useState([]); // Trạng thái lưu danh sách bài hát gợi ý
  const [loading, setLoading] = useState(false); // Trạng thái loading để hiển thị khi dữ liệu đang được tải
  const [error, setError] = useState(null); // Trạng thái lỗi nếu có lỗi khi gọi API

  // Hàm gọi API để lấy các bài hát gợi ý dựa trên userId
  const fetchSuggestedSongs = async () => {
    setLoading(true); // Bắt đầu trạng thái loading
    setError(null); // Reset lỗi trước khi gọi API
    try {
      const response = await axios.get(
        `http://localhost:4000/api/suggested-songs/${userId}`
      );
      console.log("Suggested Songs:", response.data.suggestedSongs); // Kiểm tra dữ liệu trả về từ API
      setSuggestedSongs(response.data.suggestedSongs); // Cập nhật trạng thái danh sách bài hát
    } catch (error) {
      console.error("Error fetching suggested songs:", error);
      setError("Không thể tải gợi ý bài hát. Vui lòng thử lại sau."); // Đặt lỗi nếu gọi API thất bại
    }
    setLoading(false); // Kết thúc trạng thái loading
  };

  // Gọi API lần đầu khi component mount để lấy bài hát gợi ý
  useEffect(() => {
    if (userId) {
      fetchSuggestedSongs();
    }
  }, [userId]);

  // Hàm xử lý khi người dùng chọn bài hát từ danh sách
  const handleSongSelect = (song) => {
    onSongSelect(song); // Gọi hàm từ props để xử lý bài hát được chọn
  };

  // Hàm làm mới danh sách bài hát khi nhấn nút refresh
  const handleRefresh = () => {
    fetchSuggestedSongs(); // Gọi lại API để lấy các bài hát ngẫu nhiên khác
  };

  return (
    <Container>
      <Title>Gợi ý nhạc</Title>
      {/* Nút làm mới bài hát */}
      <Button onClick={handleRefresh} disabled={loading}>
        {loading ? "Đang tải..." : "Làm mới danh sách"}
      </Button>

      {/* Kiểm tra trạng thái loading, lỗi và hiển thị thông báo */}
      {loading && <Message>Đang tải bài hát...</Message>}
      {error && <Message>{error}</Message>}

      {/* Hiển thị danh sách bài hát gợi ý nếu có */}
      <SongList>
        {suggestedSongs.length === 0 && !loading && !error ? (
          <Message>Không có bài hát nào để gợi ý.</Message>
        ) : (
          suggestedSongs.map((song, index) => (
            <Song key={index} onClick={() => handleSongSelect(song)}>
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
          ))
        )}
      </SongList>
    </Container>
  );
};

// Styled Components để tạo các thành phần giao diện
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

const Button = styled.button`
  display: block;
  margin: 10px auto;
  padding: 8px 16px;
  background-color: #ffa500;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #ff7f00;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
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

const Message = styled.p`
  text-align: center;
  color: #999;
`;

export default SuggestedSongs;
