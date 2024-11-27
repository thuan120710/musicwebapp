// const Rating = require("../models/Rating");
// const Comment = require("../models/Comment");

// exports.addComment = async (req, res) => {
//   try {
//     const { userId, songId, content } = req.body;

//     const newComment = new Comment({
//       user: userId,
//       song: songId,
//       content,
//     });

//     const savedComment = await newComment.save();
//     res.status(201).json(savedComment);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.addOrUpdateRating = async (req, res) => {
//   try {
//     const { userId, songId, score } = req.body;

//     const existingRating = await Rating.findOne({ user: userId, song: songId });

//     if (existingRating) {
//       existingRating.score = score;
//       await existingRating.save();
//     } else {
//       const newRating = new Rating({
//         user: userId,
//         song: songId,
//         score,
//       });
//       await newRating.save();
//     }

//     res.status(201).json({ message: "Đánh giá thành công" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
