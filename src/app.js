const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routers/auth");
const profileRouter = require("./routers/profile");
const connectionRequestRouter = require("./routers/connectionRequest");
const userRouter = require("./routers/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", connectionRequestRouter);
app.use("/", userRouter);

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
