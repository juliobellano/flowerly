const express = require("express")
const path = require("path")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User") // Ensure this matches your models setup
const router = express.Router()

// Registration logic
router.post("/register", async (req, res) => {
     const { email, password } = req.body
     try {
          const existingUser = await User.findOne({ email })
          if (existingUser) {
               return res.status(400).json({ message: "User already exists" })
          }

          const hashedPassword = await bcrypt.hash(password, 10)
          const newUser = new User({ email, password: hashedPassword })
          await newUser.save()

          res.status(201).json({ message: "User registered successfully" })
     } catch (err) {
          res.status(500).json({ error: "Server error" })
     }
})

// Login logic
router.post("/login", async (req, res) => {
     const { email, password } = req.body
     try {
          const user = await User.findOne({ email }) // Fetch user by email
          if (!user) {
               return res.status(400).json({ message: "Invalid credentials" })
          }

          const isMatch = await bcrypt.compare(password, user.password) // Compare hashed passwords
          if (!isMatch) {
               return res.status(400).json({ message: "Invalid credentials" })
          }

          const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
               expiresIn: "1h",
          })
          res.cookie("token", token, { httpOnly: true }).json({
               message: "Login successful",
          })
     } catch (err) {
          res.status(500).json({ error: "Server error" })
     }
})

// Logout logic
router.get("/logout", (req, res) => {
     res.clearCookie("token").json({ message: "Logout successful" })
})

// test verify connectiin
router.get("/test-db", async (req, res) => {
     try {
          const users = await User.find() // Fetch all users from the 'users' collection
          res.status(200).json(users)
     } catch (err) {
          res.status(500).json({ error: "Database error" })
     }
})

module.exports = router
