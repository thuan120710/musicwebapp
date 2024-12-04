import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { connect } from 'react-redux';
import { fetchCategories } from '../../../actions/CategoryAction';
import { fetchSong, deleteSong, updateSongList } from '../../../actions/SongAction';
import { Link } from "react-router-dom";
import axios from 'axios';

const Invoices = (props) => {
  useEffect(() => {
    props.fetchCategories();
    props.fetchSong(); // Fetch both categories and songs from server
  }, []); // Empty dependency array to fetch data only once on component mount
  
  const { songs } = props;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "songName", headerName: "Song Name", flex: 2 },
    { field: "Category", headerName: "Category", flex: 3 },
    {
      field: "Img",
      headerName: "Img",
      flex: 4,
      renderCell: (params) => (
        <img
          src={params.row.Img}  // Lấy hình ảnh từ song.imgSrc
          alt={params.row.songName}  // Sử dụng song name làm alt
          style={{ width: '50px', height: '50px', objectFit: 'cover' }}  // Điều chỉnh kích thước hình ảnh
        />
      ),
    },
    { field: "Artist", headerName: "Artist", flex: 5 },
    {
      field: "Edit",
      headerName: "Edit",
      flex: 5,
      renderCell: (params) => (
        <Link to={`/songs_edit/${params.row.id}`} color="white" underline="hover">
          Edit
        </Link>
      ),
    },
    {
      field: "Delete",
      headerName: "Delete",
      flex: 2,
      renderCell: (params) => (
        <Button
          color="secondary"
          variant="contained"
          onClick={() => handleDelete(params.row.id)}  // Xử lý xóa bài hát
        >
          Delete
        </Button>
      ),
    },
  ];

  // Hàm xóa bài hát
  const handleDelete = async (id) => {
    try {
      // Gọi API để xóa bài hát
      await axios.delete(`http://localhost:4000/api/song/${id}`);
      alert('Song deleted successfully!');
      
      // Cập nhật lại danh sách bài hát sau khi xóa
      const updatedSongs = props.songs.filter(song => song._id !== id);
      props.updateSongList(updatedSongs); // Cập nhật danh sách trong Redux

      // Nếu bạn muốn gọi lại API để lấy danh sách bài hát mới, có thể gọi:
      // props.fetchSong(); // Cập nhật danh sách bài hát từ server
    } catch (error) {
      console.error('Error deleting song:', error);
      alert('Failed to delete song');
    }
  };

  // Map categories data to rows for the DataGrid
  const rows = songs.map(song => ({
    id: song._id, // Use the unique identifier from the song object
    songName: song.songName,
    Category: song.category,
    Img: song.imgSrc,
    Artist: song.artist,
    // Add more fields as needed
  }));

  return (
    <Box m="20px">
      <Header title="INVOICES" subtitle="List of Invoice Balances" />
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid rows={rows} columns={columns} />
      </Box>
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    categories: state.CategoryAdmin.categories || [],
    songs: state.SongAdmin.songs || [],
  };
};

export default connect(mapStateToProps, { fetchCategories, fetchSong, deleteSong, updateSongList })(Invoices);
