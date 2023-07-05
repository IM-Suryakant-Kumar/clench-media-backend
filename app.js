require("express-async-errors");
require("dotenv").config();

const express = require("express");
const app = express();
// rest of the packages
const helmet = require("helmet")
const cors = require("cors")
const xss = require("xss-clean")
const rateLimiter = require("express-rate-limit")
const cookieParser = require("cookie-parser")

// database
const connectDB = require("./db")
// routers
// middleware
app.set("trust proxy", 1)
app.use(rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
}))
app.use(helmet())
app.use(cors())
app.use(xss())

app.use(express.json())
app.use(cookieParser())


const start = async () => {
	try {
        // await connectDB(process.env.MONGO_URI)
        app.listen(process.env.PORT, () => {
            console.log(`Server is listening on port ${process.env.PORT}...`);
        });
    } catch (error) {
        console.log(error)
    }
}

start()
