const validator = require("validator");
const mongoose = require("mongoose");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName) {
    throw new Error("First Name is required...");
  }
  if (firstName.length < 3 || firstName.length > 20) {
    throw new Error("First Name should be between 3 to 20 characters...");
  }
  if (!lastName) {
    throw new Error("Last Name is required...");
  }
  if (lastName.length < 3 || lastName.length > 20) {
    throw new Error("Last Name should be between 3 to 20 characters...");
  }
  const isValidEmail = validator.isEmail(emailId);
  if (!isValidEmail) {
    throw new Error("Invalid Email Address...");
  }
  const isStrongPassword = validator.isStrongPassword(password);
  if (!isStrongPassword) {
    throw new Error("Please enter a strong password...");
  }
  if (req.body.age < 18) {
    throw new Error("Age should be greater than or equal to 18...");
  }
};

const validateLoginData = (req) => {
  const isValidEmail = validator.isEmail(req.body.emailId);
  if (!isValidEmail) {
    throw new Error("Invalid Email Address...");
  }
};

module.exports = {
  validateSignUpData,
  validateLoginData,
};
