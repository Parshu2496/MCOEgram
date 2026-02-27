import { GoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import api from "../api/axios";

function Login({ setUser }) {
  const [loading, setLoading] = useState(false);

  const handleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);

      const res = await api.post("/api/auth/google", {
        token: credentialResponse.credential,
      });

      localStorage.setItem("token", res.data.token);
      console.log(res.data)
      setUser(res.data.user);

    } catch (error) {
      console.error(
        error.response?.data?.message || "Login failed"
      );
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Login to MCOEgram</h2>

      {loading ? (
        <p>Signing you in...</p>
      ) : (
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => alert("Google Login Failed")}
        />
      )}
    </div>
  );
}

export default Login;