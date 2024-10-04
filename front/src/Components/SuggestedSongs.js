import React, { useEffect, useState } from "react";
import axios from "axios";
import MusicPlayer from "./MusicPlayer";

const SuggestedSongs = ({ userId }) => {
  const [suggestedSongs, setSuggestedSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);

  useEffect(() => {
    // Gọi API để lấy nhạc gợi ý
    const fetchSuggestedSongs = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/suggested-songs/${userId}`
        );
        setSuggestedSongs(response.data.suggestedSongs);
      } catch (error) {
        console.error("Error fetching suggested songs:", error);
      }
    };

    fetchSuggestedSongs();
  }, [userId]);

  const handleSongSelect = (song) => {
    setCurrentSong(song.song);
    setCurrentImage(song.imgSrc);
  };

  return (
    <div className="suggested-songs">
      <h2>Suggested Songs</h2>
      <div className="song-list">
        {suggestedSongs.map((song, index) => (
          <div key={index} onClick={() => handleSongSelect(song)}>
            <img
              src={`http://localhost:4000${song.imgSrc}`}
              alt={song.songName}
            />
            <p>
              {song.songName} - {song.artist}
            </p>
          </div>
        ))}
      </div>
      {currentSong && (
        <MusicPlayer song={currentSong} imgSrc={currentImage} auto={true} />
      )}
    </div>
  );
};

export default SuggestedSongs;
