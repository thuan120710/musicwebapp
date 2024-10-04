const express = require("express");
const router = express.Router();

router.use("/playlists", require("./playlist"));

module.exports = router;
