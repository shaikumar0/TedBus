const asyncHandler =require("express-async-handler");
const Experience =require("../../models/experience.js");
const ExperienceComment=require("../../models/experienceComment.js");

const getExperienceById = asyncHandler(async (req, res) => {
  const experience = await Experience.findById(req.params.id)
    .populate("userId", "name")
    .lean();

  if (!experience) {
    res.status(404);
    throw new Error("Experience not found");
  }

  const comments = await ExperienceComment.find({
    experienceId: experience._id
  })
    .populate("userId", "name")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: {
      ...experience,
      comments
    }
  });
});

module.exports = getExperienceById