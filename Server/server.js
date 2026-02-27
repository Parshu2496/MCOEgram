require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')
const chatRoutes = require("./Routes/chatRoutes");
const app = express()
connectDB();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 🔥 THIS IS THE IMPORTANT LINE
app.options(/.*/, cors());
const authRoutes = require("./Routes/authRoutes");
const userRoutes = require("./Routes/userRoutes");
const postRoutes = require("./Routes/postRoutes");
const User = require("./Models/User");
const Chat = require("./Models/Chat");
const Message = require("./Models/Message");

app.use(express.json())
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

app.get('/', (req, res) => res.send('MOCEgram API Running'));
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);
  res.status(500).json({ message: "Internal server error" });
});
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) return next(new Error("Not authorized"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return next(new Error("User not found"));

    socket.user = user;
    next();
  } catch (err) {
    next(new Error("Authentication error"));
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.user.name);
  socket.join(socket.user._id.toString());
  socket.on("send_message", async ({ receiverId, text }) => {

  try {

    // 1️⃣ Find or create chat
    let chat = await Chat.findOne({
      participants: { $all: [socket.user._id, receiverId] }
    });

    if (!chat) {
      chat = await Chat.create({
        participants: [socket.user._id, receiverId]
      });
    }

    // 2️⃣ Save message
    const message = await Message.create({
      chat: chat._id,
      sender: socket.user._id,
      text
    });

    // 3️⃣ Emit to receiver
    io.to(receiverId).emit("receive_message", {
      chatId: chat._id,
      sender: socket.user._id,
      text,
      createdAt: message.createdAt
    });

  } catch (err) {
    console.log(err);
  }

});
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
