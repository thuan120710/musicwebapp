import React from "react";
import styled from "styled-components";
import "../styles/Libralysong.css";
const LibrarySong = ({
  song,
  setCurrentSong,
  audioRef,
  isPlaying,
  songs,
  setSongs,
}) => {
  // Function
  const songSelectHandler = async () => {
    await setCurrentSong(song);
    const curSong = song;
    const songList = songs;

    const newSongs = songList.map((song) => {
      if (song.id === curSong.id) {
        return {
          ...song,
          active: true,
        };
      } else {
        return {
          ...song,
          active: false,
        };
      }
    });
    setSongs(newSongs);

    // check if user is wanting to play a song.
    if (isPlaying) {
      audioRef.current.play();
    }
  };

  return (
    <LibrarySongContainer onClick={songSelectHandler} isActive={song.favourite}>
      <Img
        src={`http://localhost:4000/${song.imgSrc}`}
        alt={song.SongName}
      ></Img>
      <LibrarySongDescription>
        <H1>{song.name}</H1>
        <H2>{song.artist}</H2>
      </LibrarySongDescription>
    </LibrarySongContainer>
  );
};

const LibrarySongContainer = styled.div`
  padding: 0 2rem 0 2rem;
  height: 100px;
  width: 100%;
  display: flex;
  transition: all 0.3s ease;
  background-color: ${(p) => (p.isActive ? "pink" : "green")};
  &:hover {
    background-color: lightblue;
    transition: all 0.3s ease;
  }
  font-size: 25px;
`;

const LibrarySongDescription = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: black;
  font-size: 25px;
`;

const Img = styled.img`
  margin: 20px 0;

  height: 80px;
  width: 80px;
  border-radius: 10px;
  object-fit: cover;
`;

const H1 = styled.h3`
  padding-left: 1rem;
  font-size: 1rem;
`;

const H2 = styled.h4`
  padding-left: 1rem;
  font-size: 2rem;
`;

export default LibrarySong;
