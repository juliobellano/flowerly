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
     .catch((err) => console.log("connection failed"))

// Routes
const authRoutes = require("./routes/auth")
app.use("/auth", authRoutes)

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

//julio database
//get specific data

const Product = require('./models/flower.models.js')

app.get('/api/products/:id', async (req, res) => {
     try {
          const { id } = req.params;
          const product = await Product.findById(id);
          res.status(200).json(product);

     }catch (error) { 
          res.status(500).json({message : error});
     }
})

//get data from mongo
app.get('/api/products', async (req, res) => {
     try {
          const product = await Product.find({});
          res.status(200).json(product);
     } catch (error) {
          res.status(500).json({message: error.message});
     }
});

//post data to mongo
app.post('/api/products', async (req, res) => {
     try {
          const product = await Product.create(req.body);
          res.status(200).json(product);
     } catch (error) {
          res.status(500).json({message: error.message});
     }
});

//try to update data

app.put('/api/products/:id', async (req, res ) => {
     try {
          const {id} = req.params;
          const product = await Product.findByIdAndUpdate(id, req.body); 
   
          if (!product) {
               return res.status(400).json({message : "Product is not found"});
          }
   
          const updatedProduct = await Product.findById(id);
          res.status(200).json(updatedProduct);
   
     } catch (error){
          res.status(200).json({message : error.message});
     }
     
});
