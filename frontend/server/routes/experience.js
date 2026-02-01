const createExperience = require("../controller/experience/createExperience");
const getCommunityFeed = require("../controller/experience/getCommunityFeed");
const getExperienceById = require("../controller/experience/getExperienceById");
const toggleLikeExperience = require("../controller/experience/toggleLikeExperience");
const addComment = require("../controller/experience/addComment");
const upload = require("../middleware/upload");
const express = require("express")
const router = express.Router()

router.post("/experience", upload.array('photos', 5), createExperience);
router.get("/experience", getCommunityFeed);
router.get("/experience/:id", getExperienceById);
router.post("/experience/:id/like", toggleLikeExperience);
router.post("/experience/:id/comment", addComment);

module.exports = router;