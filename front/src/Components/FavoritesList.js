import React, { useEffect, useState } from "react";
import styled from "styled-components";
// Các thành phần CSS styled-components
const PageContainer = styled.div`
  padding: 20px;
  background-color: #121212; /* Nền đen xám */
  color: #e0e0e0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  font-family: "Poppins", sans-serif;
`;

const Title = styled.h1`
  color: #4caf50; /* Xanh lá cây */
  text-align: center;
  margin-bottom: 30px;
  font-size: 2.5rem;
  font-weight: bold;
`;

const BackButton = styled.button`
  align-self: flex-start;
  background-color: #4caf50; /* Nút xanh lá */
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 15px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: #388e3c; /* Màu đậm hơn khi hover */
    transform: scale(1.05);
  }
`;

const ListContainer = styled.ul`
  list-style-type: none;
  padding: 5px;
  width: 100%;
  max-width: 900px;
  border: 2px solid #388e3c;
`;

const ListItem = styled.li`
  background: #1e1e1e;
  color: #ffffff;
  padding: 15px;
  margin: 15px 0;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  border: 2px solid #388e3c;

  &:hover {
    background: #333333;
    transform: translateY(-5px);
  }
`;

const SongInfo = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const SongImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 15px;
  border: 2px solid #4caf50; /* Viền xanh lá */
`;

const SongDetails = styled.div`
  h3 {
    margin: 0;
    font-size: 1.2rem;
    color: #e0e0e0;
  }

  p {
    margin: 5px 0 0;
    font-size: 0.9rem;
    color: #aaaaaa;
  }
`;

const DeleteButton = styled.button`
  background-color: #ff5252;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #d32f2f;
  }
`;

const NowPlaying = styled.div`
  margin-top: 20px;
  padding: 20px;
  background: #1e1e1e;
  border: 1px solid #333;
  border-radius: 10px;
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  align-items: center;

  h2 {
    color: #4caf50; /* Xanh lá */
    margin-bottom: 15px;
  }

  img {
    width: 150px;
    height: 150px;
    object-fit: cover;
    border-radius: 10px;
    margin-bottom: 15px;
    border: 3px solid #4caf50;
  }

  audio {
    width: 100%;
  }
`;

function FavoritesList() {
  const [favorites, setFavorites] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);

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
          setFavorites(data);
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
    setSelectedSong(song);
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
        setFavorites((prev) =>
          prev.filter((fav) => fav.song_id?._id !== favoriteId)
        );
      } else {
        console.error("Error deleting favorite:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting favorite:", error);
    }
  };

  return (
    <PageContainer>
      <Title>Danh Sách Yêu Thích</Title>
      <ListContainer>
        {favorites.map((fav) => (
          <ListItem key={fav._id}>
            <SongInfo onClick={() => handlePlaySong(fav.song_id)}>
              <SongImage
                src={`http://localhost:4000/${
                  fav.song_id.imgSrc || "default.jpg"
                }`}
                alt={fav.song_id.songName || "No Name"}
              />
              <SongDetails>
                <h3>{fav.song_id.songName}</h3>
                <p>Nghệ sĩ: {fav.song_id.artist || "Không rõ"}</p>
              </SongDetails>
            </SongInfo>
            <DeleteButton
              onClick={() => handleDeleteFavorite(fav.song_id?._id)}
            >
              Xóa
            </DeleteButton>
          </ListItem>
        ))}
      </ListContainer>

      {selectedSong && (
        <NowPlaying>
          <h2>Đang phát: {selectedSong.songName || "Không rõ tên bài hát"}</h2>
          <img
            src={`http://localhost:4000/${
              selectedSong.imgSrc || "default.jpg"
            }`}
            alt={selectedSong.songName || "Không có ảnh"}
          />
          <audio
            controls
            autoPlay
            src={`http://localhost:4000/${selectedSong.song || ""}`}
          >
            Trình duyệt của bạn không hỗ trợ audio.
          </audio>
        </NowPlaying>
      )}
    </PageContainer>
  );
}

export default FavoritesList;
