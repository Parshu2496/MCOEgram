import { useState } from "react";
import api from "../api/axios";

function Profile({ user, setUser }) {
  const [bio, setBio] = useState(user.bio);

  const updateBio = async () => {
    const res = await api.put("/api/users/update", { bio });
    setUser(res.data);
  };

  return (
    <div>
      <img src={user.profilePic} width="100" />
      <h3>{user.name}</h3>
      <p>{user.email}</p>

      <textarea
        value={bio}
        onChange={(e) => setBio(e.target.value)}
      />
      <button onClick={updateBio}>Update Bio</button>
    </div>
  );
}

export default Profile;