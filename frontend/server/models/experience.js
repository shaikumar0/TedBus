const mongoose = require("mongoose");
const experienceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customers",
      required: true,
      index: true
    },

    busName: {
      type: String,
      required: false, // Optional for now to support backward compatibility
      trim: true
    },

    journeyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bookings",
      required: true
    },

    routeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Routes",
      index: true
    },

    source: {
      type: String,
      required: true,
      index: true
    },

    destination: {
      type: String,
      required: true,
      index: true
    },

    story: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000
    },

    photos: [
      {
        type: String // Cloudinary / S3 URL
      }
    ],

    rating: {
      type: Number,
      min: 1,
      max: 5
    },

    likesCount: {
      type: Number,
      default: 0
    },

    commentsCount: {
      type: Number,
      default: 0
    },

    isPublic: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);
module.exports = mongoose.model("Experience", experienceSchema);
