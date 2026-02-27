import { useEffect, useState } from "react";
import api from "../api/axios";
import Chat from "./Chat";

function ChatsPage({ currentUser }) {
  const [chats, setChats] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUsers, setShowUsers] = useState(false);
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const res = await api.get("/api/users");
    setUsers(res.data);
  };

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

  return (
    <div style={{ display: "flex", height: "90vh" }}>
      {/* Sidebar */}
      <div style={{ width: "30%", borderRight: "1px solid gray" }}>
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
              .filter((u) => u._id !== currentUser._id)
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
            (p) => p._id.toString() !== currentUser._id.toString(),
          );

          if (!otherUser) return null; // 🔥 Prevent crash

          return (
            <div
              key={chat._id}
              style={{ padding: "10px", cursor: "pointer" }}
              onClick={() => setSelectedUser(otherUser)}
            >
              <strong>{otherUser.name}</strong>
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
          <Chat currentUser={currentUser} receiverId={selectedUser._id} />
        )}
      </div>
    </div>
  );
}

export default ChatsPage;
