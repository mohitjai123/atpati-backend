
var admin = require("firebase-admin");

var serviceAccount = require("../new_service_file.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore()


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

const getAllWebseries = async () => {
  try {
    const snapshot = await db.collection('webseries').get();
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

const updateWebseries = async (movieId, updatedData) => {
  try {
    await db.collection('webseries').doc(movieId).update(updatedData);
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

async function createWebseries(moviesData) {
  // Create a connection to the database
  try {
    // Execute the insert query
    const movieDoc = {
      ...moviesData,
      status:false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    const movieRef = await db.collection("webseries").add(movieDoc)
    console.log(movieRef);
    return movieRef
  } catch (err) {
    console.log("error",err);
    return err
  }
}

const getMovieById = async (movieId) => {
  try {
    const doc = await db.collection('webseries').doc(movieId).get();
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
   const resp  =  await db.collection('webseries').doc(movieId).delete();
    return resp
  } catch (error) {
    return 'Failed to delete movie.';
  }
};
// Export the functions
module.exports = { 
  getAllWebseries, 
  updateWebseries,
  getMovieById,
  deleteMovieById,
  createWebseries };
