import { useEffect, useState } from "react";
import api from "./api/axios";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import Feed from "./pages/Feed";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await api.get("/api/users/me");
        setUser(res.data);
      } catch (err) {
        console.log("Not logged in");
      }
    };

    checkUser();
  }, []);

  if (!user) return <Login />;



return (
  <>
    <Navbar user={user} />
    <Feed user={user} />
  </>
);
}

export default App;