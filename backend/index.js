// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const Port = process.env.PORT || 3000;

const dbURL =
  "mongodb+srv://lokeshec23:lokesh@cluster0.m6pct2e.mongodb.net/FlexCap";

mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.post("/insertUserDetails", async (req, res) => {
  try {
    let data = req.body;
    console.log("data", data);
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(
      now.getHours()
    ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(
      now.getSeconds()
    ).padStart(2, "0")}`;
    let finalData = { ...data, createdAt: formattedDate };
    // Here you can save data to the database
    let result = db.collection("userDetails").insertOne(finalData);
    res.status(200).send("User details inserted successfully");
  } catch (ex) {
    console.log("Error in insertUserDetails", ex);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(Port, () => {
  console.log(`FlexCap Server is running on port ${Port}`);
});
