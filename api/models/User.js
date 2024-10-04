const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    // profilePic: {
    //   type: String,
    //   default: "",
    // },
    // role: {
    //   type: String,
    //   enum: ["user", "editor", "admin"], // Defines the available roles
    //   default: "user", // Default role assigned to a new user
    // },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
