const mongoose = require("mongoose");

const artistSchema = new mongoose.Schema({
  spotifyId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  genres: [String],
  imageUrl: String,
  followers: Number,
  topSongs: [
    {
      name: String,
      popularity: Number,
      album: String,
    },
  ],
  topAlbums: [
    {
      name: String,
      releaseDate: String,
      albumType: String,
    },
  ],
});

module.exports = mongoose.model("Artist", artistSchema);
