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
};

const validateProfileData = (req) => {
  const user = req.body;
  const editableFields = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "about",
    "skills",
    "photoUrl",
  ];
  const isEditAllowed = Object.keys(user).every((field) =>
    editableFields.includes(field)
  );
  if (!isEditAllowed) {
    throw new Error("Invalid request...");
  }
  if (user.firstName && (user.firstName < 3 || user.firstName > 20)) {
    throw new Error("First Name should be in between 3 to 20 characters...");
  }
  if (user.lastName && (user.lastName < 3 || user.lastName > 20)) {
    throw new Error("Last Name should be in between 3 to 20 characters...");
  }
  if (user.age && user.age < 18) {
    throw new Error("Age should be greater than 18...");
  }
  if (user.about && user.about.length > 200) {
    throw new Error("About section should not exceed 200 characters...");
  }
};

const validateLoginData = (req) => {
  const isValidEmail = validator.isEmail(req.body.emailId);
  if (!isValidEmail) {
    throw new Error("Invalid Email Address...");
  }
};

const validateChangePassword = (req) => {
  const allowedField = "password";
  const isChangePasswordAllowed = Object.keys(req.body).every(
    (field) => field === allowedField
  );
  if (!isChangePasswordAllowed) {
    throw new Error("Invalid request...");
  }
  const isPasswordStrong = validator.isStrongPassword(req.body.password);
  if (!isPasswordStrong) {
    throw new Error("Please provide a strong password...");
  }
};

module.exports = {
  validateSignUpData,
  validateLoginData,
  validateProfileData,
  validateChangePassword,
};
