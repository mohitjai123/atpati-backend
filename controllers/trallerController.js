const { getMovieById, createMovie, deleteMovieById, updateMovie } = require('../models/trallerModel.js');
const { uploadFile } = require('../utils/uploadMovie.js');
const fs = require("fs")
const path = require("path")

const deleteMovie = async (req, res) => {
    const {movieId, trailerId} = req.params;
    try {
        const data = await getMovieById(movieId, trailerId)
        console.log(data);
        const directoryArray = data.VideosUrl?.split("/")
        directoryArray.pop()
        const directoryName = directoryArray.join("/")
        const directoryPath = path.join(__dirname, `../${directoryName}`);
        const thumbnailPath = path.join(__dirname, `../uploads/${data.video_thumbnail}`);
        fs.rm(directoryPath, { recursive: true, force: true }, (err) => {
            if (err) {
                console.error('Error deleting directory:', err);
                return res.status(500).json({ message: 'Failed to delete directory', error: err });
            }
        });
        fs.unlink(thumbnailPath, (err) => {
            if (err) {
                console.error('Error deleting file:', err);
                return res.status(500).json({ message: 'Failed to delete file', error: err });
            }
        });
        await deleteMovieById(movieId, trailerId);
        return res.status(200).json({ message: "Movie deleted successfully" })
    } catch (err) {
        res.status(500).json({ message: 'Error fetching movie', error: err.message });
    }
};

// Controller to handle POST request to create a new movie
const addMovie = async (req, res) => {
    const {movieId} = req.params
    const movieData = req.body;
    try {
        const videoMaster = await uploadFile( req.wss, req?.files?.VideosUrl[0].path)
        const movieI = await createMovie(movieId, { Title:movieData.Title, video_thumbnail: req.files.video_thumbnail[0].filename, VideosUrl: videoMaster });
        res.status(201).json({ message: 'Movie created', movieI });
    } catch (err) {
        res.status(500).json({ message: 'Error creating movie', error: err.message });
    }
};
const updateMovieById = async (req, res) => {
    const {movieId,trailerId} = req.params; // Assuming the movie ID is passed as a URL parameter
    const movieData = req.body;

    try {
        // Find the existing movie details (assuming you have a `getMovieById` function)
        const existingMovie = await getMovieById(movieId,trailerId);
        if (!existingMovie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        let updatedData = { Title: movieData.Title };
        if (req.files?.video_thumbnail) {
            const thumbnailPath = path.join(__dirname, `../uploads/${existingMovie.video_thumbnail}`);
            fs.unlink(thumbnailPath, (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                    return res.status(500).json({ message: 'Failed to delete file', error: err });
                }
            });
            updatedData.video_thumbnail = req.files.video_thumbnail[0].filename;
        } else {
            updatedData.video_thumbnail = existingMovie.video_thumbnail;
        }

        if (req.files?.VideosUrl) {
            const directoryArray = existingMovie.VideosUrl?.split("/")
            directoryArray.pop()
            const directoryName = directoryArray.join("/")
            const directoryPath = path.join(__dirname, `../${directoryName}`);
            fs.rm(directoryPath, { recursive: true, force: true }, (err) => {
                if (err) {
                    console.error('Error deleting directory:', err);
                    return res.status(500).json({ message: 'Failed to delete directory', error: err });
                }
            });
            const videoMaster = await uploadFile(req.wss, req.files.VideosUrl[0].path);
            updatedData.VideosUrl = videoMaster;
        } else {
            updatedData.VideosUrl = existingMovie.VideosUrl;
        }

        // Update the movie in the database (assuming you have an `updateMovieById` function)
        await updateMovie(movieId,trailerId, updatedData);

        res.status(200).json({ message: 'Movie updated', movieId });
    } catch (err) {
        res.status(500).json({ message: 'Error updating movie', error: err.message });
    }
};

module.exports = { addMovie, deleteMovie, updateMovieById };
