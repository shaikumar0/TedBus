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

app.get('/', (req, res) => {
    res.send('Hello , Ted bus is working')
})

const customerroutes = require("./routes/customer");
const routesroute = require("./routes/route");
const bookingroute = require("./routes/booking");
const experienceroute = require("./routes/experience");

const path = require('path');

app.use(bookingroute)
app.use(routesroute)
app.use(customerroutes)
app.use(experienceroute)

// Serve static files from the Angular app
app.use(express.static(path.join(__dirname, '../dist/frontend/browser')));

// Handle all other routes by serving the index.html from the build folder
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/frontend/browser/index.html'));
});

const PORT = 5000
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})
