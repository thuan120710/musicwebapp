// CategoryReducer.js

import {
  FETCH_SONGS_REQUEST,
  FETCH_SONGS_SUCCESS,
  FETCH_SONGS_FAILURE,
  DELETE_SONG_SUCCESS,
  DELETE_SONG_ERROR,
  CREATE_SONG_SUCCESS,
  CREATE_SONG_ERROR,
  UPDATE_SONG_LIST,
} from "../actions/Songtypes";

const initialState = {
  songs: [],
  loading: false,
  error: null,
};

const SongReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SONGS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_SONGS_SUCCESS:
      return {
        ...state,
        songs: action.payload,
        loading: false,
        error: null,
      };
    case FETCH_SONGS_FAILURE:
      return {
        ...state,
        songs: [],
        loading: false,
        error: action.payload,
      };
    // case CREATE_SONG_SUCCESS:
    //   return {
    //     ...state,
    //     songs: [...state.songs, action.payload], // Thêm bài hát mới vào danh sách
    //   };
    // case CREATE_SONG_ERROR:
    //   return {
    //     ...state,
    //     error: action.payload,
    //   };
    case DELETE_SONG_SUCCESS:
      return {
        ...state,
        songs: state.songs.filter((song) => song._id !== action.payload), // Xóa bài hát khỏi danh sách
      };
    case DELETE_SONG_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case UPDATE_SONG_LIST:
      return {
        ...state,
        songs: action.payload, // Cập nhật lại toàn bộ danh sách bài hát
      };
    default:
      return state;
  }
};

export default SongReducer;
