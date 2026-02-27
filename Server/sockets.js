const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

module.exports = function (server) {
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

      // 🔥 ADD THIS LINE
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
