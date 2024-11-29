const express = require("express")
const bodyParser = require("body-parser")
const app = express()
const port = 3000
const path = require("path")

app.set("view engine", "pug") // pug as a template engine
app.set("views", "./views")

app.use(express.urlencoded({ extended: true }))
app.use(express.static("public")) // view static

app.get("/", (req, res) => {
     res.sendFile(path.join(__dirname, "views", "index.html"))
})
app.get("/about", (req, res) => {
     res.render("about")
})
app.get("/home", (req, res) => {
     res.sendFile(path.join(__dirname, "views", "home.html"))
})

app.listen(port, () => {
     console.log(`App is running on http://localhost:${port}`)
})
