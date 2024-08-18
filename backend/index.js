const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const User = require('./models/User');
const Otp = require('./models/Otp');
const sendOtp = require('./utils/sendOtp');
const sendWelcomeEmail = require('./utils/sendWelcomeMail');

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

app.post('/insertCompanyInfo', async (req, res) => {
  try {
    const { registerEmailId, ...companyInfo } = req.body; // Extract the registerEmailId and the rest of the company info
    const filter = { registerEmailId }; // Define the filter to find an existing record

    // Check if a company with the same registerEmailId already exists
    let existingCompany = await db.collection("companyInfo").findOne(filter);

    if (existingCompany) {
      // If the company already exists, update the record
      const updateResult = await db.collection("companyInfo").updateOne(filter, { $set: companyInfo });

      if (updateResult.modifiedCount > 0) {
        res.status(200).send({ success: true, message: "Company information updated successfully." });
      } else {
        res.status(500).send({ success: false, message: "Failed to update company information." });
      }
    } else {
      // If the company does not exist, insert a new record
      let postResult = await db.collection("companyInfo").insertOne(req.body);

      if (postResult.acknowledged) {
        res.status(200).send({ success: true, message: "Company information saved successfully." });
      } else {
        res.status(500).send({ success: false, message: "Failed to save company information." });
      }
    }
  } catch (ex) {
    console.log("Error in insertCompanyInfo", ex);
    res.status(500).send({ success: false, message: "An error occurred while saving/updating company information." });
  }
});

app.post('/checkCompanyInfo', async (req, res) => {
  try {
    const { registerEmailId } = req.body;

    // Check if a company with the given email exists in the database
    const company = await db.collection("companyInfo").findOne({ registerEmailId });

    if (company) {
      // If company found, send success response
      res.send({ success: true, message: "Company found", company });
    } else {
      // If company not found, send not found response
      res.send({ success: false, message: "Company not found" });
    }
  } catch (error) {
    console.error("Error in checkCompanyInfo:", error);
    res.status(500).send({ success: false, message: "An error occurred while checking company information" });
  }
});
 

app.post('/insertUserInfo', async (req, res) => {
  try {
    const { email, password, ...userInfo } = req.body; // Extract email, password, and the rest of the user info
    const filter = { email }; // Define the filter to find an existing record

    // Check if a user with the same email already exists
    let existingUser = await db.collection("userInfo").findOne(filter);

    if (existingUser) {
      // If the user already exists, update the record
      const updateResult = await db.collection("userInfo").updateOne(filter, { $set: userInfo });

      if (updateResult.modifiedCount > 0) {
        res.status(200).send({ success: true, message: "User updated successfully." });
      } else {
        res.status(500).send({ success: false, message: "Failed to update user information." });
      }
    } else {
      // If the user does not exist, insert a new record
      let postResult = await db.collection("userInfo").insertOne(req.body);

      if (postResult.acknowledged) {
        res.status(200).send({ success: true, message: "User saved successfully." });
        // Send welcome email after successful insertion
        await sendWelcomeEmail(email, password);
      } else {
        res.status(500).send({ success: false, message: "Failed to save user information." });
      }
    }
  } catch (ex) {
    console.log("Error in insertUserInfo", ex);
    res.status(500).send({ success: false, message: "An error occurred while saving/updating user information." });
  }
});


app.post('/getCompanyUsers', async (req, res) => {
  try {
    const { registerEmailId } = req.body;
    // Find the company information based on the registerEmailId
    const company = await db.collection("userInfo").find({ approvalByID: registerEmailId }).toArray();
    if (company) {
      // If company found, send success response
      res.send(company);
    } else {
      // If company not found, send not found response
      res.send({ success: false, message: "Company not found" });
    }
  } catch (error) {
    console.error("Error in getCompanyUsers:", error);
    res.status(500).send({ success: false, message: "An error occurred while checking company information" });
  }
});




app.listen(Port, () => {
  console.log(`FlexCap Server is running on port ${Port}`);
});
