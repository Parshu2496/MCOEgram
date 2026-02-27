const express = require("express");
const router = express.Router();
const { protect } = require("../Middlewares/authMiddleware");
const upload = require("../Middlewares/uploadMiddleware");
const { createPost, getPosts, toggleLike, addComment } =  require("../controllers/postController");

router.get("/", protect, getPosts);
router.post("/", protect, upload.single("image"), createPost);
router.post("/:id/comment", protect, addComment);
router.put("/:id/like", protect, toggleLike);

module.exports = router;