import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
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

  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" />;
    }
    return children;
  };

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

  useEffect(() => {
    if (user) {
      socket.auth = {
        token: localStorage.getItem("token"),
      };

      socket.connect();
    }

    return () => {
      socket.disconnect();
    };
  }, [user]);

if (loading) return <div>Loading...</div>;

return (
  <>
    {user && <Navbar />}

    <Routes>
      <Route
        path="/login"
        element={
          user ? (
            <Navigate to="/feed" />
          ) : (
            <Login setUser={setUser} />
          )
        }
      />

      <Route
        path="/feed"
        element={
          user ? (
            <Feed user={user} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/chats"
        element={
          user ? (
            <ChatsPage user={user} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="*"
        element={<Navigate to={user ? "/feed" : "/login"} />}
      />
    </Routes>
  </>
);
}
export default App;
