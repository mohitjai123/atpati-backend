const mysql = require('mysql2/promise'); // Use promise-based API
const {db}  = require("../connection.js")


// Create a MySQL connection

// Function to get all movies
// async function getAllMovies() {
    
// }

// async function deleteMovieDb(movieId) {
//   // Create a connection to the database
  
//   try {
//       // Execute the SELECT query to fetch all movies
//       const [rows] = await connection.execute(query,[movieId]);
      
//      return rows
//   } catch (err) {
//       console.error('Error fetching movies:', err);
//   } finally {
//       // Close the connection
//       await connection.end();
//   }
// }

const getAllMovies = async () => {
  try {
    const snapshot = await db.collection('movies').get();
    const movies = snapshot.docs.map((doc) => ({
      id: doc.id, // Add the document ID for updates and deletions
      ...doc.data(),
    }));
    return movies;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

const updateMovie = async (movieId, updatedData) => {
  try {
    await db.collection('videos').doc(movieId).update(updatedData);
  } catch (error) {
    console.error('Error updating user:', error);
    alert('Failed to update user.');
  }
};


// // Function to get a single movie by ID
// const getMovieById = (movieId) => {
//   return new Promise((resolve, reject) => {
//     const query = 'SELECT * FROM movies WHERE id = ?';
//     db.query(query, [movieId], (err, results) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(results[0]); // Return the first result (since movie IDs are unique)
//       }
//     });
//   });
// };

async function createMovie(moviesData) {
  // Create a connection to the database
  try {
    // Execute the insert query
    const movieDoc = {
      ...moviesData,
      status:false,
      createdAt: new Date(),
    };
    const movieRef = await db.collection("videos").add(movieDoc)
    console.log(movieRef);
    return movieRef
  } catch (err) {
    console.log("error",err);
    return err
  }
}

const getMovieById = async (movieId) => {
  try {
    const doc = await db.collection('videos').doc(movieId).get();
    if (doc.exists) {
      return { id: doc.id, ...doc.data() }; // Return the movie data along with the document ID
    } else {
      console.log('No movie found with that ID');
      return null;
    }
  } catch (error) {
    console.error('Error fetching movie:', error);
    throw error;
  }
};

const deleteMovieById = async (movieId) => {
  try {
   const resp  =  await db.collection('videos').doc(movieId).delete();
    return resp
  } catch (error) {
    return 'Failed to delete movie.';
  }
};


function capitalize(word) {
  if (typeof word !== 'string' || word.length === 0) {
      return word; // return the word as is if it's not a string or is empty
  }
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}





// Export the functions
module.exports = { 
  getAllMovies, 
  updateMovie,
  getMovieById,
  deleteMovieById,
  createMovie };
