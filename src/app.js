const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.post("/signup", async (req, res) => {
  try {
    const ourFirstUser = new User({
      firstName: "Tiasha",
      lastName: "Banerjee",
      emailId: "tiasha@gmail.com",
      password: "Tiasha@123",
    });
    await ourFirstUser.save();

    res.status(201).send("User created successfully");
  } catch (err) {
    return res.status(400).json({ ERROR: err.message });
  }
});

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(2604, () => {
      console.log("Server is listenting on port 2604");
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });
