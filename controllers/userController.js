// controllers/userController.js

const { getAllUsers, createUser } = require('../models/userModel.js')   // Import functions from the model

// Controller to handle GET request to fetch all users
const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);  // Send users as a JSON response
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
};

// Controller to handle POST request to add a new user
const addUser = async (req, res) => {
  const { name, email } = req.body;
  try {
    const user = await createUser(name, email);
    res.status(201).json({ message: 'User created', user });
  } catch (err) {
    res.status(500).json({ message: 'Error creating user', error: err.message });
  }
};

module.exports = { getUsers, addUser };
