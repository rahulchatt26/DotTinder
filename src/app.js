const express = require("express");
const connectDB = require("./config/database");

const app = express();

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
