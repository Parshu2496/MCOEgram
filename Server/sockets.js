const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

module.exports = function (server) {
  useEffect(() => {
    socket.on("user_online", (userId) => {
      setOnlineUsers((prev) => [...new Set([...prev, userId])]);
    });

    socket.on("user_offline", (userId) => {
      setOnlineUsers((prev) => prev.filter((id) => id !== userId));
    });

    return () => {
      socket.off("user_online");
      socket.off("user_offline");
    };
  }, []);

  useEffect(() => {
    const handleReceive = (data) => {
      setMessages((prev) => [...prev, data]);
    };

    socket.on("receive_message", handleReceive);

    return () => {
      socket.off("receive_message", handleReceive);
    };
  }, []);
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    socket.on("send_message", async ({ receiverId, text }) => {
      if (!receiverId || !mongoose.Types.ObjectId.isValid(receiverId)) {
        console.log("Invalid receiverId:", receiverId);
        return;
      }

      if (!text?.trim()) return;
      
      let chat = await Chat.findOne({
        participants: { $all: [socket.user._id, receiverId] },
      });

      if (!chat) {
        chat = await Chat.create({
          participants: [socket.user._id, receiverId],
        });
      }

      const message = await Message.create({
        chat: chat._id,
        sender: socket.user._id,
        text,
      });

      await Chat.findByIdAndUpdate(chat._id, {
        updatedAt: new Date(),
      });

      io.to(receiverId).emit("receive_message", {
        chatId: chat._id,
        sender: socket.user._id,
        text,
        createdAt: message.createdAt,
      });
    });
  });
};
