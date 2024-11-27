import React, { useState, useRef, useEffect } from "react";
import "../styles/MusicPlayer.css";
import {
  FaRegHeart,
  FaHeart,
  FaForward,
  FaStepForward,
  FaStepBackward,
  FaBackward,
  FaPlay,
  FaPause,
  FaShareAlt,
} from "react-icons/fa";
import { BsFillVolumeUpFill, BsMusicNoteList } from "react-icons/bs";
import { BsDownload } from "react-icons/bs";
import { connect } from "react-redux";
import {
  fetchFavorites,
  deleteFavorites,
} from "../Admin/actions/FavoritesAction";

// Import các component chia sẻ từ react-share
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";

function MusicPlayer({
  song, // URL của bài hát
  imgSrc, // Đường dẫn ảnh của bài hát
  auto, // Tự động phát nhạc
  currentSongIndex,
  setCurrentSongIndex,
  currentSongId, // ID của bài hát hiện tại
  playNextSong,
  playPreviousSong,
}) {
  const [isLove, setLove] = useState(false);
  const [isPlaying, setPlay] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrenttime] = useState(0);
  const [volume, setVolume] = useState(50);
  const [favorites, setFavorites] = useState([]);

  const audioPlayer = useRef();
  const progressBar = useRef();
  const animationRef = useRef();

  // Đường dẫn URL đầy đủ của bài nhạc để chia sẻ
  const shareUrl = `http://localhost:4000/${song}`; // URL bài hát hiện tại
  const title = `Nghe ngay bài hát ${song}!`; // Tiêu đề chia sẻ là tên bài hát
  const description = `Nghe bài hát ${song} đang được phát.`; // Mô tả chia sẻ

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
  // const playNextSong = () => {
  //   const nextIndex = (currentSongIndex + 1) % songs.length;
  //   setCurrentSongIndex(nextIndex); // Update current song index
  //   setCurrentSong(songs[nextIndex]);
  // };

  // const playPreviousSong = () => {
  //   const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  //   setCurrentSongIndex(prevIndex); // Update current song index
  //   setCurrentSong(songs[prevIndex]);
  // };
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
    const userId = localStorage.getItem("user"); // Giả sử user_id được lưu trong localStorage

    if (!userId) {
      alert("Bạn cần đăng nhập để thêm vào danh sách yêu thích!");
      return;
    }

    try {
      if (!isLove) {
        // Gửi yêu cầu thêm bài hát vào danh sách yêu thích
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
    <div className="musicPlayer">
      <div className="songImage">
        <img src={`http://localhost:4000/${imgSrc}`} alt={currentSongId} />
      </div>
      <div className="songAttributes">
        <audio
          src={`http://localhost:4000/${song}`}
          preload="metadata"
          ref={audioPlayer}
          onEnded={() => handleSongEnd(currentSongId, "userId")}
        />

        <div className="top">
          <div className="left">
            <div
              className="loved"
              onClick={() => changeSongLove(currentSongId)}
            >
              {isLove ? (
                <i>
                  <FaRegHeart />
                </i>
              ) : (
                <i>
                  <FaHeart />
                </i>
              )}
            </div>
            <a href={song} download="audio.mp3" className="download">
              <BsDownload />
            </a>
            <i>
              <BsFillVolumeUpFill />
            </i>

            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
            />
            <i>
              <BsMusicNoteList />
            </i>
          </div>

          <div className="middle">
            <div className="back">
              <i onClick={() => playPreviousSong()}>
                <FaStepBackward />
              </i>
              <i onClick={() => playPreviousSong()}>
                <FaBackward />
              </i>
            </div>
            <div className="playPause" onClick={changePlayPause}>
              {isPlaying ? (
                <i>
                  <FaPause />
                </i>
              ) : (
                <i>
                  <FaPlay />
                </i>
              )}
            </div>

            <div className="forward">
              <i onClick={() => playNextSong()}>
                <FaForward />
              </i>
              <i onClick={() => playNextSong()}>
                <FaStepForward />
              </i>
            </div>
          </div>

          <div className="right">
            {/* Nút chia sẻ lên các mạng xã hội */}
            <div className="shareIcons">
              <FacebookShareButton url={shareUrl} quote={title}>
                <FacebookIcon size={32} round />
              </FacebookShareButton>
              <TwitterShareButton url={shareUrl} title={title}>
                <TwitterIcon size={32} round />
              </TwitterShareButton>
              <WhatsappShareButton url={shareUrl} title={title}>
                <WhatsappIcon size={32} round />
              </WhatsappShareButton>
            </div>
          </div>
        </div>

        <div className="bottom">
          <div className="currentTime">{calculateTime(currentTime)}</div>
          <input
            type="range"
            className="progressBar"
            ref={progressBar}
            defaultValue="0"
            onChange={changeProgress}
            autoPlay={auto}
          />
          <div className="duration">
            {duration && !isNaN(duration) && calculateTime(duration)
              ? duration && !isNaN(duration) && calculateTime(duration)
              : "00:00"}
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
