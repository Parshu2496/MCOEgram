const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const { createPost, getPosts, toggleLike, addComment } =  require("../controllers/postController");

router.get("/", protect, getPosts);
router.post("/", protect, upload.single("image"), createPost);
router.post("/:id/comment", protect, addComment);
router.put("/:id/like", protect, toggleLike);

router.get("/user/:userId", async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId })
      .populate("user")
      .populate({
        path: "comments",
        populate: {
          path: "user",
          model: "User",
        },
      })
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;