import axios from "axios";
import {
  FETCH_SONGS_REQUEST,
  FETCH_SONGS_SUCCESS,
  FETCH_SONGS_FAILURE,
} from "./Songtypes"; // Import the correct action types

// actions/songActions.js
export const createSongSuccess = (data) => {
  return {
    type: "CREATE_SONG_SUCCESS",
    payload: data,
  };
};

export const createSongError = (error) => {
  return {
    type: "CREATE_SONG_ERROR",
    payload: error,
  };
};

export const fetchSong = () => {
  return async (dispatch) => {
    dispatch({ type: FETCH_SONGS_REQUEST }); // Use the correct action type

    try {
      const response = await fetch("http://localhost:4000/api/songs");
      const data = await response.json();

      dispatch({ type: FETCH_SONGS_SUCCESS, payload: data }); // Use the correct action type
    } catch (error) {
      dispatch({ type: FETCH_SONGS_FAILURE, payload: error.message }); // Use the correct action type
    }
  };
};

// actions/songActions.js

export const deleteSongSuccess = (id) => {
  return {
    type: "DELETE_SONG_SUCCESS",
    payload: id, // id của bài hát bị xóa
  };
};

export const deleteSongError = (error) => {
  return {
    type: "DELETE_SONG_ERROR",
    payload: error,
  };
};

export const deleteSong = (id) => {
  return async (dispatch) => {
    try {
      // Gọi API để xóa bài hát
      await axios.delete(`http://localhost:4000/api/songs/${id}`);
      dispatch(deleteSongSuccess(id)); // Gửi action xóa thành công
    } catch (error) {
      dispatch(deleteSongError(error.message)); // Gửi action xóa lỗi
    }
  };
};
export const updateSongList = (updatedSongs) => {
  return {
    type: "UPDATE_SONG_LIST",
    payload: updatedSongs,
  };
};
