require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const { 
  getArtistFromSpotify, 
  getTopTracks, 
  getTopAlbums, 
  getArtistsByGenre 
} = require("./utils/spotifyApi");
const Artist = require("./models/Artist");
const Album = require("./models/Album"); // Album model in MongoDB

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/mymusicuniverse")
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const app = express();
app.use(cors());
app.use(express.json());

// Root Route
app.get("/", (req, res) => {
  res.send("My Music Universe API is running...");
});

// ---------------- Artist Routes ----------------

// Get all artists with topTracks & topAlbums (top 3 each)
app.get("/api/artists", async (req, res) => {
  try {
    const artists = await Artist.find({}, {
      name: 1,
      spotifyId: 1,
      imageUrl: 1,
      genres: 1,
      followers: 1,
      topTracks: { $slice: 3 }, // top 3 tracks
      topAlbums: { $slice: 3 }  // top 3 albums
    });
    res.json(artists);
  } catch (error) {
    console.error("Error fetching artists:", error);
    res.status(500).json({ error: "Error fetching artists" });
  }
});

// Get artist by Spotify ID
app.get("/api/artists/:id", async (req, res) => {
  try {
    const artist = await Artist.findOne({ spotifyId: req.params.id });
    if (!artist) return res.status(404).json({ error: "Artist not found" });
    res.json(artist);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Fetch jazz-related artists (any genre containing "jazz")
app.get("/api/spotify/genre/jazz", async (req, res) => {
  try {
    const jazzArtists = await Artist.find({ genres: { $regex: /jazz/i } });
    if (jazzArtists.length > 0) {
      return res.json(jazzArtists);
    }

    // If not in DB, fetch from Spotify
    const fetchedArtists = await getArtistsByGenre("jazz", 20);
    const enrichedArtists = await Promise.all(
      fetchedArtists.map(async (artist) => {
        const topTracks = await getTopTracks(artist.spotifyId);
        const topAlbums = await getTopAlbums(artist.spotifyId);
        return {
          ...artist,
          topTracks,
          topAlbums,
        };
      })
    );

    const bulkOps = enrichedArtists.map((artist) => ({
      updateOne: {
        filter: { spotifyId: artist.spotifyId },
        update: { $set: artist },
        upsert: true,
      },
    }));

    await Artist.bulkWrite(bulkOps);
    res.json(enrichedArtists);
  } catch (error) {
    console.error("Error fetching jazz artists:", error);
    res.status(500).json({ error: "Failed to fetch jazz artists" });
  }
});

// ---------------- Album Routes ----------------

// Get featured albums (limit optional)
app.get("/api/albums", async (req, res) => {
  const limit = parseInt(req.query.limit) || 6;
  try {
    const albums = await Album.find().sort({ release_date: -1 }).limit(limit);
    res.json(albums);
  } catch (error) {
    console.error("Error fetching albums:", error);
    res.status(500).json({ error: "Failed to fetch albums" });
  }
});

// Get album by ID
app.get("/api/albums/:id", async (req, res) => {
  try {
    const album = await Album.findOne({ spotifyId: req.params.id });
    if (!album) return res.status(404).json({ error: "Album not found" });
    res.json(album);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ---------------- Start Server ----------------
const PORT = process.env.PORT || 5051;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
