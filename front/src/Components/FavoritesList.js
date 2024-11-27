import React, { useEffect, useState } from "react";

function FavoritesList() {
  const [favorites, setFavorites] = useState([]); // Danh sách bài hát yêu thích
  const [selectedSong, setSelectedSong] = useState(null); // Bài hát được chọn

  // Fetch danh sách bài hát yêu thích từ backend
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user._id) {
          console.error("User ID không tồn tại.");
          return;
        }

        const response = await fetch(
          `http://localhost:4000/api/favorites?user_id=${user._id}`
        );

        if (response.ok) {
          const data = await response.json();
          setFavorites(data); // Lưu danh sách bài hát yêu thích vào state
        } else {
          console.error("Error fetching favorites:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, []);

  const handlePlaySong = (song) => {
    setSelectedSong(song); // Lưu bài hát được chọn vào state
  };

  const handleDeleteFavorite = async (favoriteId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user._id) {
        console.error("User ID không tồn tại.");
        return;
      }

      const response = await fetch(
        `http://localhost:4000/api/deletefavourites/${favoriteId}?user_id=${user._id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setFavorites((prev) => prev.filter((fav) => fav._id !== favoriteId)); // Cập nhật danh sách sau khi xóa
      } else {
        console.error("Error deleting favorite:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting favorite:", error);
    }
  };

  return (
    <div>
      <h1>Danh Sách Yêu Thích</h1>
      <ul>
        {favorites.map((fav) => (
          <li
            key={fav._id}
            style={{
              margin: "10px 0",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              position: "relative",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={() => handlePlaySong(fav.song_id)} // Xử lý khi click vào bài hát
              >
                <img
                  src={`http://localhost:4000/${
                    fav.song_id.imgSrc || "default.jpg"
                  }`}
                  alt={fav.song_id.songName || "No Name"}
                  style={{
                    width: "50px",
                    height: "50px",
                    objectFit: "cover",
                    marginRight: "10px",
                  }}
                />
                <div>
                  <h3>{fav.song_id.songName}</h3>
                  <p>Nghệ sĩ: {fav.song_id.artist || "Không rõ"}</p>
                </div>
              </div>
              <button
                onClick={() => handleDeleteFavorite(fav._id)} // Gọi hàm xóa
                style={{
                  backgroundColor: "#ff4d4f",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  padding: "5px 10px",
                  cursor: "pointer",
                }}
              >
                Xóa
              </button>
            </div>
          </li>
        ))}
      </ul>

      {selectedSong && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            border: "1px solid #ccc",
          }}
        >
          <h2>Đang phát: {selectedSong.songName || "Không rõ tên bài hát"}</h2>
          <img
            src={`http://localhost:4000/${
              selectedSong.imgSrc || "default.jpg"
            }`}
            alt={selectedSong.songName || "Không có ảnh"}
            style={{ width: "150px", height: "150px", objectFit: "cover" }}
          />
          <audio
            controls
            autoPlay
            src={`http://localhost:4000/${selectedSong.song || ""}`}
          >
            Trình duyệt của bạn không hỗ trợ audio.
          </audio>
        </div>
      )}
    </div>
  );
}

export default FavoritesList;
