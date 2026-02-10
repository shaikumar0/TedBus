const nodemailer = require('nodemailer');
const dns = require('dns');

// Force IPv4 for DNS lookups to avoid ENETUNREACH on IPv6-only environments (like some cloud providers)
if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
}

// Configure the transporter
// POST-REVIEW: User must update .env with actual credentials
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use STARTTLS
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    family: 4, // Force IPv4
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,
    socketTimeout: 10000
});

const sendConfirmation = async (email, bookingDetails) => {
    const mailOptions = {
        from: '"TedBus" <noreply@tedbus.com>',
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
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending confirmation email:', error);
    }
};

const sendCancellation = async (email, bookingDetails) => {
    const mailOptions = {
        from: '"TedBus" <noreply@tedbus.com>',
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
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending cancellation email:', error);
    }
};

module.exports = {
    sendConfirmation,
    sendCancellation
};
