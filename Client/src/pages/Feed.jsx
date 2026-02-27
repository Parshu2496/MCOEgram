import { useEffect, useState } from "react";
import api from "../api/axios";

function Feed({ user }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await api.get("/api/posts");
      setPosts(res.data);
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <h2>Feed</h2>

      {posts.map((post) => (
        <div key={post._id} style={{ marginBottom: "20px" }}>
          <div>
            <img
              src={post.user.profilePic}
              width="40"
              style={{ borderRadius: "50%" }}
            />
            <strong>{post.user.name}</strong>
          </div>

          <img
            src={post.imageUrl}
            width="300"
            style={{ display: "block", marginTop: "10px" }}
          />

          <p>{post.caption}</p>
          <button
            style={{
              color: post.likes.includes(user._id) ? "red" : "black",
            }}
            onClick={async () => {
              const updatedPosts = posts.map((p) => {
                if (p._id === post._id) {
                  const alreadyLiked = p.likes.includes(user._id);

                  return {
                    ...p,
                    likes: alreadyLiked
                      ? p.likes.filter((id) => id !== user._id)
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
            {post.comments.map((comment) => (
              <div key={comment._id}>
                <strong>{comment.user.name}</strong>: {comment.text}
              </div>
            ))}
          </div>
          <input
            type="text"
            placeholder="Add comment..."
            onKeyDown={async (e) => {
              if (e.key === "Enter" && e.target.value.trim()) {
                const res = await api.post(`/api/posts/${post._id}/comment`, {
                  text: e.target.value,
                });

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
        </div>
      ))}
    </div>
  );
}

export default Feed;
