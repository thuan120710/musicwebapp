import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import "../styles/SuggestedSongs.css";

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
    <div className="container-fluid app mt-3 rounded">
      <div className="row">
        <div className="row recommended__heading pt-4 pb-2 ps-4">
          <h2 className="recommended__heading-title text-white ps-3">
            Gợi ý nhạc
          </h2>
        </div>
        <div className="row recommended__description ps-4">
          <p className="ps-3">dựa trên những gì có trong danh sách phát này</p>
        </div>
      </div>
      <div className="row mt-3 mb-5 ps-4">
        <div
          className="recommended__reload-page d-flex justify-content-center align-items-center"
          onClick={handleRefresh}
          disabled={loading}
        >
          <h4 className="recommended__reload-page--title mb-0">
            {loading ? "Đang tải..." : "Làm mới danh sách"}
          </h4>
          <i className="recommended__reload-page--icon fa-solid fa-rotate-right mt-1 ms-2" />
        </div>
      </div>

      {/* Kiểm tra trạng thái loading, lỗi và hiển thị thông báo */}
      {loading && <Message>Đang tải bài hát...</Message>}
      {error && <Message>{error}</Message>}

      <div className="row recommended__list-music px-4">
        {suggestedSongs.length === 0 && !loading && !error ? (
          <p>Không có bài hát nào để gợi ý.</p>
        ) : (
          suggestedSongs.map((song, index) => (
            <div
              className="recommended__item d-flex mb-5"
              key={index}
              onClick={() => handleSongSelect(song)}
            >
              <div className="recommended__item-image">
                <img
                  className="w-100 h-100 rounded-circle"
                  src={
                    song.imgSrc
                      ? `http://localhost:4000/${song.imgSrc}`
                      : "/path_to_default_image/default_image.jpg"
                  }
                  alt={song.songName || "Unknown Song"}
                />
              </div>
              <div
                className="recommended__item-content ms-4"
                style={{ width: "50%" }}
              >
                <h3 className="text-white fw-bold">
                  {song.songName || "Unknown Song"}
                </h3>
                <div className="recommended__item-content--artist d-flex align-items-center">
                  <i className="recommended__item-icon fa-solid fa-e" />
                  <p className="mb-0 ms-2">{song.artist || "Unknown Artist"}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const Message = styled.p`
  text-align: center;
  color: #999;
`;

export default SuggestedSongs;
