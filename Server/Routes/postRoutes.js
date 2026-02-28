const express = require("express");
const router = express.Router();
const Post = require("../Models/Post");
const { protect } = require("../Middlewares/authMiddleware");
const upload = require("../Middlewares/uploadMiddleware");
const { createPost, getPosts, toggleLike, addComment } =  require("../controllers/postController");

router.get("/", protect, getPosts);
router.post("/", protect, upload.single("image"), createPost);
router.post("/:id/comment", protect, addComment);
router.put("/:id/like", protect, toggleLike);

router.get("/user/:userId", protect, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId })
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user posts" });
  }
});

module.exports = router;