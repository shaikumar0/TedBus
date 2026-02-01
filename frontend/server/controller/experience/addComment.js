const asyncHandler =require("express-async-handler");
const Experience =require("../../models/experience.js");
const ExperienceComment=require("../../models/experienceComment.js");

const addComment = asyncHandler(async (req, res) => {
  const { comment } = req.body;

  if (!comment || comment.trim() === "") {
    res.status(400);
    throw new Error("Comment cannot be empty");
  }

  const newComment = await ExperienceComment.create({
    experienceId: req.params.id,
    userId: req.user.id,
    comment
  });

  await Experience.findByIdAndUpdate(req.params.id, {
    $inc: { commentsCount: 1 }
  });

  res.status(201).json({
    success: true,
    message: "Comment added successfully",
    data: newComment
  });
});

module.exports = addComment