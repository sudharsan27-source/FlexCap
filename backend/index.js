const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const path = require('path')
const User = require('./models/User');
const Otp = require('./models/Otp');
const sendOtp = require('./utils/sendOtp');
const sendWelcomeEmail = require('./utils/sendWelcomeMail');

require('dotenv').config();

const app = express();
const Port = process.env.PORT ;
const dbURL = process.env.DB_URL;

// mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('debug', true);
mongoose.connect(dbURL, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
  ssl: true,
  tlsInsecure: true // For testing only; not recommended for production
});


const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Middleware
const corsOptions = {
  // origin: 'https://flexcap.netlify.app', // replace with your frontend URL
  origin: "http://localhost:5173",
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',

};

app.use(cors(corsOptions));

app.use(bodyParser.json());

//------------------------Deployment-------------------------------
// const __dirname1 = path.resolve();
// app.use(express.static(path.join(__dirname1, '/frontend/build')));
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname1, '/frontend/build', 'index.html'));
// });

//------------------------Deployment-------------------------------


app.listen(Port, () => {
  console.log(`FlexCap Server is running on port ${Port}`);
});

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
    const { firstName, lastName, email, otp, password } = req.body;

    // Check if OTP is valid
    const validOtp = await Otp.findOne({ email, otp });
    if (!validOtp) {
      return res.status(400).send("Invalid or expired OTP");
    }

    // Create new user
    const newUser = new User({ firstName, lastName, email, password, isAdmin: true });
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
    // Check in the User collection
    let user = await User.findOne({ email: email });

    // If not found in User collection, check in userInfo collection
    if (!user) {
      user = await db.collection('userInfo').findOne({ email: email });

      // If still not found, return user not found
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
    }

    // Check if the password matches
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // If both email and password match, send the user data with status 200
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error });
  }
});


app.post('/insertCompanyInfo', async (req, res) => {
  try {
    const { createdBy, ...companyInfo } = req.body; // Extract the registerEmailId and the rest of the company info
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


app.post('/getTeamDetails', async (req, res) => {
  try {
    const { registerEmailId } = req.body;

    // Find the company using the registerEmailId
    const company = await db.collection("companyInfo").findOne({ registerEmailId });

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    console.log("company", company);

    // Extract the company name from the companyInfo
    const { companyName } = company;

    // Initialize the result object
    const result = {
      companyName,
      teamLead: [],
      teamMember: []
    };

    // Fetch users associated with the company
    const users = await db.collection("userInfo").find({ companyName }).toArray();

    // Classify users into teamLead and teamMember
    users.forEach(user => {
      if (user.team === 'Team Lead') {
        result.teamLead.push(`${user.firstName} ${user.lastName}`);
      } else if (user.team === 'Development') {
        result.teamMember.push(`${user.firstName} ${user.lastName}`);
      }
    });

    // Send the result back to the client
    console.log("resulr", result)
    res.json(result);

  } catch (error) {
    console.error('Error fetching company details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/insertProjectInfo', async (req, res) => {
  try {
    // Insert a new record
    let postResult = await db.collection("projectInfo").insertOne(req.body);
    
    if (postResult.acknowledged) {
      res.status(200).send({ success: true, message: "Project information saved successfully." });
    } else {
      res.status(500).send({ success: false, message: "Failed to save project information." });
    }
  } catch (ex) {
    console.log("Error in insertProjectInfo", ex);
    res.status(500).send({ success: false, message: "An error occurred while saving project information." });
  }
});

// API endpoint to find email in teamLead or teamMember arrays
app.post('/getProjectInfo', async (req, res) => {
  
  try {
    const { email } = req.body;
    const project = await db.collection('projectInfo').find({
      $or: [
        { teamLead: email },
        { teamMember: email },
        { createdBy: email }
      ]
    }).toArray();
    
      if (project) {
          // If email is found in either array, return the project details
          return res.status(200).json({
              success: true,
              project: project
          });
      } else {
          // If email is not found
          return res.status(404).json({
              success: false,
              message: 'Email not found in any project'
          });
      }
  } catch (error) {
      // Handle error
      console.error('Error finding email:', error);
      return res.status(500).json({
          success: false,
          message: 'Server error'
      });
  }
});





