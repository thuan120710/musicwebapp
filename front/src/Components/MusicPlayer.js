import React, { useState, useRef, useEffect } from "react";
import "../styles/MusicPlayer.css";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";
import { FaLink, FaFacebookMessenger } from "react-icons/fa";

function MusicPlayer({
  song,
  imgSrc,
  auto,
  currentSong,
  playNextSong,
  toggleFavorite,
  isLove,
  playPreviousSong,
}) {
  const [isPlaying, setPlay] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrenttime] = useState(0);
  const [volume, setVolume] = useState(50);
  const [copied, setCopied] = useState(false);
  const audioPlayer = useRef();
  const progressBar = useRef();
  const animationRef = useRef();

  const shareUrl = `http://localhost:4000/${song}`;
  const title = `Nghe ngay bài hát ${currentSong?.songName || "Bài hát"}!`;
  const currentSongId = currentSong?._id;

  useEffect(() => {
    if (audioPlayer.current && audioPlayer.current.duration) {
      const seconds = Math.floor(audioPlayer.current.duration);
      setDuration(seconds);
      progressBar.current.max = seconds;
    }
  }, [
    audioPlayer?.current?.loadedmetadata,
    audioPlayer?.current?.readyState,
    song,
  ]);

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

  // Copy link to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div
      className="music-player-card glossy-theme"
      style={{ width: "420px", maxWidth: "99vw", minHeight: "340px" }}
    >
      <div className="mp-card-album-wrap">
        <div
          className={`mp-album-art mp-album-art-circle${
            isPlaying ? " mp-album-art--playing" : ""
          }`}
          style={{
            width: "120px",
            height: "120px",
            minWidth: "120px",
            minHeight: "120px",
          }}
        >
          <img
            src={`http://localhost:4000/${imgSrc}`}
            alt={currentSongId}
            style={{ width: "112px", height: "112px" }}
          />
        </div>
      </div>
      <div className="mp-card-content">
        <div className="mp-song-info">
          <div className="mp-title">{currentSong?.songName || "Bài hát"}</div>
          <div className="mp-artist">{currentSong?.artist || "Nghệ sĩ"}</div>
        </div>
        <audio
          src={`http://localhost:4000/${song}`}
          preload="metadata"
          ref={audioPlayer}
          onEnded={playNextSong}
          autoPlay={auto}
        />
        <div
          className="mp-controls mp-controls-card"
          style={{ gap: "28px", marginTop: "16px" }}
        >
          <button
            className="mp-btn"
            onClick={playPreviousSong}
            title="Bài trước"
          >
            <i className="fa-solid fa-backward-step" />
          </button>
          <button
            className="mp-btn mp-play"
            onClick={changePlayPause}
            title={isPlaying ? "Tạm dừng" : "Phát"}
          >
            {isPlaying ? (
              <i className="fa-solid fa-pause" />
            ) : (
              <i className="fa-solid fa-play" />
            )}
          </button>
          <button className="mp-btn" onClick={playNextSong} title="Bài tiếp">
            <i className="fa-solid fa-forward-step" />
          </button>
        </div>
        <div className="mp-progress-wrap mp-progress-card">
          <span className="mp-time">{calculateTime(currentTime)}</span>
          <input
            type="range"
            className="mp-progress"
            ref={progressBar}
            defaultValue="0"
            onChange={changeProgress}
          />
          <span className="mp-time">
            {duration && !isNaN(duration) && calculateTime(duration)
              ? calculateTime(duration)
              : "--:--"}
          </span>
        </div>
        <div className="mp-bottom-row mp-bottom-row-card">
          <div className="mp-volume">
            <i className="fa-solid fa-volume-high" />
            <input
              type="range"
              min={0}
              max={100}
              value={volume}
              onChange={handleVolumeChange}
            />
          </div>
          <button
            className={`mp-btn mp-fav${isLove ? " liked" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(currentSongId);
            }}
            title="Yêu thích"
          >
            <i
              className={isLove ? "fa-solid fa-heart" : "fa-regular fa-heart"}
            />
          </button>
          <div className="mp-share mp-share-card">
            <FacebookShareButton url={shareUrl} title={title}>
              <FacebookIcon size={28} round />
            </FacebookShareButton>
            <TwitterShareButton url={shareUrl} title={title}>
              <TwitterIcon size={28} round />
            </TwitterShareButton>
            <WhatsappShareButton url={shareUrl} title={title}>
              <WhatsappIcon size={28} round />
            </WhatsappShareButton>
            <button
              className="mp-btn mp-share-btn"
              title="Chia sẻ Ali/Zalo"
              onClick={() => handleCopy()}
              style={{
                background: "#00bcd4",
                color: "#fff",
                fontSize: 18,
                marginLeft: 2,
                borderRadius: "50%",
              }}
            >
              <FaFacebookMessenger />
            </button>
            <button
              className="mp-btn mp-copy"
              title={copied ? "Đã sao chép!" : "Sao chép liên kết"}
              onClick={handleCopy}
              style={{
                background: copied ? "#7fffd4" : "#fff",
                color: "#0f2027",
                fontSize: 18,
                marginLeft: 2,
                borderRadius: "50%",
              }}
            >
              <FaLink />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MusicPlayer;
