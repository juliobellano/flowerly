const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

// Register User
exports.registerUser = async (req, res) => {
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
}

// Login User
exports.loginUser = async (req, res) => {
     const { email, password } = req.body
     try {
          const user = await User.findOne({ email })
          if (!user) {
               return res.status(400).json({ message: "Invalid credentials" })
          }

          const isMatch = await bcrypt.compare(password, user.password)
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
}

// Logout User
exports.logoutUser = (req, res) => {
     res.clearCookie("token").json({ message: "Logout successful" })
}
