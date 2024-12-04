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
    <div className="music-recommendations">
      <h3>Gợi Ý Nhạc</h3>
      {loading ? (
        <p>Đang tải...</p>
      ) : recommendedSongs.length > 0 ? (
        <ul className="song-list">
          {recommendedSongs.map((song) => (
            <li
              key={song._id}
              className="song-item"
              onClick={() => handleSongClick(song)}
            >
              <div className="song-card">
                <img
                  src={song.imgSrc}
                  alt={song.songName}
                  className="song-img"
                />
                <h4>{song.songName}</h4>
                <p>{song.artist}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Không có gợi ý nhạc</p>
      )}

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
