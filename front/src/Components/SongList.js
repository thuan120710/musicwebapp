import React from "react";

function SongList({ playlist, setCurrentSong }) {
  return (
    <div className="song-list">
      <h2>{playlist.name}</h2>
      {playlist.songs.map((song, index) => (
        <div key={song._id} className="song-item">
          <p>
            {song.songName} - {song.artist}
          </p>
          <button onClick={() => setCurrentSong(song)}>Play</button>
        </div>
      ))}
    </div>
  );
}

export default SongList;
