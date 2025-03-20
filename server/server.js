require("dotenv").config(); // Load environment variables
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { getArtistFromSpotify, getTopTracks, getTopAlbums } = require("./utils/spotifyApi"); // Fix path to relative path
const Artist = require("./models/Artist"); // Import MongoDB model

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/mymusicuniverse")
  .then(() => {
    console.log("✅ Connected to MongoDB");
    // Check if artists exist in the database
    Artist.countDocuments()
      .then(count => console.log(`📊 Artists in database: ${count}`))
      .catch(err => console.error("❌ Error counting artists:", err));
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));


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

// ✅ New Route: Fetch jazz artists from Spotify
app.get("/api/spotify/jazz-artists", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const jazzArtists = await getArtistsByGenre("jazz", limit);

    if (!jazzArtists.length) {
      return res.status(404).json({ error: "No jazz artists found" });
    }

    res.json({
      message: `Found ${jazzArtists.length} jazz artists`,
      artists: jazzArtists
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});


// Start Server
const PORT = process.env.PORT || 5051;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
