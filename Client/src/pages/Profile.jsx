import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function Profile({ currentUser }) {
  const { userId } = useParams();
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
const navigate = useNavigate();

const navigateToChat = () => {
  navigate("/chats", {
    state: { selectedUser: profileUser }
  });
};
  useEffect(() => {
    const fetchPosts = async () => {
      const res = await api.get("/api/posts");
      setPosts(res.data);
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      const userRes = await api.get(`/api/users/${userId}`);
      const postRes = await api.get(`/api/posts`);
      // console.log(postRes.data[0]._id)
      setProfileUser(userRes.data);
      setPosts(postRes.data);
    };

    fetchProfile();
  }, [userId]);

  if (!profileUser) return <div>Loading profile...</div>;
  const isOwnProfile = currentUser._id === userId;

  return (
    <div style={{ padding: "30px" }}>
      <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
        <img
          src={profileUser.profilePic}
          alt="profile"
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
          }}
        />

        <div>
          <h2>{profileUser.name}</h2>
          <p>{profileUser.bio || "No bio yet"}</p>
          <p>
            <strong>{posts.length}</strong> posts
          </p>
        </div>
      </div>
      <div style={{ marginTop: "10px" }}>
        {isOwnProfile ? (
          <button
            style={{
              padding: "8px 16px",
              backgroundColor: "#333",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Edit Profile
          </button>
        ) : (
          <button
            onClick={() => navigateToChat()}
            style={{
              padding: "8px 16px",
              backgroundColor: "#25D366",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Message
          </button>
        )}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "10px",
        }}
      >
        {posts.map((post) => (
          <div key={post._id} style={{ marginBottom: "20px" }}>
            <div>
              <img
                src={post.user.profilePic}
                width="40"
                style={{ borderRadius: "50%" }}
              />
              <strong>
                <Link to={`/profile/${post.user._id}`}>{post.user.name}</Link>
              </strong>
            </div>

            <img
              src={post.imageUrl}
              width="300"
              style={{ display: "block", marginTop: "10px" }}
            />

            <p>{post.caption}</p>
            <button
              style={{
                color: post.likes.includes(currentUser._id) ? "red" : "black",
              }}
              onClick={async () => {
                const updatedPosts = posts.map((p) => {
                  if (p._id === post._id) {
                    const alreadyLiked = p.likes.includes(currentUser._id);

                    return {
                      ...p,
                      likes: alreadyLiked
                        ? p.likes.filter((id) => id !== currentUser._id)
                        : [...p.likes, user._id],
                    };
                  }
                  return p;
                });

                setPosts(updatedPosts);

                await api.put(`/api/posts/${post._id}/like`);
              }}
            >
              ❤️ {post.likes.length}
            </button>
            <div>
              <input
                type="text"
                placeholder="Add comment..."
                onKeyDown={async (e) => {
                  if (e.key === "Enter" && e.target.value.trim()) {
                    const res = await api.post(
                      `/api/posts/${post._id}/comment`,
                      {
                        text: e.target.value,
                      },
                    );

                    const updatedPosts = posts.map((p) =>
                      p._id === post._id
                        ? { ...p, comments: [res.data, ...p.comments] }
                        : p,
                    );

                    setPosts(updatedPosts);
                    e.target.value = "";
                  }
                }}
              />
              {post.comments.map((comment) => (
                <div key={comment._id}>
                  <strong>{comment.user.name}</strong>: {comment.text}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Profile;
