const express = require("express")
const bodyParser = require("body-parser")
const app = express()
const port = 3000
const path = require("path")

//  tambahan mongo + cookie
require("dotenv").config()
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")

app.set("view engine", "pug") // pug as a template engine
app.set("views", "./views")

app.use(express.urlencoded({ extended: true }))
app.use(express.static("public")) // view static

// sabar yak bingung
app.use(bodyParser.json())
app.use(cookieParser())

mongoose
     .connect(process.env.MONGO_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
     })
     .then(() => console.log("MongoDB Connected"))
     .catch((err) => console.error(err))

const authRoutes = require("./routes/auth")
app.use("/auth", authRoutes)

const authMiddleware = require("./middleware/authMiddleware")

app.get("/create", authMiddleware, (req, res) => {
     res.sendFile(path.join(__dirname, "views", "index.html"))
})

// pisahin dlu yak

app.get("/create", (req, res) => {
     res.sendFile(path.join(__dirname, "views", "index.html"))
})
app.get("/login", (req, res) => {
     res.sendFile(path.join(__dirname, "views", "login.html"))
})
app.get("/register", (req, res) => {
     res.sendFile(path.join(__dirname, "views", "register.html"))
})
app.get("/about", (req, res) => {
     res.render("about")
})
app.get("/", (req, res) => {
     res.sendFile(path.join(__dirname, "views", "home.html"))
})

app.listen(port, () => {
     console.log(`App is running on http://localhost:${port}`)
})
