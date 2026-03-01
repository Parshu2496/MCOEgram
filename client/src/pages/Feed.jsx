import { useEffect, useState, useRef } from "react";
import api from "../api/axios";
import Chat from "./Chat";
import { Link } from "react-router-dom";
import "../main.css";

function Feed({ user }) {
  const [posts, setPosts] = useState([]);
  const ref = useRef(null);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await api.get("/api/posts");
      setPosts(res.data);
    };

    fetchPosts();
  }, []);

  const OpenComment = () => {
    ref.current.click();
  };

  return (
    <div className="container d-flex flex-column align-items-center ">
      <button
        type="button"
        className="btn btn-primary d-none"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
        ref={ref}
      >
        Launch demo modal
      </button>
      <div className="Feed">
        {posts.map((post) => (
          <div className="Post" key={post._id} style={{ marginBottom: "20px" }}>
            <div>
              <div className="">
                <div className="card-header">
                  {" "}
                  <img
                    src={post.user.profilePic}
                    width="40"
                    style={{ borderRadius: "50%" }}
                  />
                  <strong>
                    <Link to={`/profile/${post.user._id}`}>
                      {post.user.name}
                    </Link>
                  </strong>
                </div>
                <div className="card-body">
                  <img
                    src={post.imageUrl}
                    width="300"
                    style={{ display: "block", marginTop: "10px" }}
                  />
                  <h5 className="card-title d-flex CaptionBox">
                    <p className="CaptionName">{post.user.name}: </p>
                    <p className="Caption">{post.caption}</p>
                  </h5>
                  <div className="card text-center row-md-6 my-0 notes FooterPost">
                    <button
                      className="LikeButton"
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
              </div>
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

export default Feed;
