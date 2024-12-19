const express = require("express")
const path = require("path")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const router = express.Router()
const passport = require("passport")

// Serve login.html
router.get("/login", (req, res) => {
     res.sendFile(path.join(__dirname, "../views/login.html"))
})

// Serve register.html
router.get("/register", (req, res) => {
     res.sendFile(path.join(__dirname, "../views/register.html"))
})

// Redirect to Google login
router.get(
     "/google",
     passport.authenticate("google", {
          scope: ["profile", "email"],
          prompt: "select_account",
     })
)

// Google callback
router.get(
     '/google/callback',
     passport.authenticate('google', {
          failureRedirect: '/auth/failure',
          successRedirect: '/create',
          failureFlash: true,
     })
)

router.get ('/auth/failure', (req, res) => {
     res.send('authentication went wrong..');
});

// Logout route
router.get("/logout", (req, res, next) => {
     req.logout((err) => {
          if (err) return next(err)
          res.clearCookie("token")
          res.redirect("/")
     })
})

// Registration logic
router.post("/register", async (req, res) => {
     const { name, email, password } = req.body
     try {
          const existingUser = await User.findOne({ email })
          if (existingUser) {
               return res.status(400).json({ message: "User already exists" })
          }

          const hashedPassword = await bcrypt.hash(password, 10)
          const newUser = new User({ name, email, password: hashedPassword })
          await newUser.save()

          res.status(201).json({ message: "User registered successfully" })
     } catch (err) {
          res.status(500).json({ error: "Server error" })
     }
})

// Login logic
router.post("/login", async (req, res) => {
     const { email, password } = req.body;
     try {
         // Find user by email
         const user = await User.findOne({ email });
         if (!user) {
             return res.status(400).json({ message: "Invalid credentials" });
         }
 
         // Check password
         const isMatch = await bcrypt.compare(password, user.password);
         if (!isMatch) {
             return res.status(400).json({ message: "Invalid credentials" });
         }
 
         // Store user data in session
         req.session.user = {
             id: user._id,
             name: user.name,
             email: user.email,
         };
 
         // Redirect to /create
         res.redirect("/create");
     } catch (err) {
         console.error(err);
         res.status(500).json({ error: "Server error" });
     }
 });
 

module.exports = router
