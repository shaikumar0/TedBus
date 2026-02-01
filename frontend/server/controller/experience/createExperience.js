const asyncHandler = require("express-async-handler");
const Experience = require("../../models/experience.js");
const mongoose = require("mongoose")
const Booking = require("../../models/booking.js");
const Bus = require("../../models/bus.js");

const createExperience = asyncHandler(async (req, res) => {
  console.log("Creating Experience with body:", req.body);
  console.log("Files:", req.files);

  const {
    userId,
    journeyId,
    source,
    destination,
    story,
    rating
  } = req.body;

  if (!journeyId || !source || !destination || !story) {
    res.status(400);
    throw new Error("Required fields are missing");
  }

  // Fetch Booking to get Bus ID
  let busName = "Unknown Bus";
  if (journeyId) {
    try {
      const booking = await Booking.findById(journeyId);
      if (booking && booking.busId) {
        const bus = await Bus.findById(booking.busId);
        if (bus) {
          busName = bus.operatorName;
        }
      }
    } catch (error) {
      console.error("Error fetching bus details:", error);
    }
  }

  const photos = req.files ? req.files.map(file => file.path.replace(/\\/g, "/")) : [];

  const experience = await Experience.create({
    userId,
    journeyId,
    source,
    destination,
    story,
    rating,
    photos,
    busName
  });

  console.log("Experience created:", experience);
  res.status(201).json({
    success: true,
    message: "Experience created successfully",
    data: experience
  });
});

module.exports = createExperience