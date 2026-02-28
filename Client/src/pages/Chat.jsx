import { useEffect, useState } from "react";
import socket from "../sockets";
import { useRef } from "react";
import api from "../api/axios";

function Chat({ currentUser, receiverId }) {
    const messagesEndRef = useRef(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Listen for incoming messages
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  useEffect(() => {
  messagesEndRef.current?.scrollIntoView({
    behavior: "smooth"
  });
}, [messages]);

  useEffect(() => {
    if (!receiverId) return;

    const fetchMessages = async () => {
      const res = await api.get(`/api/chat/${receiverId}`);
      setMessages(res.data);
    };
    fetchMessages();
  }, [receiverId]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const msgData = {
      receiverId,
      text: message,
    };

    // Optimistic update
    setMessages((prev) => [
      ...prev,
      {
        sender: currentUser._id,
        text: message,
        createdAt: new Date(),
      },
    ]);

    socket.emit("send_message", msgData);

    setMessage("");
  };

  return (
      <div style={{
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    backgroundColor: "#e5ddd5"
  }}>

    {/* Header */}
    <div style={{
      padding: "15px",
      backgroundColor: "white",
      borderBottom: "1px solid #ddd",
      fontWeight: "bold"
    }}>
      Chat
    </div>

        <div
      ref={messagesEndRef}
      style={{
        flex: 1,
        overflowY: "auto",
        padding: "15px",
        display: "flex",
        flexDirection: "column",
        gap: "8px"
      }}
    >
        {messages.map((msg, index) => (
        <div
          key={index}
          style={{
            alignSelf:
              msg.sender === currentUser._id
                ? "flex-end"
                : "flex-start",
            backgroundColor:
              msg.sender === currentUser._id
                ? "#dcf8c6"
                : "white",
            padding: "8px 12px",
            borderRadius: "12px",
            maxWidth: "60%",
            boxShadow: "0 1px 2px rgba(0,0,0,0.1)"
          }}
        >
            {msg.text}
          </div>
        ))}
      </div>
        <div style={{
      display: "flex",
      padding: "10px",
      backgroundColor: "white",
      borderTop: "1px solid #ddd"
    }}>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        style={{
          flex: 1,
          padding: "10px",
          borderRadius: "20px",
          border: "1px solid #ccc",
          outline: "none"
        }}
      />

            <button
        onClick={sendMessage}
        style={{
          marginLeft: "10px",
          padding: "8px 16px",
          borderRadius: "20px",
          border: "none",
          backgroundColor: "#25D366",
          color: "white",
          cursor: "pointer"
        }}
      >Send</button></div>
    </div>
  );
}

export default Chat;
