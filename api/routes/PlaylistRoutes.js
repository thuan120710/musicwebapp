const express = require("express");
const router = express.Router();
const playlistController = require("../controllers/PlaylistController");

router.post("/playlist", playlistController.createPlaylist);
router.get("/playlists/:userId", playlistController.getUserPlaylists);
router.get("/songs/:category", playlistController.getSongsByCategory);
router.get("/songs/search", playlistController.searchSongs);
router.post("/playlist/add-song", playlistController.addSongToPlaylist);
// Route để lấy bài hát từ playlist
router.get("/playlists/:playlistId/songs", playlistController.getPlaylistSongs);

// Route để xóa bài hát khỏi playlist
router.post("/playlist/remove-song", playlistController.removeSongFromPlaylist);

module.exports = router;
