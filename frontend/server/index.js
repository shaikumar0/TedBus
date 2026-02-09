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

const staticPath = path.join(__dirname, '../dist/frontend/browser');
console.log('__dirname:', __dirname);
console.log('Static Path resolved to:', staticPath);

// Check if static path exists
if (fs.existsSync(staticPath)) {
    console.log('Static path exists. Contents:', fs.readdirSync(staticPath));
} else {
    console.error('CRITICAL: Static path DOES NOT EXIST:', staticPath);
}

// REQUEST LOGGER
app.use((req, res, next) => {
    console.log(`[REQUEST] ${req.method} ${req.url}`);
    next();
});

// MANUAL STATIC FILE HANDLER (To debug/fix static serving issues)
app.use((req, res, next) => {
    if (req.method !== 'GET') return next();

    // Check if the request is for a static file (by extension)
    // or if it matches a file in the static directory
    let requestPath = req.path;

    // Remove query params if any (req.path handles this usually)
    const filePath = path.join(staticPath, requestPath);

    if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
        console.log(`[MANUAL SERVE] Serving file: ${filePath}`);
        return res.sendFile(filePath);
    }

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
    console.log('Serving index.html from:', indexPath);
    if (!fs.existsSync(indexPath)) {
        console.error('index.html NOT FOUND at:', indexPath);
        return res.status(404).send('Application build not found on server.');
    }
    res.sendFile(indexPath);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})
