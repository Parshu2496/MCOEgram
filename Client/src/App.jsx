import { useEffect, useState } from "react";
import api from "./api/axios";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import ChatsPage from "./pages/ChatPage";
import Feed from "./pages/Feed";
import socket from "./sockets";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      socket.auth = {
        token: localStorage.getItem("token"),
      };

      socket.connect();

      socket.on("connect", () => {
        console.log("Socket connected:", socket.id);
      });

      socket.on("connect_error", (err) => {
        console.log("Socket error:", err.message);
      });
    }

    return () => {
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await api.get("/api/users/me");
        setUser(res.data);
      } catch (err) {
        console.log("Not logged in");
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!user) return <Login setUser={setUser} />;

  return (
    <>
      <Navbar user={user} />
      <Feed user={user} />
      <ChatsPage currentUser={user} />
    </>
  );
}
export default App;
