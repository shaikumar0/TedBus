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

app.use(bookingroute)
app.use(routesroute)
app.use(customerroutes)
app.use(experienceroute)

const PORT = 5000
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})
