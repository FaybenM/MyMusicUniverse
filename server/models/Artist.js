const mongoose = require('mongoose');

const trackSchema = new mongoose.Schema({
  id: String,
  name: String,
  duration_ms: Number,
  popularity: Number,
  preview_url: String,
  album: {
    id: String,
    name: String,
    images: [{ url: String, height: Number, width: Number }]
  }
});

const albumSchema = new mongoose.Schema({
  id: String,
  name: String,
  release_date: String,
  total_tracks: Number,
  images: [{ url: String, height: Number, width: Number }]
});

const artistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  spotifyId: { type: String, required: true, unique: true },
  genres: [String],
  popularity: Number,
  followers: Number,
  images: [{ url: String, height: Number, width: Number }],
  topTracks: [trackSchema],
  topAlbums: [albumSchema],
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Artist', artistSchema);