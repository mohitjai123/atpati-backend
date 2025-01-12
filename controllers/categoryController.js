// controllers/userController.js
const multer = require("multer")
const path = require('path');
const fs  = require("fs")
const {db} = require("../connection.js")

const { Router } = require("express");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads'); // Specify the upload folder
    },
    filename: (req, file, cb) => {
      cb(null,`${file.fieldname}-${Date.now()+ path.extname(file.originalname)}`); // Filename with a unique timestamp
    }
  });
   
  const upload = multer({ storage: storage });
const categoryRoute = Router()


categoryRoute.post("/category", 
    upload.fields([
        { name: 'thumbnail', maxCount: 1 },        // For poster image
      ]),
    async (req, res) => {
        const {Title} = req.body
    try {
        if(!Title){
         return   res.status(400).json({message:"Title field required"})
        }
    const movieRef = await db.collection("categories").add({Title, thumbnail:req.files.thumbnail[0].filename})
    if(movieRef){
        return  res.status(200).json({message:"Category added sucussfully"})
    }
    } catch (error) {
        return  res.json({status:500, message:"server error"})
    }
})

categoryRoute.delete("/category/:id", async (req, res) => {
    const {id} = req.params
    try {

        if(!id){
         return res.status(400).json({message:"movie not found"})
        }
    const movieRef = await getMovieById(id)
    if(movieRef){
        const posterPath = path.join(__dirname, `../uploads/${movieRef.thumbnail}`);
        fs.unlink(posterPath, (err) => {
            if (err) {
                console.error('Error deleting file:', err);
                return res.status(500).json({ message: 'Failed to delete file', error: err });
            }
        });
        await deleteMovieById(id)
    }
    if(movieRef){
        return  res.status(200).json({message:"Category deleted sucussfully"})
    }
    } catch (error) {
        return  res.status(500).json({message:"Server error"})
    }
})

const deleteMovieById = async (movieId) => {
    try {
     const resp  =  await db.collection('categories').doc(movieId).delete();
      return resp
    } catch (error) {
      return 'Failed to delete movie.';
    }
  };

  const getMovieById = async (movieId) => {
    try {
      const doc = await db.collection('categories').doc(movieId).get();
      if (doc.exists) {
        return { id: doc.id, ...doc.data() }; // Return the movie data along with the document ID
      } else {
        console.log('No movie found with that ID');
        return null;
      }
    } catch (error) {
      console.error('Error fetching movie:', error);
    }
  };





module.exports = categoryRoute;
