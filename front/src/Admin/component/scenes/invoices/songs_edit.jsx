import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { updateSong } from "../../../actions/AuthAdminAction";
import { connect } from 'react-redux';
import { fetchCategories } from '../../../actions/CategoryAction';

const SongsEdit = (props) => {
    const [songData, setSongData] = useState({}); // Lưu dữ liệu bài hát
    const [selectedAudioFile, setSelectedAudioFile] = useState(null); // Lưu file audio nếu chọn
    const [selectedImageFile, setSelectedImageFile] = useState(null); // Lưu file ảnh nếu chọn
    const isNonMobile = useMediaQuery("(min-width:600px)");

    // Lấy dữ liệu bài hát khi trang Edit mở
    useEffect(() => {
        const fetchSongData = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/api/getsongs/${props.match.params.id}`);
                const song = response.data; // Giả sử response.data là thông tin bài hát
                setSongData(song); // Cập nhật songData với dữ liệu bài hát

            } catch (error) {
                console.error('Error fetching song data:', error);
            }
        };

        fetchSongData();
    }, [props.match.params.id]);

    // Khi người dùng chọn file âm thanh
    const handleAudioFileChange = (event) => {
        setSelectedAudioFile(event.target.files[0]);
    };

    // Khi người dùng chọn file ảnh
    const handleImageFileChange = (event) => {
        setSelectedImageFile(event.target.files[0]);
    };

    // Hàm submit để gửi dữ liệu lên API
    const handleSubmit = async (values) => {
        const formData = new FormData();

        // Chỉ gửi các trường có thay đổi hoặc các trường người dùng chỉnh sửa
        if (selectedAudioFile) {
            formData.append('song', selectedAudioFile);
        } else {
            formData.append('song', songData.songFile); // Giữ nguyên file cũ nếu không thay đổi
        }

        if (selectedImageFile) {
            formData.append('imgSrc', selectedImageFile);
        } else {
            formData.append('imgSrc', songData.imgSrc); // Giữ nguyên ảnh cũ nếu không thay đổi
        }

        formData.append('songName', values.songName || songData.songName);
        formData.append('category', values.category || songData.category);
        formData.append('artist', values.artist || songData.artist);
        formData.append('favourite', values.favourite);
        formData.append('type', values.type || songData.type);

        try {
            await props.updateSong(props.match.params.id, formData);
            alert('Song updated successfully!');
        } catch (error) {
            console.error('Error updating song:', error);
            alert('Error updating song');
        }
    };

    return (
        <Box m="20px">
            <Header title="EDIT SONG" subtitle="Edit Song Details" />
            {songData && songData.songName ? ( // Kiểm tra nếu dữ liệu bài hát đã được lấy
                <Formik
                    initialValues={{
                        songName: songData.songName || '',
                        artist: songData.artist || '',
                        category: songData.category || '',
                        favourite: songData.favourite || false,
                        type: songData.type || '',
                    }}
                    validationSchema={checkoutSchema}
                    onSubmit={handleSubmit}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                    }) => (
                        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(values); }}>
                            <Box
                                display="grid"
                                gap="30px"
                                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                                sx={{
                                    "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                                }}
                            >
                                {/* Tên bài hát */}
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    label="Song Name"
                                    name="songName"
                                    value={values.songName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.songName && !!errors.songName}
                                    helperText={touched.songName && errors.songName}
                                    sx={{ gridColumn: "span 2" }}
                                />

                                {/* Nghệ sĩ */}
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    label="Artist"
                                    name="artist"
                                    value={values.artist}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.artist && !!errors.artist}
                                    helperText={touched.artist && errors.artist}
                                    sx={{ gridColumn: "span 2" }}
                                />

                                {/* Thể loại */}
                                <FormControl fullWidth sx={{ gridColumn: "span 2" }}>
                                    <InputLabel id="category-label">Category</InputLabel>
                                    <Select
                                        labelId="category-label"
                                        id="category"
                                        value={values.category}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.category && !!errors.category}
                                    >
                                        {props.categories.map((category) => (
                                            <MenuItem key={category.id} value={category.name}>
                                                {category.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                {/* File âm thanh */}
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="file"
                                    label="Song"
                                    onBlur={handleBlur}
                                    onChange={handleAudioFileChange}
                                    helperText={songData.songFile && `Current: ${songData.songFile}`}
                                    sx={{ gridColumn: "span 4" }}
                                />

                                {/* File hình ảnh */}
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="file"
                                    label="Image Source"
                                    onBlur={handleBlur}
                                    onChange={handleImageFileChange}
                                    sx={{ gridColumn: "span 4" }}
                                />

                                {/* Favourite */}
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="checkbox"
                                    label="Favourite"
                                    name="favourite"
                                    checked={values.favourite}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    sx={{ gridColumn: "span 4" }}
                                />

                                {/* Type */}
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    label="Type"
                                    name="type"
                                    value={values.type}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.type && !!errors.type}
                                    helperText={touched.type && errors.type}
                                    sx={{ gridColumn: "span 4" }}
                                />
                            </Box>
                            <Box display="flex" justifyContent="end" mt="20px">
                                <Button type="submit" color="secondary" variant="contained">
                                    Update Song
                                </Button>
                            </Box>
                        </form>
                    )}
                </Formik>
            ) : (
                <p>Loading...</p> // Hiển thị khi dữ liệu chưa được tải xong
            )}
        </Box>
    );
};

const checkoutSchema = yup.object().shape({
    songName: yup.string().required("Song name is required"),
    favourite: yup.boolean().required("Favourite status is required"),
});

const mapStateToProps = state => {
    return {
        categories: state.CategoryAdmin.categories || [],
    };
};

export default connect(mapStateToProps, { fetchCategories, updateSong })(SongsEdit);
