import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

function Login() {
  const handleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/google",
        {
          token: credentialResponse.credential,
        }
      );

      console.log("JWT:", res.data.token);
      console.log("User:", res.data.user);

      localStorage.setItem("token", res.data.token);

    } catch (error) {
      console.error(error.response.data);
    }
  };

  return (
    <div>
      <h2>Login to MCOEgram</h2>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => console.log("Login Failed")}
      />
    </div>
  );
}

export default Login;