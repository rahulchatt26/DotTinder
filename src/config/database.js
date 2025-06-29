const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://rahulchatt:Rchatt%40123@namastenode.jsczy9g.mongodb.net/dotTinder"
  );
};

module.exports = connectDB;
