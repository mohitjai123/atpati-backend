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


const updateMovie = async (movieId,seasonId,episodeId, updatedData) => {
  try {
    await db.collection('videos').doc(movieId).collection("seasons").doc(seasonId).collection("episodes").doc(episodeId).update(updatedData);
  } catch (error) {
    console.error('Error updating user:', error);
    alert('Failed to update user.');
  }
};

async function createMovie(movieId,seasonId,moviesData) {
  // Create a connection to the database
  console.log(movieId);
  
    try {
        // Reference the "trailers" subcollection of the specific movie
        const trailersRef = db.collection("videos").doc(movieId).collection("seasons").doc(seasonId).collection("episodes");
        const trailerDoc = await trailersRef.add({...moviesData, createdAt:new Date()});
        console.log("Trailer added with ID:", trailerDoc.id);
        return trailerDoc.id; // Return the newly added document ID
      } catch (error) {
        console.error("Error adding trailer:", error);
        throw error;
      }
}

const getMovieById = async (movieId,seasonId,episodeId) => {
  try {
    const doc = await db.collection('videos').doc(movieId).collection("seasons").doc(seasonId).collection("episodes").doc(episodeId).get();
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

const deleteMovieById = async (movieId,seasonId, episodeId) => {
  try {
   const resp  =  await db.collection('videos').doc(movieId).collection("seasons").doc(seasonId).collection("episodes").doc(episodeId).delete();
    return resp
  } catch (error) {
    return 'Failed to delete movie.';
  }
};



// Export the functions
module.exports = {
  updateMovie,
  getMovieById,
  deleteMovieById,
  createMovie };
