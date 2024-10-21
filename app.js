const express = require("express")
const bodyParser = require("body-parser")
const app = express()
const PORT = 3000

app.set("view engine", "pug") // pug as a template engine
app.set("views", "./views")

app.use(express.urlencoded({ extended: true }))
app.use(express.static("public")) // view static

app.get("/", (req, res) => {
  res.render("index", { title: "JJB TEAM" })
})

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`)
})
