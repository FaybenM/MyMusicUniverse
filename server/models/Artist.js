// models/Artist.js
const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
  spotifyId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  genres: { type: [String], default: [] },
  imageUrl: { type: String, default: "" },
  followers: { type: Number, default: 0 },
  topSongs: { type: Array, default: [] }, // Top 3 songs
  topAlbums: { type: Array, default: [] }, // Top 3 albums
});

const Artist = mongoose.model('Artist', artistSchema);

module.exports = Artist;
