const User = require("../models/user");
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
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
    const { name, avatar } = req.body;

    const user = new User({ name, avatar });
    await user.save();

    res.status(201).send(user);
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError") {
      res.status(BAD_REQUEST).send({ message: "Invalid data" });
    } else {
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    }
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
};
