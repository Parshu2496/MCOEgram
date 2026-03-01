const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  profilePic: String,
  bio: {
    type: String,
    default: "",
  }
}, { timestamps: true });
module.exports = mongoose.models.User || mongoose.model("User", userSchema);