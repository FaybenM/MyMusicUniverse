// server.js
require("dotenv").config(); // Load environment variables
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { getArtistFromSpotify, getTopTracks, getTopAlbums } = require("./utils/spotifyAPI"); // Import Spotify API helper
const Artist = require("./models/Artist"); // Import MongoDB model

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/mymusicuniverse", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

const app = express();
app.use(cors());
app.use(express.json());

// Root Route
app.get("/", (req, res) => {
  res.send("My Music Universe API is running...");
});

// Get all artists from MongoDB
app.get("/api/artists", async (req, res) => {
  try {
    const artists = await Artist.find();
    res.json(artists);
  } catch (error) {
    res.status(500).json({ error: "Error fetching artists" });
  }
});

// ✅ Updated Route: Fetch artist from Spotify and save top songs & albums
app.get("/api/spotify/artist/:name", async (req, res) => {
  const { name } = req.params;

  try {
    let artistData = await getArtistFromSpotify(name);
    if (!artistData) {
      return res.status(404).json({ error: "Artist not found" });
    }

    // Check if artist already exists in MongoDB
    let existingArtist = await Artist.findOne({ spotifyId: artistData.spotifyId });
    if (!existingArtist) {
      // Fetch top songs & albums from Spotify
      const topTracks = await getTopTracks(artistData.spotifyId);
      const topAlbums = await getTopAlbums(artistData.spotifyId);

      // Save artist data to MongoDB
      existingArtist = await Artist.create({
        spotifyId: artistData.spotifyId,
        name: artistData.name,
        genres: artistData.genres,
        imageUrl: artistData.imageUrl,
        followers: artistData.followers,
        topSongs: topTracks,
        topAlbums: topAlbums,
      });
    }

    res.json(existingArtist);
  } catch (error) {
    console.error("Error fetching artist from Spotify:", error);
    res.status(500).json({ error: "Error fetching artist data" });
  }
});

// ✅ New Route: Fetch a single artist from MongoDB
app.get("/api/artists/:id", async (req, res) => {
  try {
    const artist = await Artist.findOne({ spotifyId: req.params.id });
    if (!artist) return res.status(404).json({ error: "Artist not found" });

    res.json(artist);
  } catch (error) {
    console.error("Error fetching artist:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start Server
const PORT = process.env.PORT || 5051;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
