const { getMovieById, createMovie, deleteMovieById, updateMovie } = require('../models/episodeModel.js');
const { uploadFile } = require('../utils/uploadMovie.js');
const fs = require("fs")
const path = require("path")

const deleteMovie = async (req, res) => {
    const {movieId, seasonId, episodeId} = req.params;
    try {
        const data = await getMovieById(movieId, seasonId, episodeId)
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
        await deleteMovieById(movieId, seasonId,episodeId);
        return res.status(200).json({ message: "Movie deleted successfully" })
    } catch (err) {
        res.status(500).json({ message: 'Error fetching movie', error: err.message });
    }
};

// Controller to handle POST request to create a new movie
const addMovie = async (req, res) => {
    const {movieId, seasonId} = req.params
    const movieData = req.body;
    try {
        const videoMaster = await uploadFile( req.wss, req?.files?.VideosUrl[0].path)
        const movieI = await createMovie(movieId,seasonId, {duration:movieData.duration, Title:movieData.Title, description:movieData.description ,video_thumbnail: req.files.video_thumbnail[0].filename, VideosUrl: videoMaster });
        res.status(201).json({ message: 'Movie created', movieI });
    } catch (err) {
        res.status(500).json({ message: 'Error creating movie', error: err.message });
    }
};
const updateMovieById = async (req, res) => {
    const {movieId,seasonId, episodeId} = req.params; // Assuming the movie ID is passed as a URL parameter
    const movieData = req.body;

    try {
        // Find the existing movie details (assuming you have a `getMovieById` function)
        const existingMovie = await getMovieById(movieId,seasonId,episodeId);
        if (!existingMovie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        let updatedData = { Title: movieData.Title, duration:movieData.duration,description:movieData.description };
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
        await updateMovie(movieId,seasonId,episodeId, updatedData);

        res.status(200).json({ message: 'Movie updated', movieId });
    } catch (err) {
        res.status(500).json({ message: 'Error updating movie', error: err.message });
    }
};

module.exports = { addMovie, deleteMovie, updateMovieById };
