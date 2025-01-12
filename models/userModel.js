// const mysql = require("mysql2")

// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root', // default MySQL user for XAMPP
//   password: '', // default password for XAMPP MySQL (if not set, leave it empty)
//   database: 'yuvaworld_db' // your database name
// });
// db.connect((err) => {
//   if (err) {
//     console.error('Error connecting to MySQL:', err);
//     return;
//   }
//   console.log('Connected to MySQL');
// });
// const getAllUsers = () => {
//   return new Promise((resolve, reject) => {
//     const query = 'SELECT * FROM users';
//     db.query(query, (err, results) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(results);
//       }
//     });
//   });
// };

// // Function to create a new user
// const createUser = (name, email) => {
//   return new Promise((resolve, reject) => {
//     const query = 'INSERT INTO users (name, email) VALUES (?, ?)';
//     db.query(query, [name, email], (err, result) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(result);
//       }
//     });
//   });
// };

// module.exports = { getAllUsers, createUser };
