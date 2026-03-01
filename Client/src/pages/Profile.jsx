import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import api from "../api/axios";

function Profile({ currentUser }) {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const ref = useRef(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const effectiveUserId = userId || currentUser?._id;
const isOwnProfile = currentUser?._id === effectiveUserId;
  const OpenComment = () => {
    ref.current.click();
  };
  
  const navigateToChat = () => {
    navigate("/chats", {
      state: { selectedUser: profileUser },
    });
  };
  // Single clean useEffect
useEffect(() => {
  if (!currentUser) return;

  const id = userId || currentUser._id;

  const fetchProfileData = async () => {
    try {
      const [userRes, postRes] = await Promise.all([
        api.get(`/api/users/${id}`),
        api.get(`/api/posts`),
      ]);

      setProfileUser(userRes.data);

      // 🔥 Proper filtering by user id
      const filteredPosts = postRes.data.filter(
        (post) => post.user && post.user._id === id
      );

      setPosts(filteredPosts);
    } catch (err) {
      console.error(err);
    }
  };

  fetchProfileData();
}, [userId, currentUser]);
  console.log(isOwnProfile)
  if (!profileUser) return <div>Loading profile...</div>;


  return (
    <div style={{ padding: "30px" }}>
      {/* Profile Header */}
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
              onClick={navigateToChat}
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
      </div>

      {/* Posts Grid */}
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
            <div className="CaptionProfile">
              <p className="ProfileCaptionName">{currentUser.name}: </p>
              <p className="ProfileCaption">{post.caption}</p>
            </div>
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
                        : [...p.likes, currentUser._id],
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
              <button
                className="CommentBox"
                data-bs-toggle="modal"
                data-bs-target="#commentModal"
                onClick={() => setSelectedPost(post)}
              >
                <i className="fa-regular fa-comment"></i>
              </button>
            </div>
          </div>
        ))}
        <div
          className="modal fade"
          id="commentModal"
          tabIndex="-1"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Comments</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                ></button>
              </div>

              <div className="modal-body">
                {selectedPost && (
                  <>
                    <input
                      type="text"
                      className="form-control mb-3"
                      placeholder="Add comment..."
                      onKeyDown={async (e) => {
                        if (e.key === "Enter" && e.target.value.trim()) {
                          const res = await api.post(
                            `/api/posts/${selectedPost._id}/comment`,
                            { text: e.target.value },
                          );

                          setPosts((prev) =>
                            prev.map((p) =>
                              p._id === selectedPost._id
                                ? { ...p, comments: [res.data, ...p.comments] }
                                : p,
                            ),
                          );

                          e.target.value = "";
                        }
                      }}
                    />

                    {selectedPost.comments.map((comment) => (
                      <div key={comment._id}>
                        <strong>{comment.user.name}</strong>: {comment.text}
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
