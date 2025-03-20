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
          resave: true,
          saveUninitialized: true,
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

// middleware
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')))
app.use('/javascripts', express.static(path.join(__dirname, 'public/javascripts')))
app.use('/textures', express.static(path.join(__dirname, 'public/textures')))

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
     .catch((err) => console.log("connection failed"))

// Routes
const authRoutes = require("./routes/auth")
app.use('/auth', authRoutes)

const saveRouter = require('./routes/flowers.js');
app.use('/api/', saveRouter);


const authMiddleware = require("./middleware/authMiddleware")

// Route handlers
app.get("/", (req, res) => {
     res.sendFile(path.join(__dirname, "views", "home.html"))
})

app.get("/about", (req, res) => {
     res.render("about")
})

app.get("/create", (req, res) => {
     res.sendFile(path.join(__dirname, "views", "index.html"))
})

app.listen(port, () => {
     console.log(`App is running on http://localhost:${port}`)
})

