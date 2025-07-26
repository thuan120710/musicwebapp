import React, { useEffect, useState } from "react";
import {
  FaHeadphones,
  FaRegClock,
  FaRegHeart,
  FaHeart,
  FaStar,
  FaEllipsisV,
} from "react-icons/fa";
import "../styles/LeftMenu.css";
import "../styles/CommentRating.css";
import MusicPlayer from "./MusicPlayer";
import SuggestedSongs from "../design/SuggestedSongs";
import axios from "axios";
import ListeningHistory from "../design/ListeningHistory";
import MusicRecommendations from "../Components/MusicRecommendations";
import "../styles/audiolist.css";

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
  const [history, setHistory] = useState([]);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedComment, setEditedComment] = useState("");
  const [user, setUser] = useState(null);
  const [newReply, setNewReply] = useState("");
  const [showReplyForm, setShowReplyForm] = useState(null); // Theo dõi comment nào đang được phản hồi
  const [replies, setReplies] = useState([]); // Khai báo state cho danh sách phản hồi
  const [ratingInfo, setRatingInfo] = useState({ rating: 0, count: 0 }); // Rating từ API
  const [showMenuId, setShowMenuId] = useState(null);
  const currentUserId = localStorage.getItem("user"); // Lấy userId của người dùng hiện tại (từ localStorage hoặc context)
  const usercomment = currentUserId._id; //
  const handleEditComment = (commentId, content) => {
    setEditingCommentId(commentId);
    setEditedComment(content);
  };

  // Xử lý gửi yêu cầu chỉnh sửa bình luận
  const handleUpdateComment = async () => {
    if (!editedComment.trim()) {
      alert("Bình luận không thể trống.");
      return;
    }

    const songId = songs[currentSongIndex]?._id; // Lấy songId từ bài hát hiện tại và đảm bảo tồn tại
    if (!songId) {
      alert("Không tìm thấy songId.");
      return;
    }

    if (!editingCommentId) {
      alert("Không tìm thấy ID bình luận.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:4000/api/song/${songId}/comment/${editingCommentId}`,
        { newContent: editedComment },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.status === 200) {
        const updatedComments = comments.map((comment) =>
          comment._id === editingCommentId
            ? { ...comment, content: editedComment }
            : comment
        );
        setComments(updatedComments); // Cập nhật lại danh sách bình luận
        setEditingCommentId(null); // Đóng ô chỉnh sửa
        setEditedComment(""); // Làm sạch ô nhập liệu
        alert("Bình luận đã được chỉnh sửa.");
      } else {
        console.error("Lỗi khi cập nhật bình luận");
      }
    } catch (error) {
      console.error("Lỗi khi chỉnh sửa bình luận:", error);
      alert("Đã có lỗi xảy ra khi chỉnh sửa bình luận.");
    }
  };

  const handleSuggestedSongSelect = (selectedSong) => {
    setMainSong(selectedSong.song, selectedSong.imgSrc, 0);
  };

  // Lưu dữ liệu từng bài hát vào localStorage
  const saveToLocalStorageForSong = (songId, comments, rating, userId) => {
    const existingData = JSON.parse(localStorage.getItem("songData")) || {};
    existingData[songId] = { comments, rating, userId }; // Thêm userId vào dữ liệu
    localStorage.setItem("songData", JSON.stringify(existingData));
  };

  const getFromLocalStorageForSong = (songId) => {
    const storedData = JSON.parse(localStorage.getItem("songData")) || {};
    return storedData[songId] || { comments: [], rating: 0, userId: null }; // Mặc định userId là null
  };

  // Hàm cập nhật lịch sử nghe nhạc
  const updateListeningHistory = async (userId, songId) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/track-listened",
        {
          userId,
          songId,
        }
      );

      const updatedHistory = response.data.listeningHistory;

      // Cập nhật lịch sử nghe nhạc trong state
      setHistory(updatedHistory);
      console.log("Cập nhật lịch sử nghe thành công:", updatedHistory);
    } catch (error) {
      console.error("Lỗi khi cập nhật lịch sử nghe:", error);
    }
  };

  const handleDeleteFavorite = async (songId) => {
    console.log(
      `http://localhost:4000/api/deletefavourites/${songId}?user_id=${userId}`
    );

    try {
      if (!userId) {
        console.error("User ID không tồn tại.");
        return;
      }

      const response = await fetch(
        `http://localhost:4000/api/deletefavourites/${songId}?user_id=${userId}`,
        {
          method: "DELETE",
        }
      );
      console.log(response);

      if (response.ok) {
        setFavorites((prev) =>
          prev.filter((fav) => fav?.song_id?._id !== songId)
        ); // Cập nhật danh sách sau khi xóa
      } else {
        console.error("Error deleting favorite:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting favorite:", error);
    }
  };

  // Hàm xử lý yêu thích (Cập nhật trạng thái và thông báo)
  const toggleFavorite = async (songId) => {
    const isFavorite = favorites.find((item) => item?.song_id?._id === songId); // Kiểm tra trạng thái yêu thích
    console.log("Payload from List:", { user_id: userId, song_id: songId });

    try {
      if (isFavorite) {
        // Nếu đã yêu thích, hiển thị thông báo
        // alert("Bài hát này đã có trong danh sách yêu thích!");
        handleDeleteFavorite(songId);
      } else {
        // Nếu chưa yêu thích, thêm vào danh sách
        await axios.post("http://localhost:4000/api/create-favorites", {
          user_id: userId,
          song_id: songId,
        });
        setFavorites((prev) => [...prev, { song_id: { _id: songId } }]); // Cập nhật danh sách yêu thích
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
          // setFavorites(response.data.map((fav) => fav.song_id));

          setFavorites(response.data);
        } catch (error) {
          console.error("Lỗi khi tải danh sách yêu thích:", error);
        }
      }
    };
    fetchFavorites();
  }, [userId]);

  // Update bài hát và ảnh khi item thay đổi
  // useEffect(() => {
  //   if (item && item.length > 0) {
  //     setSongs(item);
  //     setMainSong(item[0]?.song, item[0]?.imgSrc, 0); // Thiết lập bài hát đầu tiên làm bài mặc định
  //   }
  // }, [item]);

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
      const userId = JSON.parse(localStorage.getItem("user"))?._id; // Lấy userId từ localStorage
      saveToLocalStorageForSong(songId, comments, newRating, userId); // Lưu thêm userId
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if ((user && user._id) || user.avatarImage) {
      setUserId(user._id);
      setUsername(user.username); // Lấy tên người dùng từ localStorage
      localStorage.setItem("avatarImage", user.avatarImage); // Lưu ảnh đại diện
    } else {
      console.warn("User ID không tồn tại. Vui lòng đăng nhập.");
    }
  }, []);

  const fetchComments = async (songId) => {
    try {
      // Kiểm tra dữ liệu trong localStorage
      const storedData = JSON.parse(localStorage.getItem("songData")) || {};
      const songData = storedData[songId]; // Lấy dữ liệu của bài hát cụ thể

      if (songData) {
        // Nếu có dữ liệu trong localStorage, sử dụng nó
        const { comments, rating } = songData;
        setComments(comments);
        setRatingInfo(rating);
        console.log("Dữ liệu lấy từ localStorage:", { comments, rating });
      } else {
        // Nếu không có, gọi API để lấy dữ liệu
        const response = await axios.get(
          `http://localhost:4000/api/song/${songId}/comments-and-rating`
        );

        const { comments, rating, count } = response.data;

        // Cập nhật state
        setComments(comments);
        setRatingInfo(rating);
        console.log("Dữ liệu lấy từ API:", { comments, rating });

        // Lưu vào localStorage
        const updatedData = {
          ...storedData,
          [songId]: { comments, rating, count },
        };
        localStorage.setItem("songData", JSON.stringify(updatedData));
      }
    } catch (error) {
      console.error("Lỗi khi tải bình luận:", error);
    }
  };

  // Lấy rating từ localStorage khi component mount
  // Lấy rating từ localStorage khi component được mount
  useEffect(() => {
    const storedRating = localStorage.getItem("ratingInfo");
    if (storedRating) {
      const parsedRating = JSON.parse(storedRating);
      setRating(parsedRating.rating);
      setHasRated(true);
    } else {
      // Fetch từ server nếu localStorage không có dữ liệu
      const songId = songs[currentSongIndex]?._id;
      if (songId) fetchRating(songId);
    }
  }, [songs, currentSongIndex]);

  useEffect(() => {
    if (songs && songs[currentSongIndex]) {
      const songId = songs[currentSongIndex]._id;
      console.log("Lấy rating cho bài hát ID:", songId); // Log songId
      fetchRating(songId);
    }
  }, [songs, currentSongIndex]);

  const fetchRating = (songId) => {
    try {
      // Lấy dữ liệu từ localStorage
      const storedData = JSON.parse(localStorage.getItem("songData")) || {};
      const songData = storedData[songId];

      if (songData && songData.rating) {
        const { rating, count } = songData.rating;

        console.log("Rating trung bình từ localStorage:", rating);
        console.log("Số lượng đánh giá từ localStorage:", count);

        setRatingInfo({ rating, count });
      } else {
        console.warn(
          "Không tìm thấy rating trong localStorage cho bài hát này."
        );
        setRatingInfo({ rating: 0, count: 0 }); // Giá trị mặc định nếu không tìm thấy
      }
    } catch (error) {
      console.error("Lỗi khi lấy rating từ localStorage:", error);
    }
  };

  const addCommentAndRating = async () => {
    if (!hasRated) {
      alert("Bạn cần phải đánh giá trước khi bình luận!");
      return;
    }

    if (!newComment.trim()) {
      alert("Vui lòng nhập bình luận.");
      return;
    }

    const songId = songs[currentSongIndex]._id;

    try {
      const userId = JSON.parse(localStorage.getItem("user"))?._id; // Lấy userId từ localStorage

      // Gửi yêu cầu POST đến API để gửi rating
      await axios.post(`http://localhost:4000/api/song/${songId}/rating`, {
        userId,
        content: newComment,
        score: rating,
      });

      console.log("Rating đã được lưu vào cơ sở dữ liệu");

      // Gửi yêu cầu POST để thêm comment
      const response = await axios.post(
        `http://localhost:4000/api/song/${songId}/comment`,
        {
          userId,
          content: newComment,
          score: rating,
        }
      );

      const newCommentEntry = {
        ...response.data.comment,
        score: rating,
        user: { username },
        avatarImage: JSON.parse(localStorage.getItem("user")).avatarImage,
      };

      // Cập nhật danh sách bình luận
      const updatedComments = [...comments, newCommentEntry];
      setComments(updatedComments);

      // Lưu vào localStorage
      saveToLocalStorageForSong(songId, updatedComments, rating, userId);

      // Làm sạch form
      setNewComment("");
      setRating(0);
      setHasRated(false);

      alert("Bình luận và đánh giá đã được gửi thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm bình luận và đánh giá:", error);
      alert(
        "Đã có lỗi xảy ra khi gửi bình luận và đánh giá. Vui lòng thử lại."
      );
    }
  };

  const fetchReplies = async (commentId) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/comment/${commentId}/replies`
      );
      console.log(response, "ttt");
      const fetchedReplies = response.data.replies;

      // Lưu phản hồi vào state
      setReplies((prev) => ({
        ...prev,
        [commentId]: fetchedReplies, // Lưu phản hồi theo commentId
      }));

      // Lưu phản hồi vào localStorage
      localStorage.setItem(
        `replies-${commentId}`,
        JSON.stringify(fetchedReplies)
      );
    } catch (error) {
      console.error("Lỗi khi lấy phản hồi:", error);
    }
  };

  // Gọi hàm fetchReplies khi cần lấy phản hồi
  useEffect(() => {
    comments.forEach((comment) => {
      fetchReplies(comment._id);
    });
  }, [comments]);

  const addReply = async (commentId) => {
    if (!newReply.trim()) {
      alert("Vui lòng nhập nội dung phản hồi.");
      return;
    }

    try {
      const comment = comments.find((comment) => comment._id === commentId);

      // Gửi yêu cầu tạo phản hồi mới
      const response = await axios.post(
        `http://localhost:4000/api/comment/${commentId}/reply`,
        {
          userId,
          content: newReply,
          replyingTo: comment.user.username,
        }
      );

      // Cập nhật lại danh sách phản hồi cho bình luận
      const updatedComments = comments.map((comment) =>
        comment._id === commentId
          ? {
              ...comment,
              replies: [...(comment.replies || []), response.data.reply],
            }
          : comment
      );

      // Cập nhật vào state
      setComments(updatedComments);

      // Lưu vào localStorage
      localStorage.setItem("commentst", JSON.stringify(updatedComments));

      // Reset form
      setNewReply("");
      setShowReplyForm(null);

      alert("Phản hồi đã được gửi thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm phản hồi:", error);
      alert("Đã xảy ra lỗi khi gửi phản hồi. Vui lòng thử lại.");
    }
  };

  // Khi tải lại trang, lấy dữ liệu phản hồi từ localStorage
  useEffect(() => {
    const storedComments = localStorage.getItem("commentst");
    if (storedComments) {
      const commentsData = JSON.parse(storedComments);
      setComments(commentsData);

      // Kiểm tra và lấy dữ liệu phản hồi từ localStorage cho mỗi comment
      commentsData.forEach((comment) => {
        const storedReplies = localStorage.getItem(`replies-${comment._id}`);
        if (storedReplies) {
          setReplies((prevReplies) => ({
            ...prevReplies,
            [comment._id]: JSON.parse(storedReplies),
          }));
        }
      });
    }
  }, []); // Chạy một lần khi component mount

  useEffect(() => {
    if (item && item.length > 0) {
      setSongs(item);
      setMainSong(item[0]?.song, item[0]?.imgSrc, 0);
      fetchComments(item[0]?._id);
      fetchRating(item[0]?._id);
    }
  }, [item]);

  const setMainSong = async (songSrc, imgSrc, index) => {
    const currentSong = song;
    setSong(songSrc);
    setImage(imgSrc);
    setAuto(true);
    setCurrentSongIndex(index);

    const currentSongId = songs[index]?._id;
    if (currentSongId) {
      try {
        fetchComments(currentSongId);
        fetchRating(currentSongId);
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

  const handleHistorySelect = (selectedSong) => {
    // Chuyển bài hát được chọn vào MusicPlayer
    setMainSong(selectedSong.song, selectedSong.imgSrc, 0);
  };

  const handleMenuClick = (commentId) => {
    setShowMenuId(showMenuId === commentId ? null : commentId); // Mở/đóng menu
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

  // const handleDeleteComment = async (commentId) => {
  //   try {
  //     const songId = songs[currentSongIndex]._id; // Lấy ID bài hát hiện tại

  //     // Gửi yêu cầu DELETE để xóa bình luận
  //     const response = await axios.delete(
  //       `http://localhost:4000/api/song/${songId}/comment/${commentId}`
  //     );

  //     if (response.status === 200) {
  //       // Cập nhật lại danh sách bình luận sau khi xóa thành công
  //       const updatedComments = comments.filter(
  //         (comment) => comment._id !== commentId
  //       );
  //       setComments(updatedComments); // Cập nhật lại state
  //       alert("Bình luận đã được xóa!");
  //     } else {
  //       console.error("Lỗi khi xóa bình luận");
  //     }
  //   } catch (error) {
  //     console.error("Lỗi khi xóa bình luận:", error);
  //   }
  // };

  const handleDeleteComment = async (commentId) => {
    if (!commentId) {
      alert("ID bình luận không hợp lệ.");
      return;
    }

    const songId = songs[currentSongIndex]?._id; // Lấy songId từ bài hát hiện tại
    if (!songId) {
      alert("Không tìm thấy songId.");
      return;
    }

    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      alert("Bạn cần đăng nhập để xóa bình luận.");
      return;
    }

    const user = JSON.parse(storedUser);

    if (!user || !user._id) {
      alert("Không thể xác minh thông tin người dùng.");
      return;
    }

    if (window.confirm("Bạn có chắc chắn muốn xóa bình luận này?")) {
      try {
        const response = await fetch(
          `http://localhost:4000/api/song/${songId}/comment/${commentId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setComments(comments.filter((comment) => comment._id !== commentId));
          alert("Bình luận đã được xóa.");
        } else {
          alert(data.error || "Có lỗi xảy ra khi xóa bình luận.");
        }
      } catch (error) {
        console.error("Lỗi khi xóa bình luận:", error);
        alert("Có lỗi xảy ra khi xóa bình luận.");
      }
    }
  };
  console.log(currentSong, "kietlac");
  return (
    <div
      className="music-app-layout glossy-theme"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "32px",
        width: "100%",
      }}
    >
      {/* Playlist dạng grid nhiều cột */}
      <div
        className="audio-list-modern"
        style={{ width: "100%", maxWidth: "1400px", margin: "0 auto" }}
      >
        <div className="al-title">
          Danh sách <span>{songs.length} bài hát</span>
        </div>
        <div className="al-songs-grid">
          {songs.map((song, index) => (
            <div
              className={`al-song-card${
                currentSongIndex === index ? " active" : ""
              }`}
              key={index}
              onClick={() => setMainSong(song?.song, song?.imgSrc, index)}
            >
              <div className="al-img-wrap">
                <img src={`http://localhost:4000/${song.imgSrc}`} alt="" />
                <div className="al-play-btn">
                  <i className="fa-solid fa-play" />
                </div>
              </div>
              <div className="al-info">
                <div className="al-song-title">{song?.songName}</div>
                <div className="al-artist">{song?.artist}</div>
              </div>
              <div className="al-actions">
                <button
                  className={`al-fav-btn${
                    favorites.find((item) => item?.song_id?._id === song._id)
                      ? " liked"
                      : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(song._id);
                  }}
                  title="Yêu thích"
                >
                  <i
                    className={
                      favorites.find((item) => item?.song_id?._id === song._id)
                        ? "fa-solid fa-heart"
                        : "fa-regular fa-heart"
                    }
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* MusicPlayer card */}
      <div style={{ margin: "0 auto", width: "100%", maxWidth: "420px" }}>
        <MusicPlayer
          song={song}
          imgSrc={img}
          auto={auto}
          currentSong={songs[currentSongIndex]}
          toggleFavorite={toggleFavorite}
          setCurrentSongIndex={setCurrentSongIndex}
          playNextSong={playNextSong}
          playPreviousSong={playPreviousSong}
          isLove={favorites.some(
            (item) => item?.song_id?._id === songs[currentSongIndex]?._id
          )}
        />
      </div>
      {/* Gợi ý nhạc: slider ngang */}
      {userId && (
        <div
          className="music-recommend-section-slider"
          style={{ width: "100%", maxWidth: "1400px" }}
        >
          <div className="music-recommend-title">Gợi ý cho bạn</div>
          <div className="music-recommend-slider">
            <MusicRecommendations userId={userId} onSongSelect={setMainSong} />
          </div>
        </div>
      )}
      {/* Đánh giá */}
      <div
        className="al-rating-section"
        style={{ width: "100%", maxWidth: "1400px" }}
      >
        <div className="al-rating-header">
          <h3>Đánh giá bài hát</h3>
          <div className="al-rating-summary">
            <span className="al-rating-score">
              {ratingInfo.rating?.toFixed(1) || 0}
            </span>
            <span className="al-rating-count">
              ({ratingInfo.count || 0} lượt)
            </span>
          </div>
        </div>
        <div className="al-stars al-stars-large">
          {[...Array(5)].map((_, index) => (
            <FaStar
              key={index}
              className={index < rating ? "al-star selected" : "al-star"}
              onClick={() => handleRatingClick(index)}
            />
          ))}
        </div>
        <div className="al-rating-label">Bạn đánh giá sao về bài hát này?</div>
      </div>
      {/* Bình luận */}
      <div
        className="al-comments-section"
        style={{ width: "100%", maxWidth: "1400px" }}
      >
        <h3>Bình luận</h3>
        {comments.map((comment) => (
          <div key={comment._id} className="al-comment-card">
            <img
              className="al-comment-avatar"
              src={comment.avatarImage || "/default-avatar.png"}
              alt={comment.user.username}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/default-avatar.png";
              }}
            />
            <div className="al-comment-main">
              <span className="al-comment-user">{comment.user.username}:</span>
              {editingCommentId === comment._id ? (
                <input
                  type="text"
                  value={editedComment}
                  onChange={(e) => setEditedComment(e.target.value)}
                />
              ) : (
                <span className="al-comment-content">{comment.content}</span>
              )}
              <div className="al-comment-rating">
                {renderStars(comment.score)}
              </div>
              <div className="al-comment-actions">
                <FaEllipsisV
                  onClick={() => handleMenuClick(comment._id)}
                  className="al-ellipsis"
                />
                {showMenuId === comment._id && (
                  <div className="al-menu-options">
                    {editingCommentId === comment._id ? (
                      <button onClick={handleUpdateComment}>Lưu</button>
                    ) : (
                      <button
                        onClick={() =>
                          handleEditComment(comment._id, comment.content)
                        }
                      >
                        Chỉnh sửa
                      </button>
                    )}
                    <button onClick={() => handleDeleteComment(comment._id)}>
                      Xóa
                    </button>
                    <button onClick={() => setShowReplyForm(comment._id)}>
                      Phản hồi
                    </button>
                  </div>
                )}
              </div>
            </div>
            {showReplyForm === comment._id && (
              <div className="al-reply-form">
                <span className="al-replying-to">
                  Bạn đang trả lời <b>{comment.user.username}</b>
                </span>
                <input
                  type="text"
                  placeholder="Nhập phản hồi..."
                  value={newReply}
                  onChange={(e) => setNewReply(e.target.value)}
                />
                <button onClick={() => addReply(comment._id)}>
                  Gửi phản hồi
                </button>
              </div>
            )}
            <div className="al-replies">
              {replies[comment._id]?.map((reply) => (
                <div key={reply._id} className="al-reply">
                  <span className="al-reply-user">{reply.user.username}:</span>
                  <span className="al-reply-content">{reply.content}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="al-new-comment">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Viết bình luận công khai..."
          />
          <button onClick={addCommentAndRating} className="al-send-btn">
            <i className="fa-solid fa-paper-plane" /> Gửi
          </button>
        </div>
      </div>
    </div>
  );
};

export { AudioList };
