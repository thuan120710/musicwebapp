import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  padding: 20px;
  background-color: #121212;
  color: #e0e0e0;
  min-height: 100vh;
`;

const Title = styled.h2`
  color: #bb86fc;
  text-align: center;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  padding: 10px;
  background: #333333;
  color: #e0e0e0;
  border: 1px solid #444;
  border-radius: 5px;
  width: 100%;
  margin-bottom: 20px;
  &::placeholder {
    color: #aaa;
  }
`;

const Tabs = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

const Tab = styled.button`
  background: ${(props) => (props.active ? "#bb86fc" : "#1e1e1e")};
  color: ${(props) => (props.active ? "#fff" : "#e0e0e0")};
  padding: 10px 15px;
  margin-right: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #333333;
  }
`;

const SongContainer = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const SongItem = styled.li`
  display: flex;
  align-items: center;
  background: #1e1e1e;
  padding: 15px;
  margin: 10px 0;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  transition: background 0.2s, transform 0.2s;

  &:hover {
    background: #333333;
    transform: scale(1.02);
  }
`;

const SongDetails = styled.div`
  margin-left: 15px;
  flex-grow: 1;
  color: #e0e0e0;

  p {
    margin: 0;
  }

  p:first-child {
    font-weight: bold;
  }
`;

// Định nghĩa BackButton
const BackButton = styled.button`
  padding: 10px 15px;
  background-color: #bb86fc;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 20px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #9b63dc;
  }
`;

const Button = styled.button`
  padding: 8px 12px;
  background-color: ${(props) => (props.disabled ? "#555" : "#bb86fc")};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) => (props.disabled ? "#555" : "#9b63dc")};
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

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/songs");
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

  const fetchListeningHistory = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/listening-history/${playlistId}`
      );
      const data = await response.json();
      setListeningHistory(data.listeningHistory);
      setFilteredSongs(data.listeningHistory); // Hiển thị lịch sử khi chuyển sang tab "History"
    } catch (error) {
      console.error("Lỗi khi lấy lịch sử nghe nhạc:", error);
    }
  };

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

  const addToPlaylist = async (songId) => {
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
        setAddedSongs([...addedSongs, songId]);
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
            {category}
          </Tab>
        ))}
      </Tabs>

      <SongContainer>
        {filteredSongs.map((song) => (
          <SongItem key={song._id}>
            <img
              src={`http://localhost:4000/${song.imgSrc}`}
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
              {addedSongs.includes(song._id) ? "Đã Thêm" : "Thêm vào Playlist"}
            </Button>
          </SongItem>
        ))}
      </SongContainer>
    </Container>
  );
}

export default SongList;
