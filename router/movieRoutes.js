const express= require( 'express');
const multer = require("multer")
const path = require('path');

const { getMovies, getMovie, addMovie, deleteMovie, updateMovieById }= require( '../controllers/movieController.js');

const router = express.Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads'); // Specify the upload folder
    },
    filename: (req, file, cb) => {
      cb(null,`${file.fieldname}-${Date.now()+ path.extname(file.originalname)}`); // Filename with a unique timestamp
    }
  });
   
  const upload = multer({ storage: storage });

// Define routes for movies
router.get('/movies', getMovies);         // Get all movies
router.get('/movies/:id', getMovie);   
router.delete("/movies/:id", deleteMovie)   // Get movie by ID
router.post('/movies',upload.fields([
    { name: 'play_banner', maxCount: 1 },        // For poster image
    { name: 'video_thumbnail', maxCount: 1 },     // For thumbnail image
    { name: 'VideosUrl', maxCount: 1 }          // For video file
  ]),  addMovie);
  router.patch('/movies/:id',upload.fields([
    { name: 'play_banner', maxCount: 1 },        // For poster image
    { name: 'video_thumbnail', maxCount: 1 },     // For thumbnail image
    { name: 'VideosUrl', maxCount: 1 }          // For video file
  ]),  updateMovieById);  
  // Create a new movie

module.exports =  router;
