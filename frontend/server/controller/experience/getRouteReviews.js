const asyncHandler = require("express-async-handler");
const Experience = require("../../models/experience.js");

const getRouteReviews = asyncHandler(async (req, res) => {
    const { routeId } = req.params;

    if (!routeId) {
        res.status(400);
        throw new Error("Route ID is required");
    }

    const reviews = await Experience.find({ routeId })
        .populate("userId", "name") // Assuming Customer model has a name field
        .sort({ createdAt: -1 });

    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
        ? reviews.reduce((acc, curr) => acc + (curr.rating || 0), 0) / totalReviews
        : 0;

    res.status(200).json({
        success: true,
        data: {
            reviews,
            averageRating: parseFloat(averageRating.toFixed(1)),
            totalReviews
        }
    });
});

module.exports = getRouteReviews;
