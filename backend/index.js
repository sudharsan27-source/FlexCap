const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const User = require('./models/User');
const Otp = require('./models/Otp');
const sendOtp = require('./utils/sendOtp');

const app = express();
const Port = process.env.PORT || 3000;

const dbURL = "mongodb+srv://lokeshec23:lokesh@cluster0.m6pct2e.mongodb.net/FlexCap";

mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Register User and Send OTP
app.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("Email already exists");
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP to database
    const newOtp = new Otp({ email, otp });
    await newOtp.save();

    // Send OTP to user's email
    await sendOtp(email, otp);

    res.status(200).send("OTP sent to your email");
  } catch (error) {
    console.error("Error in register:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Verify OTP and Create User
app.post("/verifyOtp", async (req, res) => {
  try {
    const {firstName, lastName,email, otp, password } = req.body;

    // Check if OTP is valid
    const validOtp = await Otp.findOne({ email, otp });
    if (!validOtp) {
      return res.status(400).send("Invalid or expired OTP");
    }

    // Create new user
    const newUser = new User({firstName, lastName, email, password, isAdmin: true});
    await newUser.save();

    // Delete the OTP as it is no longer needed
    await Otp.deleteOne({ email, otp });

    res.status(200).send("User registered successfully");
  } catch (error) {
    console.error("Error in verifyOtp:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
      const user = await User.findOne({ email: email });

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      if (user.password !== password) {
          return res.status(401).json({ message: 'Invalid password' });
      }
      res.status(200).json( user );
  } catch (error) {
      res.status(500).json({ message: 'An error occurred', error });
  }
});

app.listen(Port, () => {
  console.log(`FlexCap Server is running on port ${Port}`);
});
