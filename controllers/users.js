// controllers/users.js

const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/user");
const {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalServerError,
} = require("../utils/errors");

/**
 * Controller to create a new user
 */
const createUser = async (req, res, next) => {
  try {
    const { name, avatar, email, password } = req.body;

    // Check if all required fields are provided
    if (!name || !avatar || !email || !password) {
      return next(new BadRequestError("All fields are required"));
    }

    // Create a new user instance; password will be hashed by pre-save hook
    const user = new User({
      name,
      avatar,
      email,
      password,
    });

    // Save the user to the database
    await user.save();

    // Exclude password from the response
    const userResponse = user.toObject();
    delete userResponse.password;

    // Send the created user as response
    return res.status(201).send(userResponse);
  } catch (err) {
    console.error(err);

    // Handle duplicate email error (MongoDB error code 11000)
    if (err.code === 11000) {
      return next(new ConflictError("Email already exists"));
    }

    // Handle validation errors
    if (err.name === "ValidationError") {
      return next(new BadRequestError(err.message));
    }

    // Pass any other errors to the centralized error handler
    next(new InternalServerError());
  }
};

/**
 * Controller to handle user login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Input Validation: Check if email and password are provided
    if (!email || !password) {
      return next(new BadRequestError("Email and password are required."));
    }

    // Authenticate the user
    const user = await User.findUserByCredentials(email, password);

    // Generate a JWT token
    const token = jwt.sign(
      { _id: user._id },
      JWT_SECRET,
      { expiresIn: "7d" } // Token valid for 7 days
    );

    // Respond with the token
    return res.status(200).send({ token });
  } catch (err) {
    console.error("Error during signin:", err);

    // Handle authentication errors
    if (err.message === "Incorrect email or password") {
      return next(new UnauthorizedError("Invalid email or password"));
    }

    // Pass any other errors to the centralized error handler
    next(new InternalServerError());
  }
};

/**
 * Controller to get the current user's profile
 */
const getCurrentUser = async (req, res, next) => {
  try {
    // Extract user ID from req.user, set by auth middleware
    const { _id } = req.user;

    // Find the user by ID and exclude the password field
    const user = await User.findById(_id).select("-password");

    if (!user) {
      return next(new NotFoundError("User not found"));
    }

    // Send the user data as the response
    return res.status(200).send(user);
  } catch (err) {
    console.error(err);
    next(new InternalServerError()); // Pass a 500 error to the centralized handler
  }
};

/**
 * Controller to update the current user's profile
 */
const updateUser = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;

    // Only allow updating 'name' and 'avatar'
    const allowedUpdates = {};
    if (name) allowedUpdates.name = name;
    if (avatar) allowedUpdates.avatar = avatar;

    // Check if there are fields to update
    if (Object.keys(allowedUpdates).length === 0) {
      return next(new BadRequestError("No valid fields provided for update."));
    }

    // Find the user by ID and update the allowed fields
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      allowedUpdates,
      { new: true, runValidators: true }
    ).select("-password"); // Exclude the password field

    if (!updatedUser) {
      return next(new NotFoundError("User not found"));
    }

    return res.status(200).send(updatedUser);
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError") {
      return next(new BadRequestError(err.message));
    }
    next(new InternalServerError()); // Pass a 500 error to the centralized error handler
  }
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateUser,
};
