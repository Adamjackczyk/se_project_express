const User = require("../models/user");

// Controller to get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// Controller to get a user by ID
const getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    res.status(200).send(user);
  } catch (err) {
    res.status(400).send({ error: "Invalid user ID format" });
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
    res.status(400).send({ error: err.message });
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
};
