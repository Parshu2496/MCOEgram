import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "12px 20px",
      backgroundColor: "#222",
      color: "white"
    }}>
      <div>
        <Link to="/feed" style={{ color: "white", marginRight: "15px" }}>
          Feed
        </Link>

        <Link to="/chats" style={{ color: "white" }}>
          Chats
        </Link>
      </div>

      <button onClick={logout} style={{
        backgroundColor: "#ff4d4d",
        border: "none",
        padding: "6px 12px",
        color: "white",
        cursor: "pointer"
      }}>
        Logout
      </button>
    </div>
  );
}

export default Navbar;