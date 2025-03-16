const mongoose = require("mongoose");

const artistSchema = new mongoose.Schema({
  spotifyId: String,
  name: String,
  genres: [String],
  imageUrl: String,
  followers: Number,
  topSongs: [{ name: String, spotifyId: String }],
  topAlbums: [{ name: String, spotifyId: String }],
});

module.exports = mongoose.model("Artist", artistSchema);
