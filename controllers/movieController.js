const { getAllMovies, getMovieById, createMovie, deleteMovieById, updateMovie } = require('../models/movieModel.js');
const { uploadFile } = require('../utils/uploadMovie.js');
const fs = require("fs")
const path = require("path")
// Controller to handle GET request for all movies
const getMovies = async (req, res) => {
    try {
        const movies = await getAllMovies();
        res.status(200).json(movies);  // Send the list of movies as a JSON response
    } catch (err) {
        res.status(500).json({ message: 'Error fetching movies', error: err.message });
    }
};

// Controller to handle GET request for a single movie by ID
const getMovie = async (req, res) => {
    const movieId = req.params.id;
    try {
        const movie = await getMovieById(movieId);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.status(200).json(movie);  // Send the movie as a JSON response
    } catch (err) {
        res.status(500).json({ message: 'Error fetching movie', error: err.message });
    }
};

const deleteMovie = async (req, res) => {
    const movieId = req.params.id;
    console.log(movieId);
    
    try {
        const data = await getMovieById(movieId)
        console.log(data);
        const directoryArray = data.VideosUrl?.split("/")
        directoryArray.pop()
        const directoryName = directoryArray.join("/")
        const directoryPath = path.join(__dirname, `../${directoryName}`);
        const posterPath = path.join(__dirname, `../uploads/${data.play_banner}`);
        const thumbnailPath = path.join(__dirname, `../uploads/${data.video_thumbnail}`);
        fs.rm(directoryPath, { recursive: true, force: true }, (err) => {
            if (err) {
                console.error('Error deleting directory:', err);
                return res.status(500).json({ message: 'Failed to delete directory', error: err });
            }
        });
        fs.unlink(posterPath, (err) => {
            if (err) {
                console.error('Error deleting file:', err);
                return res.status(500).json({ message: 'Failed to delete file', error: err });
            }
        });
        fs.unlink(thumbnailPath, (err) => {
            if (err) {
                console.error('Error deleting file:', err);
                return res.status(500).json({ message: 'Failed to delete file', error: err });
            }
        });
        await deleteMovieById(movieId);
        return res.status(200).json({ message: "Movie deleted successfully" })
    } catch (err) {
        res.status(500).json({ message: 'Error fetching movie', error: err.message });
    }
};

// Controller to handle POST request to create a new movie
const addMovie = async (req, res) => {
    console.log(req.files);
    const movieData = req.body;
    try {
        const videoMaster = await uploadFile( req.wss, req?.files?.VideosUrl[0].path)
        const movieId = await createMovie({ ...movieData, play_banner: req.files.play_banner[0].filename, video_thumbnail: req.files.video_thumbnail[0].filename, VideosUrl: videoMaster });
        res.status(201).json({ message: 'Movie created', movieId });
    } catch (err) {
        res.status(500).json({ message: 'Error creating movie', error: err.message });
    }
};
const updateMovieById = async (req, res) => {
    const movieId = req.params.id; // Assuming the movie ID is passed as a URL parameter
    const movieData = req.body;

    try {
        // Find the existing movie details (assuming you have a `getMovieById` function)
        const existingMovie = await getMovieById(movieId);
        if (!existingMovie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        let updatedData = { ...movieData };

        if (req.files?.play_banner) {
            const posterPath = path.join(__dirname, `../uploads/${existingMovie.play_banner}`);
            fs.unlink(posterPath, (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                    return res.status(500).json({ message: 'Failed to delete file', error: err });
                }
            });

            updatedData.play_banner = req.files.play_banner[0].filename;
        } else {
            updatedData.play_banner = existingMovie.play_banner;
        }

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
        await updateMovie(movieId, updatedData);

        res.status(200).json({ message: 'Movie updated', movieId });
    } catch (err) {
        res.status(500).json({ message: 'Error updating movie', error: err.message });
    }
};

module.exports = { getMovies, getMovie, addMovie, deleteMovie, updateMovieById };
