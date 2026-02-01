const asyncHandler = require("express-async-handler");
const Experience = require("../../models/experience.js");


const getCommunityFeed = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const search = req.query.search
    ? {
      $or: [
        { source: { $regex: req.query.search, $options: "i" } },
        { destination: { $regex: req.query.search, $options: "i" } }
      ]
    }
    : {};

  console.log("Fetching community feed with query:", search);
  const experiences = await Experience.find({
    isPublic: true,
    ...search
  })
    .populate("userId", "name")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  console.log("Found experiences:", experiences.length);

  const total = await Experience.countDocuments({
    isPublic: true,
    ...search
  });

  res.json({
    success: true,
    page,
    totalPages: Math.ceil(total / limit),
    data: experiences
  });
});


module.exports = getCommunityFeed