import React, { useState } from "react";
import "./SongCard.css";

const SongCard = ({ song, index, showRank = false, layout = "vertical" }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handlePlay = () => {
    // Dispatch play action
    console.log("Playing:", song.songName);
  };

  const handleLike = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (layout === "horizontal") {
    return (
      <div className="song-card horizontal" onClick={handlePlay}>
        <div className="song-image">
          <img
            src={`http://localhost:4000/${song.imgSrc}`}
            alt={song.songName}
          />
          <div className="play-overlay">
            <button className="play-btn">
              <i className="fas fa-play"></i>
            </button>
          </div>
        </div>
        <div className="song-info">
          <h4>{song.songName}</h4>
          <p>{song.artist}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`song-card ${showRank ? "with-rank" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handlePlay}
    >
      {showRank && (
        <div className="rank-number">
          <span>{index}</span>
        </div>
      )}

      <div className="song-image">
        <img src={`http://localhost:4000/${song.imgSrc}`} alt={song.songName} />
        <div className={`play-overlay ${isHovered ? "visible" : ""}`}>
          <button className="play-btn">
            <i className="fas fa-play"></i>
          </button>
        </div>
      </div>

      <div className="song-details">
        <div className="song-info">
          <h3 className="song-title">{song.songName}</h3>
          <p className="song-artist">{song.artist}</p>
        </div>

        <div className="song-actions">
          <button
            className={`like-btn ${isLiked ? "liked" : ""}`}
            onClick={handleLike}
          >
            <i className={`${isLiked ? "fas" : "far"} fa-heart`}></i>
          </button>
          <span className="song-duration">
            {formatDuration(song.duration || 180)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SongCard;
