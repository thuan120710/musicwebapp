import React, { useEffect, useState } from "react";
import {
  FaHeadphones,
  FaRegClock,
  FaRegHeart,
  FaHeart,
  FaStar,
} from "react-icons/fa";
import "../styles/LeftMenu.css";
import "../styles/CommentRating.css";
import MusicPlayer from "./MusicPlayer";
import SuggestedSongs from "../design/SuggestedSongs";
import axios from "axios";
import ListeningHistory from "../design/ListeningHistory";

const AudioList = ({ item }) => {
  const [songs, setSongs] = useState([]);
  const [song, setSong] = useState();
  const [img, setImage] = useState();
  const [auto, setAuto] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [currentSong, setCurrentSong] = useState(null);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState("");
  const [listeningHistory, setListeningHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const [viewHistory, setViewHistory] = useState(null);

  const handleSuggestedSongSelect = (selectedSong) => {
    setMainSong(selectedSong.song, selectedSong.imgSrc, 0);
  };

  const saveToLocalStorageForSong = (songId, comments, rating) => {
    const existingData = JSON.parse(localStorage.getItem("songData")) || {};
    existingData[songId] = { comments, rating };
    localStorage.setItem("songData", JSON.stringify(existingData));
  };

  const getFromLocalStorageForSong = (songId) => {
    const storedData = JSON.parse(localStorage.getItem("songData")) || {};
    return storedData[songId] || { comments: [], rating: 0 };
  };
  // Hàm cập nhật lịch sử nghe nhạc
  const updateListeningHistory = async (userId, songId) => {
    try {
      await axios.post("http://localhost:4000/api/track-listened", {
        userId,
        songId,
      });
      console.log("Cập nhật lịch sử nghe thành công");
      setListeningHistory((prevHistory) => [...prevHistory, song]);
      console.log(listeningHistory, 11111);
      console.log(setListeningHistory, 222);
    } catch (error) {
      console.error("Lỗi khi cập nhật lịch sử nghe:", error);
    }
  };
  // Hàm xử lý yêu thích (Cập nhật trạng thái và thông báo)
  const toggleFavorite = async (songId) => {
    const isFavorite = favorites.includes(songId); // Kiểm tra trạng thái yêu thích
    try {
      if (isFavorite) {
        // Nếu đã yêu thích, hiển thị thông báo
        alert("Bài hát này đã có trong danh sách yêu thích!");
      } else {
        // Nếu chưa yêu thích, thêm vào danh sách
        await axios.post("http://localhost:4000/api/create-favorites", {
          user_id: userId,
          song_id: songId,
        });
        setFavorites((prev) => [...prev, songId]); // Cập nhật danh sách yêu thích
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật yêu thích:", error);
    }
  };

  // Tải danh sách yêu thích khi trang load
  useEffect(() => {
    const fetchFavorites = async () => {
      if (userId) {
        try {
          const response = await axios.get(
            "http://localhost:4000/api/favorites",
            {
              params: { user_id: userId },
            }
          );
          setFavorites(response.data.map((fav) => fav.song_id));
        } catch (error) {
          console.error("Lỗi khi tải danh sách yêu thích:", error);
        }
      }
    };
    fetchFavorites();
  }, [userId]);

  // Update bài hát và ảnh khi item thay đổi
  useEffect(() => {
    if (item && item.length > 0) {
      setSongs(item);
      setMainSong(item[0]?.song, item[0]?.imgSrc, 0); // Thiết lập bài hát đầu tiên làm bài mặc định
    }
  }, [item]);
  // Thêm hàm fetchHistory
  const fetchHistory = async () => {
    try {
      const response = await axios.get(`
      http://localhost:4000/api/listening-history/${userId}`);
      return response.data.listeningHistory;
    } catch (error) {
      console.error("Error fetching listening history:", error);
    }
  };
  useEffect(() => {
    if (songs[currentSongIndex]) {
      const songId = songs[currentSongIndex]._id;
      const { comments: storedComments, rating: storedRating } =
        getFromLocalStorageForSong(songId);
      setComments(storedComments);
      setRating(storedRating);
    }
  }, [songs, currentSongIndex]);

  const handleRatingClick = (index) => {
    const newRating = index + 1;
    setRating(newRating);
    setHasRated(true);

    if (songs[currentSongIndex]) {
      const songId = songs[currentSongIndex]._id;
      saveToLocalStorageForSong(songId, comments, newRating);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user._id) {
      setUserId(user._id);
      setUsername(user.username); // Lấy tên người dùng từ localStorage
    } else {
      console.warn("User ID không tồn tại. Vui lòng đăng nhập.");
    }
  }, []);

  const fetchComments = async (songId) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/song/${songId}/comments`
      );
      setComments(response.data.comments);
      saveToLocalStorageForSong(songId, response.data.comments, rating);
    } catch (error) {
      console.error("Lỗi khi tải bình luận:", error);
    }
  };

  const addCommentAndRating = async () => {
    if (!hasRated) {
      alert("Bạn cần phải đánh giá trước khi bình luận!");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:4000/api/song/${songs[currentSongIndex]._id}/comment`,
        {
          userId,
          content: newComment,
          score: rating,
        }
      );
      const newCommentEntry = {
        ...response.data.comment,
        score: rating,
        user: { username }, // Đảm bảo tên người dùng hiển thị cùng bình luận
      };

      await axios.post(
        `http://localhost:4000/api/song/${songs[currentSongIndex]._id}/rating`,
        {
          userId,
          score: rating,
        }
      );
      const updatedComments = [...comments, newCommentEntry];
      setComments(updatedComments);
      setNewComment("");
      setRating(0);
      setHasRated(false);
      alert("Bình luận và đánh giá đã được gửi thành công!");

      saveToLocalStorageForSong(
        songs[currentSongIndex]._id,
        updatedComments,
        0
      );
    } catch (error) {
      console.error("Lỗi khi thêm bình luận và đánh giá:", error);
    }
  };

  useEffect(() => {
    if (item && item.length > 0) {
      setSongs(item);
      setMainSong(item[0]?.song, item[0]?.imgSrc, 0);
      fetchComments(item[0]?._id);
    }
  }, [item]);

  const setMainSong = async (songSrc, imgSrc, index) => {
    setSong(songSrc);
    setImage(imgSrc);
    setAuto(true);
    setCurrentSongIndex(index);

    const currentSongId = songs[index]?._id;
    if (currentSongId) {
      try {
        fetchComments(currentSongId);
        await updateListeningHistory(userId, currentSongId); // Gọi API để cập nhật lịch sử nghe nhạc
        console.log("Lịch sử nghe nhạc đã được cập nhật");
      } catch (error) {
        console.error("Lỗi khi cập nhật lịch sử nghe nhạc:", error);
      }
    }
  };
  const playNextSong = (id) => {
    const nextIndex = (currentSongIndex + 1) % songs.length;
    const nextSong = songs[nextIndex];
    if (nextSong) {
      setSong(nextSong.song);
      setImage(nextSong.imgSrc);
      setCurrentSongIndex(nextIndex);
    } else {
      console.log("Next song not found.");
    }
  };

  const playPreviousSong = (id) => {
    const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    const prevSong = songs[prevIndex];
    if (prevSong) {
      setSong(prevSong.song);
      setImage(prevSong.imgSrc);
      setCurrentSongIndex(prevIndex);
    } else {
      console.log("Previous song not found.");
    }
  };

  const renderStars = (score) => {
    return (
      <div className="stars">
        {[...Array(5)].map((_, index) => (
          <FaStar
            key={index}
            className={index < score ? "star selected" : "star"}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="AudioList">
      <h2 className="title">
        Danh sách <span>{songs.length} bài hát</span>
      </h2>

      <div className="songsContainer">
        {songs.map((song, index) => (
          <div
            className="songs"
            key={index}
            onClick={() => {
              setMainSong(song?.song, song?.imgSrc, index);
              console.log(song);
            }}
          >
            <div className="count">
              <p>{`#${index + 1}`}</p>
            </div>
            <div className="song">
              <div className="imgBox">
                <img src={`http://localhost:4000/${song.imgSrc}`} alt="" />
              </div>
              <div className="section">
                <p className="songName">
                  {song?.songName}{" "}
                  <span className="songSpan">{song?.artist}</span>
                </p>
                <button
                  className="favorite-btn"
                  onClick={(e) => {
                    e.stopPropagation(); // Ngăn chặn sự kiện click chọn bài hát
                    toggleFavorite(song._id); // Gọi hàm xử lý yêu thích
                  }}
                >
                  {favorites.includes(song._id) ? (
                    <FaHeart className="favorite-icon active" /> // Biểu tượng đậm nếu đã yêu thích
                  ) : (
                    <FaRegHeart className="favorite-icon" /> // Biểu tượng nhạt nếu chưa yêu thích
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <MusicPlayer
        song={song}
        imgSrc={img}
        autoplay={auto}
        currentSong={currentSong}
        currentSongId={currentSong ? currentSong.id : null} // Pass current song ID
        setCurrentSongIndex={setCurrentSongIndex}
        playNextSong={playNextSong}
        playPreviousSong={playPreviousSong}
      />

      <SuggestedSongs
        userId={userId}
        onSongSelect={handleSuggestedSongSelect}
      />

      <ListeningHistory
        userId={userId}
        onSongSelect={(selectedSong) =>
          setMainSong(selectedSong.song, selectedSong.imgSrc, 0)
        }
      />

      {/* Phần đánh giá với biểu tượng ngôi sao */}
      <div className="rating-section">
        <h3>Đánh giá bài hát</h3>
        <div className="stars">
          {[...Array(5)].map((_, index) => (
            <FaStar
              key={index}
              className={index < rating ? "star selected" : "star"}
              onClick={() => handleRatingClick(index)}
            />
          ))}
        </div>
      </div>

      {/* Phần bình luận */}
      <div className="comments-section">
        <h3>Bình luận</h3>
        {comments.map((comment) => (
          <div key={comment._id} className="comment">
            <p>
              <strong>{comment.user.username}:</strong> {comment.content}
            </p>
            <div className="comment-rating">{renderStars(comment.score)}</div>
          </div>
        ))}
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Viết bình luận..."
        />
        <button onClick={addCommentAndRating}>Gửi bình luận và đánh giá</button>
      </div>
    </div>
  );
};

export { AudioList };
