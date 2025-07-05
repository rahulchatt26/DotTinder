const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routers/auth");
const profileRouter = require("./routers/profile");

app.use("/", authRouter);
app.use("/", profileRouter);

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
