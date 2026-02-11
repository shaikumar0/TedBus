const { Resend } = require('resend');

// Configure Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

const sendConfirmation = async (email, bookingDetails) => {
    try {
        await resend.emails.send({
            from: 'TedBus <onboarding@resend.dev>', // Resend requires a verified domain or onboarding@resend.dev for testing
            to: email,
            subject: 'Booking Confirmation - TedBus',
            html: `
                <h1>Booking Confirmed!</h1>
                <p>Dear Customer,</p>
                <p>Your booking with TedBus has been confirmed.</p>
                <h3>Journey Details:</h3>
                <ul>
                    <li><strong>Bus:</strong> ${bookingDetails.busName || 'Bus Service'}</li>
                    <li><strong>From:</strong> ${bookingDetails.departureDetails.city} - ${bookingDetails.departureDetails.time}:00</li>
                    <li><strong>To:</strong> ${bookingDetails.arrivalDetails.city} - ${bookingDetails.arrivalDetails.time}:00</li>
                    <li><strong>Date:</strong> ${bookingDetails.departureDetails.date}</li>
                    <li><strong>Seats:</strong> ${Array.isArray(bookingDetails.seats) ? bookingDetails.seats.join(', ') : bookingDetails.seats}</li>
                    <li><strong>Total Fare:</strong> ₹${bookingDetails.fare}</li>
                </ul>
                <p>Thank you for choosing TedBus!</p>
            `
        });
    } catch (error) {
        console.error('Error sending confirmation email via Resend:', error);
    }
};

const sendCancellation = async (email, bookingDetails) => {
    try {
        await resend.emails.send({
            from: 'TedBus <onboarding@resend.dev>',
            to: email,
            subject: 'Booking Cancelled - TedBus',
            html: `
                <h1>Booking Cancelled</h1>
                <p>Dear Customer,</p>
                <p>Your booking has been successfully cancelled as per your request.</p>
                <h3>Cancelled Booking Details:</h3>
                <ul>
                    <li><strong>From:</strong> ${bookingDetails.departureDetails.city}</li>
                    <li><strong>To:</strong> ${bookingDetails.arrivalDetails.city}</li>
                    <li><strong>Date:</strong> ${bookingDetails.departureDetails.date}</li>
                </ul>
                <p>We hope to serve you again soon.</p>
            `
        });
    } catch (error) {
        console.error('Error sending cancellation email via Resend:', error);
    }
};

module.exports = {
    sendConfirmation,
    sendCancellation
};
