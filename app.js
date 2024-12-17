require("dotenv").config()
const express = require("express")
const bodyParser = require("body-parser")
const app = express()
const port = process.env.PORT
const path = require("path")
const passport = require("passport")
const session = require("express-session")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")

require("./passport/passport-config")

app.use(
     session({
          secret: process.env.JWT_SECRET,
          resave: false,
          saveUninitialized: false,
          cookie: {
               secure: process.env.NODE_ENV === "production", // Use secure cookies in production
               maxAge: 24 * 60 * 60 * 1000,
          },
     })
)

// Middleware setup - ordered
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static("public"))

// Passport middleware - after session middleware
app.use(passport.initialize())
app.use(passport.session())

// Template engine setup
app.set("view engine", "pug")
app.set("views", "./views")

// MongoDB connection
mongoose
     .connect(process.env.MONGO_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
     })
     .then(() => console.log("MongoDB Connected"))
     .catch((err) => console.error(err))

// Routes
const authRoutes = require("./routes/auth")
app.use("/auth", authRoutes) // This means all routes in authRoutes will be prefixed with /auth

const authMiddleware = require("./middleware/authMiddleware")

// Route handlers
app.get("/", (req, res) => {
     res.sendFile(path.join(__dirname, "views", "home.html"))
})

app.get("/about", (req, res) => {
     res.render("about")
})

app.get("/create", authMiddleware, (req, res) => {
     res.sendFile(path.join(__dirname, "views", "index.html"))
})

app.listen(port, () => {
     console.log(`App is running on http://localhost:${port}`)
})
