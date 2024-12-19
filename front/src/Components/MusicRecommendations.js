import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/MusicRecommendations.css"; // Thêm file CSS để tùy chỉnh
import MusicPlayer from "./MusicPlayer"; // Import MusicPlayer để sử dụng trong đây

const MusicRecommendations = ({ songId }) => {
  const [recommendedSongs, setRecommendedSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSong, setSelectedSong] = useState(null); // Để lưu bài hát đã chọn
  const [userId, setUserId] = useState(null); // State để lưu userId

  // Lấy userId từ localStorage
  useEffect(() => {
    const user = localStorage.getItem("user"); // Lấy thông tin user từ localStorage
    if (user) {
      setUserId(JSON.parse(user)._id); // Giả sử dữ liệu user là JSON và có trường 'id'
    }
  }, []); // Lấy userId khi component mount

  useEffect(() => {
    if (!userId) {
      console.error("User ID is not provided or invalid.");
      setLoading(false); // Dừng tải nếu không có userId
      return; // Dừng xử lý nếu không có userId
    }

    // Fetch data gợi ý nhạc từ API
    fetch(`/api/hybrid-recommendations/${userId}/${songId}`)
      .then((res) => res.json())
      .then((data) => {
        setRecommendedSongs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching recommendations:", err);
        setLoading(false); // Dừng tải nếu có lỗi
      });
  }, [userId, songId]); // Fetch lại khi userId hoặc songId thay đổi
  console.log("User", userId, songId); //
  const handleSongClick = (song) => {
    setSelectedSong(song); // Lưu bài hát được chọn vào state
  };

  return (
    <div className="music-recommendations container-fluid mt-3 rounded">
      {/* Tiêu đề */}
      <div className="recommended__heading pt-4 pb-2 ps-4">
        <h2 className="recommended__heading-title text-white ps-3">
          Gợi Ý Nhạc
        </h2>
      </div>

      {/* Mô tả */}
      <div className="recommended__description ps-4">
        <p className="ps-3">Dựa trên những gì có trong danh sách phát này</p>
      </div>

      {/* Nút Làm Mới */}
      {/* <div className="recommended__reload-page d-flex justify-content-center align-items-center mt-3 mb-4 ps-4">
        <h4 className="recommended__reload-page--title mb-0">
          {loading ? "Đang tải..." : "Làm mới danh sách"}
        </h4>
        <i className="recommended__reload-page--icon fa-solid fa-rotate-right mt-1 ms-2"></i>
      </div> */}

      {/* Kiểm tra danh sách nhạc */}
      <div className="recommended__list-music px-4">
        {loading ? (
          <p className="text-white">Đang tải...</p>
        ) : Array.isArray(recommendedSongs) && recommendedSongs.length > 0 ? (
          recommendedSongs.map((song, index) => (
            <div
              key={index}
              className="recommended__item d-flex mb-4"
              onClick={() => handleSongClick(song)}
            >
              {/* Hình ảnh bài hát */}
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
              {/* Nội dung bài hát */}
              <div
                className="recommended__item-content d-flex justify-content-between align-items-center ms-4"
                style={{ width: "50%" }}
              >
                <h3 className="text-white fw-bold">{song.songName}</h3>
                <div className="recommended__item-content--artist d-flex align-items-center">
                  <i className="recommended__item-icon fa-solid fa-music" />
                  <p className="mb-0 ms-2">{song.artist || "Unknown Artist"}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-white">Không có gợi ý nhạc</p>
        )}
      </div>

      {/* Hiển thị MusicPlayer nếu đã chọn bài hát */}
      {selectedSong && (
        <MusicPlayer
          song={selectedSong.song}
          imgSrc={selectedSong.imgSrc}
          currentSongId={selectedSong._id}
        />
      )}
    </div>
  );
};

export default MusicRecommendations;
