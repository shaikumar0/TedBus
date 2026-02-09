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

if (fs.existsSync(staticPath)) {
    console.log('Static path exists. Contents:', fs.readdirSync(staticPath));
} else {
    console.error('Static path DOES NOT EXIST:', staticPath);
    // Check if dist exists at all
    const distPath = path.join(__dirname, '../dist');
    if (fs.existsSync(distPath)) {
        console.log('dist directory contents:', fs.readdirSync(path.join(__dirname, '../dist')));
        console.log('dist/frontend contents:', fs.existsSync(path.join(distPath, 'frontend')) ? fs.readdirSync(path.join(distPath, 'frontend')) : 'frontend dir not found');
    } else {
        console.error('../dist does not exist');
    }
}

// Log all incoming requests
app.use((req, res, next) => {
    console.log(`[REQUEST] ${req.method} ${req.url}`);
    next();
});

// Serve static files from the Angular app
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
