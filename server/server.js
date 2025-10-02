require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const { getArtistFromSpotify, getTopTracks, getTopAlbums, getArtistsByGenre } = require("./utils/spotifyApi");
const Artist = require("./models/Artist");

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/mymusicuniverse")
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Initialize Express
const app = express();
app.use(cors());
app.use(express.json());

// Root Route
app.get("/", (req, res) => {
  res.send("My Music Universe API is running...");
});

// Artist Routes
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
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Spotify API: Fetch artist by name
app.get("/api/spotify/artist/:name", async (req, res) => {
  const { name } = req.params;
  try {
    let artistData = await getArtistFromSpotify(name);
    if (!artistData) return res.status(404).json({ error: "Artist not found" });

    let existingArtist = await Artist.findOne({ spotifyId: artistData.spotifyId });

    if (!existingArtist) {
      const topTracks = await getTopTracks(artistData.spotifyId);
      const topAlbums = await getTopAlbums(artistData.spotifyId);

      const completeArtistData = {
        ...artistData,
        topTracks,
        topAlbums,
        lastUpdated: new Date()
      };

      const newArtist = new Artist(completeArtistData);
      await newArtist.save();
      return res.json(completeArtistData);
    }

    // Refresh if older than 24h
    if (existingArtist.lastUpdated && (new Date() - new Date(existingArtist.lastUpdated)) > 24*60*60*1000) {
      const topTracks = await getTopTracks(artistData.spotifyId);
      const topAlbums = await getTopAlbums(artistData.spotifyId);

      existingArtist.topTracks = topTracks;
      existingArtist.topAlbums = topAlbums;
      existingArtist.lastUpdated = new Date();
      await existingArtist.save();
    }

    res.json(existingArtist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Jazz Artists Routes
app.get("/api/spotify/genre/jazz", async (req, res) => {
  try {
    const artists = await getArtistsByGenre("jazz");
    res.json(artists);
  } catch (error) {
    res.status(500).json({ error: "Error fetching jazz artists" });
  }
});

// Fetch & store jazz artists in MongoDB
app.get("/api/spotify/store-jazz-artists", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const jazzArtists = await getArtistsByGenre("jazz", limit);

    const enrichedArtists = await Promise.all(
      jazzArtists.map(async artist => {
        const topSongs = await getTopTracks(artist.spotifyId);
        const topAlbums = await getTopAlbums(artist.spotifyId);
        return { ...artist, topSongs, topAlbums };
      })
    );

    const bulkOps = enrichedArtists.map(artist => ({
      updateOne: {
        filter: { spotifyId: artist.spotifyId },
        update: {
          $set: {
            name: artist.name,
            genres: artist.genres,
            imageUrl: artist.imageUrl,
            followers: artist.followers,
            topSongs: artist.topSongs,
            topAlbums: artist.topAlbums
          }
        },
        upsert: true
      }
    }));

    await Artist.bulkWrite(bulkOps);

    res.json({ message: `Stored ${enrichedArtists.length} jazz artists with top songs & albums`, artists: enrichedArtists });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to store jazz artists" });
  }
});

// ✅ New Albums Endpoint
app.get("/api/albums", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const artists = await Artist.find({ topAlbums: { $exists: true, $not: {$size:0} } });
    const allAlbums = artists.flatMap(artist =>
      artist.topAlbums.map(album => ({
        id: album.id,
        name: album.name,
        artistName: artist.name,
        imageUrl: album.images?.[0]?.url || '/default-album.png',
        release_date: album.release_date,
        total_tracks: album.total_tracks
      }))
    );

    const shuffled = allAlbums.sort(() => 0.5 - Math.random());
    const featuredAlbums = shuffled.slice(0, limit);

    res.json(featuredAlbums);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching albums" });
  }
});

// Start Server
const PORT = process.env.PORT || 5051;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
