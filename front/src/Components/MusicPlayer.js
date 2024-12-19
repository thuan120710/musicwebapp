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

function MusicPlayer({
  song,
  imgSrc,
  auto,
  currentSongId,
  playNextSong,
  playPreviousSong,
}) {
  const [isLove, setLove] = useState(false);
  const [isPlaying, setPlay] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrenttime] = useState(0);
  const [volume, setVolume] = useState(50);

  const audioPlayer = useRef();
  const progressBar = useRef();
  const animationRef = useRef();

  // Đường dẫn URL đầy đủ của bài nhạc để chia sẻ
  const shareUrl = `http://localhost:4000/${song}`; // URL bài hát hiện tại
  const title = `Nghe ngay bài hát ${song}!`; // Tiêu đề chia sẻ là tên bài hát

  useEffect(() => {
    const seconds = Math.floor(audioPlayer.current.duration);
    setDuration(seconds);
    progressBar.current.max = seconds;
  }, [audioPlayer?.current?.loadedmetadata, audioPlayer?.current?.readyState]);

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
    const checkFavoriteStatus = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/favorites", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const favorites = await response.json();
        const isFavorite = favorites.some(
          (fav) => fav.song_id === currentSongId
        );
        setLove(isFavorite);
      } catch (error) {
        console.error("Failed to fetch favorites:", error);
      }
    };

    if (currentSongId) {
      checkFavoriteStatus();
    }
  }, [currentSongId]);

  const changeSongLove = async (songId) => {
    const userId = localStorage.getItem("user");

    if (!userId) {
      alert("Bạn cần đăng nhập để thêm vào danh sách yêu thích!");
      return;
    }

    try {
      if (!isLove) {
        const response = await fetch("http://localhost:4000/api/favorites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ song_id: songId, user_id: userId }),
        });

        if (!response.ok) {
          throw new Error("Failed to add to favorites");
        }

        alert("Đã thêm vào danh sách yêu thích!");
        setLove(true); // Cập nhật trạng thái yêu thích
      } else {
        // Gửi yêu cầu xóa bài hát khỏi danh sách yêu thích
        const response = await fetch("http://localhost:4000/api/favorites", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ song_id: songId, user_id: userId }),
        });

        if (!response.ok) {
          throw new Error("Failed to remove from favorites");
        }

        alert("Đã xóa khỏi danh sách yêu thích!");
        setLove(false); // Cập nhật trạng thái không yêu thích
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Có lỗi xảy ra. Vui lòng thử lại!");
    }
  };

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
              className="listen-music__action-icon listen-music__action-icon--favorite hover-btn"
              onClick={() => changeSongLove(currentSongId)}
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
              <FacebookShareButton url={shareUrl} quote={title}>
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
