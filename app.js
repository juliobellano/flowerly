const express = require('express');
const bodyParser = require('body-parser'); 
const app = express();
const port = 3000;
const path = require('path');
const mongoose = require("mongoose"); //add mongoose package

//connect to mongodb
mongoose.connect("mongodb+srv://admin:mcKb48Wfg7s1XCHN@flowerly.p0ess.mongodb.net/?retryWrites=true&w=majority&appName=flowerly")
.then(()=> {
     console.log("Connected to database!");
})
.catch(() => {
     console.log("Connection Failed");
     
})

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
