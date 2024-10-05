const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/user");
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  CONFLICT,
  UNAUTHORIZED,
} = require("../utils/errors");

// Controller to get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (err) {
    console.error(err);
    res
      .status(INTERNAL_SERVER_ERROR)
      .send({ message: "An error has occurred on the server." });
  }
};

// Controller to get a user by ID
const getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).orFail(
      new Error("User not found")
    );

    res.status(200).send(user);
  } catch (err) {
    console.error(err);
    if (err.message === "User not found") {
      res.status(NOT_FOUND).send({ message: "User not found" });
    } else if (err.name === "CastError") {
      res.status(BAD_REQUEST).send({ message: "Invalid user ID format" });
    } else {
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    }
  }
};

// Controller to create a new user
const createUser = async (req, res) => {
  try {
    const { name, avatar, email, password } = req.body;

    // Check if all required fields are provided
    if (!name || !avatar || !email || !password) {
      return res
        .status(BAD_REQUEST)
        .send({ message: "All fields are required" });
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
    res.status(201).send(userResponse);
  } catch (err) {
    console.error(err);

    // Handle duplicate email error (MongoDB error code 11000)
    if (err.code === 11000) {
      return res.status(CONFLICT).send({ message: "Email already exists" });
    }

    // Handle validation errors
    if (err.name === "ValidationError") {
      return res.status(BAD_REQUEST).send({ message: err.message });
    }

    // Handle other server errors
    res
      .status(INTERNAL_SERVER_ERROR)
      .send({ message: "An error has occurred on the server." });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input Validation: Check if email and password are provided
    if (!email || !password) {
      return res
        .status(BAD_REQUEST)
        .send({ message: "Email and password are required." });
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
      return res
        .status(UNAUTHORIZED)
        .send({ message: "Invalid email or password" });
    }

    // Handle other unexpected errors
    return res
      .status(INTERNAL_SERVER_ERROR)
      .send({ message: "An error has occurred on the server." });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    // Extract user ID from req.user, set by auth middleware
    const { _id } = req.user;

    // Find the user by ID and exclude the password field
    const user = await User.findById(_id).select("-password");

    if (!user) {
      return res.status(NOT_FOUND).send({ message: "User not found" });
    }

    // Send the user data as the response
    res.status(200).send(user);
  } catch (err) {
    console.error(err);
    res
      .status(INTERNAL_SERVER_ERROR)
      .send({ message: "An error has occurred on the server." });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, avatar } = req.body;

    // Only allow updating 'name' and 'avatar'
    const allowedUpdates = {};
    if (name) allowedUpdates.name = name;
    if (avatar) allowedUpdates.avatar = avatar;

    // Check if there are fields to update
    if (Object.keys(allowedUpdates).length === 0) {
      return res
        .status(BAD_REQUEST)
        .send({ message: "No valid fields provided for update." });
    }

    // Find the user by ID and update the allowed fields
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      allowedUpdates,
      { new: true, runValidators: true }
    ).select("-password"); // Exclude the password field

    if (!updatedUser) {
      return res.status(NOT_FOUND).send({ message: "User not found" });
    }

    res.status(200).send(updatedUser);
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError") {
      return res.status(BAD_REQUEST).send({ message: err.message });
    }
    res
      .status(INTERNAL_SERVER_ERROR)
      .send({ message: "An error has occurred on the server." });
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  login,
  getCurrentUser,
  updateUser,
};
