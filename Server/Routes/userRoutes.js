const express = require("express");
const User = require("../Models/User");
const router = express.Router();
const { protect } = require("../Middlewares/authMiddleware");

router.get("/me", protect, async (req, res) => {
  res.json(req.user);
});

router.put("/update", protect, async (req, res) => {
  const { bio } = req.body;

  const user = await User.findById(req.user._id);

  if (user) {
    user.bio = bio || user.bio;
    await user.save();
    res.json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

module.exports = router;