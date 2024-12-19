import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  list-style-type: none;
  padding: 0;
  border: 2px solid #333; /* Thêm viền */
  border-radius: 12px; /* Bo góc */
  max-height: 600px; /* Giới hạn chiều cao */
  overflow-y: auto; /* Cho phép cuộn chuột khi vượt quá chiều cao */
  margin-bottom: 20px;
  width: 100vw;
`;

const Title = styled.h2`
  color: #1db954; /* Màu xanh lá làm điểm nhấn */
  text-align: center;
  margin-bottom: 20px;
  font-size: 32px;
  font-weight: bold;
`;

const SearchInput = styled.input`
  padding: 12px 15px;
  font-size: 16px;
  background: #282828;
  color: #fff;
  border: 2px solid #444;
  border-radius: 8px;
  width: 100%;
  margin-bottom: 20px;

  &:focus {
    border-color: #1db954; /* Màu khi focus */
    outline: none;
  }
`;

const Tabs = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const Tab = styled.button`
  background: ${(props) => (props.active ? "#1db954" : "#333")};
  color: ${(props) => (props.active ? "#fff" : "#bbb")};
  font-size: 16px;
  padding: 10px 20px;
  margin: 0 5px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: background 0.3s, color 0.3s;

  &:hover {
    background: #1db954;
    color: #fff;
  }
`;

const SongContainer = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const SongItem = styled.li`
  display: flex;
  align-items: center;
  background: #222;
  padding: 15px;
  margin: 10px 0;
  border-radius: 12px;
  border: 1px solid #333;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;

  &:hover {
    background: #2a2a2a;
    border-color: #1db954;
    transform: translateY(-3px);
  }
`;

const SongDetails = styled.div`
  margin-left: 15px;
  flex-grow: 1;

  p {
    margin: 0;
    color: #ccc;
    font-size: 16px;

    &:first-child {
      color: #fff;
      font-weight: bold;
      font-size: 18px;
    }
  }
`;

const Button = styled.button`
  padding: 8px 12px;
  font-size: 14px;
  background-color: ${(props) => (props.disabled ? "#555" : "#1db954")};
  color: #fff;
  border: none;
  border-radius: 20px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: background-color 0.3s;

  &:hover {
    background-color: ${(props) => (props.disabled ? "#555" : "#159744")};
  }
`;

const BackButton = styled.button`
  padding: 10px 15px;
  background-color: #444;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  margin-bottom: 20px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #555;
  }
`;

function SongList() {
  const { id: playlistId } = useParams();
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [addedSongs, setAddedSongs] = useState([]);
  const [listeningHistory, setListeningHistory] = useState([]);
  const history = useHistory();

  // Fetch bài hát và thể loại
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/songs");
        console.log(response);
        const data = await response.json();
        setSongs(data);
        setFilteredSongs(data);

        // Lấy danh sách thể loại duy nhất từ các bài hát
        const uniqueCategories = [
          "All",
          "History",
          ...new Set(data.map((song) => song.category)),
        ];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách bài hát:", error);
      }
    };
    fetchSongs();
  }, []);

  // Fetch lịch sử nghe nhạc của người dùng
  const fetchListeningHistory = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user._id) {
      console.error("Không tìm thấy userId trong localStorage.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:4000/api/listening-history/${user._id}`
      );
      const data = await response.json();

      // Kiểm tra xem lịch sử có chứa bài hát hay không
      if (data.listeningHistory && data.listeningHistory.length > 0) {
        setListeningHistory(data.listeningHistory); // Cập nhật state
        setFilteredSongs(data.listeningHistory); // Lọc bài hát từ lịch sử
      } else {
        console.log("Lịch sử nghe nhạc trống.");
      }
    } catch (error) {
      console.error("Lỗi khi lấy lịch sử nghe nhạc:", error);
    }
  };

  // Hàm tìm kiếm bài hát
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    const filtered = songs.filter((song) => {
      const matchCategory = activeTab === "All" || song.category === activeTab;
      const matchSearch = song.songName
        .toLowerCase()
        .includes(term.toLowerCase());
      return matchCategory && matchSearch;
    });

    setFilteredSongs(filtered);
  };

  // Chuyển tab và lấy danh sách bài hát theo thể loại
  const handleTabClick = (category) => {
    setActiveTab(category);

    if (category === "History") {
      fetchListeningHistory();
    } else {
      const filtered = songs.filter((song) => {
        const matchCategory = category === "All" || song.category === category;
        const matchSearch = song.songName
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        return matchCategory && matchSearch;
      });

      setFilteredSongs(filtered);
    }
  };

  // Thêm bài hát vào playlist
  // Thêm bài hát vào playlist
  const addToPlaylist = async (songId) => {
    if (addedSongs.includes(songId)) {
      alert("Bài hát này đã có trong danh sách playlist rồi.");
      return; // Dừng lại nếu bài hát đã có
    }

    try {
      const response = await fetch(
        "http://localhost:4000/api/playlist/add-song",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ playlistId, songId }),
        }
      );

      if (response.ok) {
        alert("Đã thêm bài hát vào playlist");
        setAddedSongs([...addedSongs, songId]); // Thêm bài hát vào mảng addedSongs
      } else {
        console.error("Lỗi khi thêm bài hát vào playlist");
      }
    } catch (error) {
      console.error("Lỗi khi thêm bài hát vào playlist:", error);
    }
  };

  return (
    <Container>
      <BackButton onClick={() => history.goBack()}>Trở về</BackButton>
      <Title>Danh Sách Tất Cả Bài Hát</Title>
      <SearchInput
        type="text"
        placeholder="Tìm kiếm bài hát..."
        value={searchTerm}
        onChange={handleSearch}
      />

      <Tabs>
        {categories.map((category) => (
          <Tab
            key={category}
            active={activeTab === category}
            onClick={() => handleTabClick(category)}
          >
            {category === "all" ? "Tất Cả" : category}
          </Tab>
        ))}
      </Tabs>

      <SongContainer>
        {filteredSongs.length === 0 ? (
          <p>Không có bài hát nào trong danh sách.</p>
        ) : (
          filteredSongs.map((item) => {
            const song = item.song && item.song._id ? item.song : item;

            // Lấy bài hát từ filteredSongs
            return (
              <SongItem key={song._id}>
                <img
                  src={`http://localhost:4000/${song.imgSrc}`} // Đảm bảo đường dẫn ảnh đúng
                  alt={song.songName}
                  style={{ width: "50px", height: "50px", borderRadius: "5px" }}
                />
                <SongDetails>
                  <p>{song.songName}</p>
                  <p>{song.artist}</p>
                </SongDetails>
                <Button
                  onClick={() => addToPlaylist(song._id)}
                  disabled={addedSongs.includes(song._id)}
                >
                  {addedSongs.includes(song._id)
                    ? "Đã Thêm"
                    : "Thêm vào Playlist"}
                </Button>
              </SongItem>
            );
          })
        )}
      </SongContainer>
    </Container>
  );
}

export default SongList;
