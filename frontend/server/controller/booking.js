const Booking = require("../models/booking");
const emailSender = require("../utils/emailSender");

exports.addbooking = async (req, res) => {
    try {
        let bookingData = { ...req.body };

        // Parse seats if it's a string, e.g. "39,38" or "[39,38]"
        if (typeof bookingData.seats === 'string') {
            try {
                // Try JSON parse first
                bookingData.seats = JSON.parse(bookingData.seats);
            } catch (e) {
                // If simple comma separated string
                bookingData.seats = bookingData.seats.split(',').map(Number);
            }
        }

        const booking = await Booking.create(bookingData);

        // Fetch bus name if possible for better email context, or just pass generic
        // For now, we'll pass basic details.
        // If you want bus name in email immediately, you'd need to fetch Bus model here.
        // Let's keep it simple or fetch if needed.
        // Currently emailSender handles missing busName gracefully.
        emailSender.sendConfirmation(booking.email, booking);

        res.send(booking);
    } catch (error) {
        console.error("Error adding booking:", error);
        res.status(400).send({ message: error.message });
    }
}

exports.cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findById(id);

        if (!booking) {
            return res.status(404).send({ message: "Booking not found" });
        }

        if (booking.status === 'CANCELLED') {
            return res.status(400).send({ message: "Booking is already cancelled" });
        }

        booking.status = 'CANCELLED';
        await booking.save();
        emailSender.sendCancellation(booking.email, booking);

        res.send(booking);
    } catch (error) {
        console.error("Error cancelling booking:", error);
        res.status(500).send({ message: "Error cancelling booking" });
    }
}

exports.getBooking = async (req, res) => {
    try {
        let { id } = req.params;
        const bookings = await Booking.find({ customerId: id }).lean().exec();

        // Fetch bus details and check for shared experience for each booking
        const bookingsWithExtraInfo = await Promise.all(bookings.map(async (booking) => {
            let busName = 'Bus Service';
            if (booking.busId) {
                const bus = await require("../models/bus").findById(booking.busId).lean().exec();
                busName = bus ? bus.operatorName : 'Bus Service';
            }

            // Check if experience already exists for this booking
            const Experience = require("../models/experience");
            const experience = await Experience.findOne({ journeyId: booking._id }).lean().exec();

            return {
                ...booking,
                busName,
                hasSharedExperience: !!experience
            };
        }));

        res.send(bookingsWithExtraInfo);
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).send({ message: "Error fetching bookings" });
    }
}
