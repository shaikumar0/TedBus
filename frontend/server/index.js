require('dotenv').config();
const express = require('express')
const bodyparser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express();

app.use(cors());
app.use(bodyparser.json())
app.use('/uploads', express.static('uploads'));

const DBURL = process.env.MONGO_URI;
mongoose.connect(DBURL)
    .then(() => console.log("Mongodb connected"))
    .catch(err => console.error('Mongodb connection error:', err))



const customerroutes = require("./routes/customer");
const routesroute = require("./routes/route");
const bookingroute = require("./routes/booking");
const experienceroute = require("./routes/experience");

const path = require('path');

const fs = require('fs');

// Resolve static path - check both potential locations (Angular 17+ vs older)
const potentialPaths = [
    path.join(__dirname, '../dist/frontend/browser'),
    path.join(__dirname, '../dist/frontend')
];

let staticPath = potentialPaths.find(p => fs.existsSync(p));

if (!staticPath) {
    console.error('CRITICAL: Static path NOT FOUND. Checked:', potentialPaths);
    // Fallback to the first one just to have a path, even if it doesn't exist yet
    staticPath = potentialPaths[0];
} else {
    console.log('Static Path resolved to:', staticPath);
    console.log('Contents:', fs.readdirSync(staticPath));
}

// REQUEST LOGGER
app.use((req, res, next) => {
    console.log(`[REQUEST START] ${req.method} ${req.url}`);

    // Log response status on finish
    res.on('finish', () => {
        console.log(`[REQUEST END] ${req.method} ${req.url} -> Status: ${res.statusCode}`);
    });
    next();
});



// Serve static files from the Angular app (Standard)
app.use(express.static(staticPath));

app.use(bookingroute)
app.use(routesroute)
app.use(customerroutes)
app.use(experienceroute)

// Handle all other routes by serving the index.html from the build folder
app.get('*', (req, res) => {
    const indexPath = path.join(staticPath, 'index.html');
    console.log('[CATCH-ALL] Serving index.html from:', indexPath);
    if (!fs.existsSync(indexPath)) {
        console.error('[ERROR] index.html NOT FOUND at:', indexPath);
        return res.status(404).send('Application build not found on server.');
    }
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.sendFile(indexPath);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})
