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

  if ((!journeyId && !req.body.routeId) || !story) {
    res.status(400);
    throw new Error("Required fields are missing (JourneyID or RouteID, and Story)");
  }

  // Fetch Booking and Bus to get Route ID and Bus Name if journeyId is present
  let busName = "Unknown Bus";
  let routeId = req.body.routeId || null;

  if (journeyId) {
    try {
      const booking = await Booking.findById(journeyId);
      if (booking && booking.busId) {
        const bus = await Bus.findById(booking.busId);
        if (bus) {
          busName = bus.operatorName;
          routeId = bus.routes; // This refers to the Route ID
        }
      }
    } catch (error) {
      console.error("Error fetching bus/route details:", error);
    }
  } else if (routeId) {
    // If no journeyId but routeId is provided, we can try to fetch generic bus info or leave as default
    // For now, we just ensure routeId is used.
    console.log("Using provided routeId:", routeId);
  }

  const photos = req.files ? req.files.map(file => file.path.replace(/\\/g, "/")) : [];

  const experience = await Experience.create({
    userId,
    journeyId,
    routeId,
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