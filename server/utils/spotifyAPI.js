const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const { getArtistFromSpotify, getTopTracks, getTopAlbums } = require("./utils/spotifyAPI");
const Artist = require("./models/Artist"); // Ensure this matches your artist model path

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Fetch and store artist in MongoDB
app.post("/api/artists", async (req, res) => {
  const { name } = req.body;

  try {
    let artistData = await getArtistFromSpotify(name);
    if (!artistData) return res.status(404).json({ error: "Artist not found" });

    // Check if artist already exists
    let existingArtist = await Artist.findOne({ spotifyId: artistData.spotifyId });
    if (!existingArtist) {
      const topTracks = await getTopTracks(artistData.spotifyId);
      const topAlbums = await getTopAlbums(artistData.spotifyId);

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
    console.error("Error fetching artist:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Start the server
const PORT = process.env.PORT || 5051;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
