const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  text: String,
  delivered: {
  type: Boolean,
  default: false
  },
}, { timestamps: true });

module.exports = mongoose.model("Message", messageSchema);