require("dotenv").config(); // Load environment variables
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const { getArtistFromSpotify, getTopTracks, getTopAlbums, getArtistsByGenre } = require("./utils/spotifyApi"); // Fix path to relative path
const Artist = require("./models/Artist"); // Import MongoDB model

// ✅ 1️⃣ Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/mymusicuniverse")
  .then(() => {
    console.log("✅ Connected to MongoDB");
    Artist.countDocuments()
      .then((count) => console.log(`📊 Artists in database: ${count}`))
      .catch((err) => console.error("❌ Error counting artists:", err));
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ 2️⃣ Initialize Express App & Middleware
const app = express();
app.use(cors());
app.use(express.json());

// ✅ 3️⃣ Root Route
app.get("/", (req, res) => {
  res.send("My Music Universe API is running...");
});

// ✅ 4️⃣ MongoDB Artist Routes
app.get("/api/artists", async (req, res) => {
  try {
    const artists = await Artist.find();
    res.json(artists);
  } catch (error) {
    res.status(500).json({ error: "Error fetching artists" });
  }
});

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

// ✅ 5️⃣ Spotify API Routes

// Fetch artist from Spotify, save top songs & albums
app.get("/api/spotify/artist/:name", async (req, res) => {
  const { name } = req.params;

  try {
    let artistData = await getArtistFromSpotify(name);
    if (!artistData) {
      return res.status(404).json({ error: "Artist not found" });
    }

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
    console.error("Error fetching artist from Spotify:", error);
    res.status(500).json({ error: "Error fetching artist data" });
  }
});

// Fetch jazz artists from Spotify
app.get("/api/spotify/jazz-artists", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const jazzArtists = await getArtistsByGenre("jazz", limit);

    if (!jazzArtists.length) {
      return res.status(404).json({ error: "No jazz artists found" });
    }

    res.json({ message: `Found ${jazzArtists.length} jazz artists`, artists: jazzArtists });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Alternative jazz genre route
app.get("/api/spotify/genre/jazz", async (req, res) => {
  try {
    const artists = await getArtistsByGenre("jazz");
    res.json(artists);
  } catch (error) {
    res.status(500).json({ error: "Error fetching jazz artists" });
  }
});

// Fetch and store jazz artists in MongoDB
app.get("/api/spotify/store-jazz-artists", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const jazzArtists = await getArtistsByGenre("jazz", limit);

    if (!jazzArtists.length) {
      return res.status(404).json({ error: "No jazz artists found" });
    }


    // Fetch top songs & albums for each artist
    const enrichedArtists = await Promise.all(
      jazzArtists.map(async (artist) => {
        const topSongs = await getTopTracks(artist.spotifyId);
        const topAlbums = await getTopAlbums(artist.spotifyId);

        return {
          ...artist,
          topSongs,
          topAlbums,
        };
      })
    );


    const bulkOps = enrichedArtists.map((artist) => ({
      updateOne: {
        filter: { spotifyId: artist.spotifyId },
        update: {
          $set: {
            name: artist.name,
            genres: artist.genres,
            imageUrl: artist.imageUrl,
            followers: artist.followers,
            topSongs: artist.topSongs,  // ✅ Ensure topSongs are updated
            topAlbums: artist.topAlbums, // ✅ Ensure topAlbums are updated
          },
        },
        upsert: true, // Insert if not found, update if exists
      },
    }));
    

    await Artist.bulkWrite(bulkOps);

    res.json({ message: `Stored ${enrichedArtists.length} jazz artists with top songs & albums in MongoDB`, artists: enrichedArtists });
  } catch (error) {
    console.error("Error storing jazz artists:", error);
    res.status(500).json({ error: "Failed to store jazz artists" });
  }
});

// ✅ 6️⃣ Start Server
const PORT = process.env.PORT || 5051;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
