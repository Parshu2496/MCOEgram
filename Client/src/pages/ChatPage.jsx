import { useEffect, useState } from "react";
import api from "../api/axios";
import Chat from "./Chat";
import socket from "../sockets";
function ChatsPage({ user }) {
  const [chats, setChats] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUsers, setShowUsers] = useState(false);
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  useEffect(() => {
    socket.on("online_users", (users) => {
      console.log("Initial online users:", users);
      setOnlineUsers(users);
    });

    socket.on("user_online", (userId) => {
      console.log("User came online:", userId);
      setOnlineUsers((prev) => [...new Set([...prev, userId])]);
    });

    socket.on("user_offline", (userId) => {
      console.log("User went offline:", userId);
      setOnlineUsers((prev) => prev.filter((id) => id !== userId));
    });

    return () => {
      socket.off("online_users");
      socket.off("user_online");
      socket.off("user_offline");
    };
  }, []);

  const fetchUsers = async () => {
    const res = await api.get("/api/users");
    setUsers(res.data);
  };

  socket.on("receive_message", (data) => {
  setChats((prevChats) => {
    return prevChats.map((chat) => {
      if (chat._id === data.chatId) {
        return {
          ...chat,
          lastMessage: {
            text: data.text,
            sender: data.sender,
            createdAt: data.createdAt,
          },
        };
      }
      return chat;
    }).sort((a, b) => 
      new Date(b.lastMessage?.createdAt || 0) -
      new Date(a.lastMessage?.createdAt || 0)
    );
  });
});

  useEffect(() => {
    if (showUsers) {
      const fetchUsers = async () => {
        try {
          const res = await api.get("/api/users");
          setUsers(res.data);
        } catch (err) {
          console.error("Failed to fetch users", err);
        }
      };

      fetchUsers();
    }
  }, [showUsers]);
  useEffect(() => {
    const fetchChats = async () => {
      const res = await api.get("/api/chat");
      setChats(res.data);
    };

    fetchChats();
  }, []);
  return (
   <div style={{
  display: "flex",
  height: "100vh",
  backgroundColor: "#f5f5f5"
}}>
      {/* Sidebar */}
      <div style={{
  width: "30%",
  backgroundColor: "white",
  borderRight: "1px solid #ddd",
  display: "flex",
  flexDirection: "column"
}}>
        <h3>Chats</h3>
        <button
          onClick={() => {
            console.log("New Chat clicked");
            setShowUsers(true);
          }}
        >
          + New Chat
        </button>
        {showUsers && (
          <div style={{ marginTop: "10px" }}>
            {users.length === 0 && <p>No users found</p>}

            {users
              .filter((u) => u._id !== user._id)
              .map((user) => (
                <div
                  key={user._id}
                  style={{
                    cursor: "pointer",
                    padding: "8px",
                    borderBottom: "1px solid #ccc",
                  }}
                  onClick={() => {
                    setSelectedUser(user);
                    setShowUsers(false);
                  }}
                >
                  {user.name}
                </div>
              ))}
          </div>
        )}
        {chats.map((chat) => {
          const otherUser = chat.participants.find(
            (p) => p._id.toString() !== user._id.toString(),
          );
          if (!otherUser) return null;

          console.log("Other user id:", otherUser._id.toString());
          console.log("Online users:", onlineUsers);

          return (
            <div
              key={chat._id}
              style={{ padding: "10px", cursor: "pointer" }}
              onClick={() => setSelectedUser(otherUser)}
            >
              <strong>
                {otherUser.name}
                {onlineUsers.some((id) => id === otherUser._id.toString()) && (
                  <span style={{ color: "green", marginLeft: "6px" }}>●</span>
                )}
              </strong>

              <p style={{ fontSize: "12px", color: "gray" }}> 
                {chat.lastMessage?.text || "No messages yet"}
              </p>
            </div>
          );
        })}
      </div>

      {/* Chat Window */}
      <div style={{ flex: 1 }}>
        {selectedUser && (
          <Chat currentUser={user} receiverId={selectedUser._id} />
        )}
      </div>
    </div>
  );
}

export default ChatsPage;
