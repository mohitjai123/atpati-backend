const express= require( 'express');
const multer = require("multer")
const path = require('path');

const {addMovie, deleteMovie, updateMovieById }= require( '../controllers/trallerController.js');

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
      // Get all movies
router.delete("/trailers/:movieId/:trailerId", deleteMovie)   // Get movie by ID
router.post('/trailers/:movieId',upload.fields([
    { name: 'video_thumbnail', maxCount: 1 },     // For thumbnail image
    { name: 'VideosUrl', maxCount: 1 }          // For video file
  ]),  addMovie);
  router.patch('/trailers/:movieId/:trailerId',upload.fields([
    { name: 'video_thumbnail', maxCount: 1 },     // For thumbnail image
    { name: 'VideosUrl', maxCount: 1 }          // For video file
  ]),  updateMovieById);  
  // Create a new movie

module.exports =  router;
