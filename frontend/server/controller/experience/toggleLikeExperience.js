const asyncHandler = require("express-async-handler");
const Experience = require("../../models/experience.js");
const ExperienceLike = require("../../models/experienceLike.js");

const toggleLikeExperience = asyncHandler(async (req, res) => {
  const experienceId = req.params.id;
  const { userId } = req.body;

  if (!userId) {
    return res.status(401).json({ success: false, message: "User not authenticated" });
  }

  const likeExists = await ExperienceLike.findOne({
    experienceId,
    userId
  });

  if (likeExists) {
    await likeExists.deleteOne();

    await Experience.findByIdAndUpdate(experienceId, {
      $inc: { likesCount: -1 }
    });

    return res.json({
      success: true,
      liked: false,
      message: "Like removed"
    });
  }

  await ExperienceLike.create({
    experienceId,
    userId
  });

  await Experience.findByIdAndUpdate(experienceId, {
    $inc: { likesCount: 1 }
  });

  res.json({
    success: true,
    liked: true,
    message: "Post liked"
  });
});

module.exports = toggleLikeExperience