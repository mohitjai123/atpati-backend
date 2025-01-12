// routes/userRoutes.js

const  express = require("express");
const { getUsers, addUser } =require ('../controllers/.js');

const router = express.Router();
// Define routes and link them to controller functions
router.get('/users', getUsers);  // GET all users
router.post('/users', addUser);  // POST a new user

module.exports =  router;
