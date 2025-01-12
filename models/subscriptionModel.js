// const mysql = require('mysql2/promise'); // Use promise-based API


// // Create a MySQL connection
// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',  // Default MySQL username for XAMPP
//   password: '',  // Default password for XAMPP MySQL (empty if not set)
//   database: 'yuvaworld_db'  // Your database name
// });
// // Function to get all movies
// async function getAllSubscription() {
//     // Create a connection to the database
//     const connection = await mysql.createConnection({
//         host: 'localhost',
//         user: 'root',
//         password: '',
//         database: 'yuvaworld_db'
//     });

//     try {
//         // Execute the SELECT query to fetch all movies
//         const [rows] = await connection.execute('SELECT * FROM subscription');
        
//        return rows
//     } catch (err) {
//         console.error('Error fetching subcription:', err);
//     } finally {
//         // Close the connection
//         await connection.end();
//     }
// }

// async function deleteSubscription(subcriptionId) {
//   // Create a connection to the database
//   const query = 'DELETE FROM subscription WHERE id = ?';
//   const connection = await mysql.createConnection({
//       host: 'localhost',
//       user: 'root',
//       password: '',
//       database: 'yuvaworld_db'
//   });

//   try {
//       // Execute the SELECT query to fetch all movies
//       const [rows] = await connection.execute(query,[movieId]);
      
//      return rows
//   } catch (err) {
//       console.error('Error deleting subscription:', err);
//   } finally {
//       // Close the connection
//       await connection.end();
//   }
// }



// // Function to get a single movie by ID
// const getMovieById = (subcriptionId) => {
//   return new Promise((resolve, reject) => {
//     const query = 'SELECT * FROM subcription WHERE id = ?';
//     db.query(query, [subcriptionId], (err, results) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(results[0]); // Return the first result (since movie IDs are unique)
//       }
//     });
//   });
// };

// async function createMovie(subcriptionData) {
//   // Create a connection to the database
//   const connection = await mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'yuvaworld_db'
//   });
//   // Movie data to be inserted
//   const movieData = [
//     subcriptionData.name,
//     JSON.stringify(subcriptionData.features),
//     subcriptionData.price,
//     subcriptionData.validaty,
//   ];

//   console.log("Movie Data:", movieData); // Log the data to check the number of values

//   try {
//     // Execute the insert query
//     const [result] = await connection.execute(
//       'INSERT INTO movies (name, description, accessType, language, genres, castAndCrew, rating, releaseDate, publishDate, seoTitle, seoDescription, seoKeywords, thumbnail, poster, video, subtitle) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
//       movieData
//     );
//     await connection.end()
//     return result.insertId
//   } catch (err) {
//     console.log("error",err);
//     return err
//   } finally {
//     // Close the connection
//     await connection.end();
//   }
// }
// function capitalize(word) {
//   if (typeof word !== 'string' || word.length === 0) {
//       return word; // return the word as is if it's not a string or is empty
//   }
//   return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
// }





// // Export the functions
// module.exports = { getAllMovies, getMovieById, createMovie };
