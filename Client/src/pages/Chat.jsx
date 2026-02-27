import { useEffect, useState } from "react";
import socket from "../sockets";

function Chat({ currentUser, receiverId }) {
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
        createdAt: new Date()
      }
    ]);

    socket.emit("send_message", msgData);

    setMessage("");
  };

  return (
    <div>
      <h3>Chat</h3>

      <div style={{ height: "300px", overflowY: "auto" }}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign:
                msg.sender === currentUser._id ? "right" : "left"
            }}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type message..."
      />

      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Chat;