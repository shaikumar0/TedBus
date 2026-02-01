const Booking = require("../models/booking");

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
        console.log(booking);
        res.send(booking);
    } catch (error) {
        console.error("Error adding booking:", error);
        res.status(400).send({ message: error.message });
    }
}

exports.getBooking = async (req, res) => {
    try {
        let { id } = req.params;
        const bookings = await Booking.find({ customerId: id }).lean().exec();

        // Fetch bus details for each booking
        const bookingsWithBusInfo = await Promise.all(bookings.map(async (booking) => {
            if (booking.busId) {
                const bus = await require("../models/bus").findById(booking.busId).lean().exec();
                return { ...booking, busName: bus ? bus.operatorName : 'Bus Service' };
            }
            return { ...booking, busName: 'Bus Service' };
        }));

        res.send(bookingsWithBusInfo);
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).send({ message: "Error fetching bookings" });
    }
}