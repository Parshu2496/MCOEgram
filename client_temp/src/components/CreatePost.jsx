import { useState } from "react";
import api from "../api/axios";

function CreatePost() {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("image", image);
    formData.append("caption", caption);

    await api.post("/api/posts", formData);

    alert("Post created!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
      />
      <input
        type="text"
        placeholder="Caption"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />
      <button type="submit">Post</button>
    </form>
  );
}

export default CreatePost;