const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  release_date: String,
  total_tracks: Number,
  images: [
    {
      url: String,
      height: Number,
      width: Number
    }
  ]
});

module.exports = mongoose.model('Album', albumSchema);
