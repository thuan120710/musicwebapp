import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../styles/MusicPlayer.css";
import { connect } from "react-redux";
import {
  fetchFavorites,
  deleteFavorites,
} from "../Admin/actions/FavoritesAction";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";
import axios from "axios";

function MusicPlayer({
  song,
  imgSrc,
  auto,
  currentSong, // Truyền currentSongId tại đây
  playNextSong,
  toggleFavorite,
  isLove,
  playPreviousSong,
}) {
  const [isPlaying, setPlay] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrenttime] = useState(0);
  const [volume, setVolume] = useState(50);
  const [favorites, setFavorites] = useState([]);
  const [songs, setSongs] = useState([]);

  const audioPlayer = useRef();
  const progressBar = useRef();
  const animationRef = useRef();

  // Đường dẫn URL đầy đủ của bài nhạc để chia sẻ
  const shareUrl = `http://localhost:4000/${song}`; // URL bài hát hiện tại

  const title = `Nghe ngay bài hát ${song}!`; // Tiêu đề chia sẻ là tên bài hát
  const currentSongId = currentSong?._id;
  console.log(currentSong, "kkk");
  console.log(isLove, "hhh");
  useEffect(() => {
    const seconds = Math.floor(audioPlayer.current.duration);
    setDuration(seconds);
    progressBar.current.max = seconds;
  }, [audioPlayer?.current?.loadedmetadata, audioPlayer?.current?.readyState]);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/songs");
        console.log(response, "hola");

        setSongs(response.data); // Lưu dữ liệu bài hát vào state
      } catch (error) {
        console.error("Lỗi khi tải danh sách bài hát:", error);
      }
    };
    fetchSongs();
  }, []); // Dependency array trống, chạy 1 lần khi component mount
  const changePlayPause = () => {
    const prevValue = isPlaying;
    setPlay(!prevValue);

    if (!prevValue) {
      audioPlayer.current.play();
      animationRef.current = requestAnimationFrame(whilePlaying);
    } else {
      audioPlayer.current.pause();
      cancelAnimationFrame(animationRef.current);
    }
  };

  const whilePlaying = () => {
    if (audioPlayer.current) {
      progressBar.current.value = audioPlayer.current.currentTime;
      changeCurrentTime();
      animationRef.current = requestAnimationFrame(whilePlaying);
    }
  };

  const calculateTime = (sec) => {
    const minutes = Math.floor(sec / 60);
    const returnMin = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(sec % 60);
    const returnSec = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${returnMin}:${returnSec}`;
  };

  const changeProgress = () => {
    audioPlayer.current.currentTime = progressBar.current.value;
    changeCurrentTime();
  };

  const changeCurrentTime = () => {
    progressBar.current.style.setProperty(
      "--played-width",
      `${(progressBar.current.value / duration) * 100}%`
    );
    setCurrenttime(progressBar.current.value);
  };

  const handleVolumeChange = (event) => {
    const volumeValue = event.target.value / 100;
    audioPlayer.current.volume = volumeValue;
    setVolume(event.target.value);
  };
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if ((user && user._id) || user.avatarImage) {
      localStorage.setItem("avatarImage", user.avatarImage); // Lưu ảnh đại diện
    } else {
      console.warn("User ID không tồn tại. Vui lòng đăng nhập.");
    }
  }, []);

  // Tải danh sách yêu thích khi trang load
  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem("user"))?.id; // Lấy userId từ localStorage
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
  }, []);
  const handleDeleteFavorite = async (songId) => {
    const userId = JSON.parse(localStorage.getItem("user"))?._id; // Lấy userId từ localStorage
    console.log(userId, 123);

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

  const handleSongEnd = async (songId, userId) => {
    try {
      await fetch("http://localhost:4000/api/track-listened", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ songId, userId }),
      });
    } catch (error) {
      console.error("Error tracking listened song:", error);
    }
    playNextSong(); // Tự động chuyển bài hát khi kết thúc
  };
  console.log("Song được truyền vào MusicPlayer:", song);

  // Hàm sao chép liên kết bài hát
  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(shareUrl)

      .then(() => {
        alert("Đã sao chép liên kết. Chia sẻ");
      })
      .catch((err) => {
        console.error("Lỗi sao chép: ", err);
      });
  };
  return (
    <div className="container-fluid musicPlayer app">
      {/* Image Song */}
      <div className="row py-5">
        {/* Cột giữa */}
        <div className="col-md-12 d-flex justify-content-center">
          <div className="listen-music__image">
            <img
              className="w-100 h-100 rounded"
              src={`http://localhost:4000/${imgSrc}`}
              alt={currentSongId}
            />
          </div>
        </div>
      </div>

      <audio
        src={`http://localhost:4000/${song}`}
        preload="metadata"
        ref={audioPlayer}
        onEnded={() => handleSongEnd(currentSongId, "userId")}
      />

      {/* Player Controls */}
      <div className="row mt-5 mb-4">
        {/* Cột trái */}
        <div className="col-md-4 d-flex justify-content-center">
          <div className="listen-music__volume d-flex align-items-end pb-4">
            <div className="listen-music__volume-icon d-flex align-items-center">
              <i className="fa-solid fa-volume-high me-3" />
              <input
                type="range"
                min={0}
                max={100}
                defaultValue="{volume}"
                onchange="{handleVolumeChange}"
                className=""
              />
            </div>
          </div>
        </div>
        {/* Cột giữa */}
        <div className="col-md-4">
          <div className="play-music__controls d-flex justify-content-center">
            <div
              className="play-music__controls-icon play-music__controls-icon--backward"
              onClick={() => playPreviousSong()}
            >
              <i className="fa-solid fa-backward-step" />
            </div>
            <div
              className="play-music__controls-icon play-music__controls-icon--playOrPause hover-btn"
              onClick={changePlayPause}
            >
              {isPlaying ? (
                <i class="fa-solid fa-pause hover-btn"></i>
              ) : (
                <i className="fa-solid fa-play hover-btn" />
              )}
            </div>
            <div
              className="play-music__controls-icon play-music__controls-icon--step"
              onClick={() => playNextSong()}
            >
              <i className="fa-solid fa-forward-step" />
            </div>
          </div>
        </div>
        {/* Cột phải */}
        <div className="col-md-4 d-flex justify-content-evenly align-items-center pb-4">
          <div className="listen-music__action d-flex">
            <div
              className={`listen-music__action-icon listen-music__action-icon--favorite hover-btn ${
                isLove ? "liked" : "not-liked"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(currentSongId);
              }}
            >
              {isLove ? (
                <i class="fa-regular fa-heart hover-btn"></i>
              ) : (
                <i className="fa-solid fa-heart hover-btn" />
              )}
            </div>
            <div
              className="listen-music__action-icon listen-music__action-icon--download hover-btn"
              href={song}
              download="audio.mp3"
            >
              <i className="fa-solid fa-download" />
            </div>
          </div>

          <div className="listen-music__action-icon listen-music__action-icon--share">
            <i className="hover-btn">
              <FacebookShareButton url={shareUrl} title={title}>
                <FacebookIcon size={32} round />
              </FacebookShareButton>
            </i>
            <i className="hover-btn">
              <TwitterShareButton url={shareUrl} title={title}>
                <TwitterIcon size={32} round />
              </TwitterShareButton>
            </i>
            <i className="hover-btn">
              <WhatsappShareButton url={shareUrl} title={title}>
                <WhatsappIcon size={32} round />
              </WhatsappShareButton>
            </i>
            <button onClick={copyToClipboard} className="btn btn-primary">
              Sao chép liên kết
            </button>
          </div>
        </div>
      </div>
      {/* Audio Time */}
      <div className="row mt-5 pb-5">
        <div className="col-md-6 offset-md-3">
          <div className="listen-music__timer d-flex justify-content-center align-items-center">
            <div className="listen-music__timer-icon listen-music__timer-icon--current-time fs-4 me-3">
              {calculateTime(currentTime)}
            </div>

            <div className="listen-music__timer-icon listen-music__timer-icon--progress-bar d-flex flex-grow-1">
              <input
                type="range"
                className="progressBar"
                ref={progressBar}
                defaultValue="0"
                onChange={changeProgress}
                autoPlay={auto}
              />
            </div>

            <div className="listen-music__timer-icon listen-music__timer-icon--remaining-time fs-4 ms-3">
              {duration && !isNaN(duration) && calculateTime(duration)
                ? duration && !isNaN(duration) && calculateTime(duration)
                : "--:--"}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <div
        className="modal fade"
        id="music"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        data-bs-backdrop="static"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content text-dark pb-4 pt-1 ps-2">
            <div className="modal-header border-0">
              <h1 className="modal-title" id="exampleModalLabel">
                Bạn muốn chia sẻ lên
              </h1>
              <button
                type="button"
                className="btn-close me-2"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body pt-4">
              <div className="modal-body__share d-flex justify-content-center">
                <div className="modal-body__share-icon modal-body__share-icon--facebook">
                  <i>
                    <FacebookShareButton url={shareUrl} quote={title}>
                      <FacebookIcon size={32} round />
                    </FacebookShareButton>
                  </i>
                </div>
                <div className="modal-body__share-icon modal-body__share-icon--twitter mx-4"></div>
                <div className="modal-body__share-icon modal-body__share-icon--whatsapp"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  favorites: state.FavoritesAdmin.favorites || [],
});

export default connect(mapStateToProps, { fetchFavorites, deleteFavorites })(
  MusicPlayer
);
