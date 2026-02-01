const mongoose = require("mongoose");

const experienceLikeSchema = new mongoose.Schema(
  {
    experienceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Experience",
      required: true,
      index: true
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Prevent multiple likes by same user
experienceLikeSchema.index(
  { experienceId: 1, userId: 1 },
  { unique: true }
);

module.exports=mongoose.model(
  "ExperienceLike",
  experienceLikeSchema
);
