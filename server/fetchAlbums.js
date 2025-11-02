require('dotenv').config();
const axios = require('axios');
const mongoose = require('mongoose');
const Album = require('./models/Album');   // Album model
const Artist = require('./models/Artist'); // Artist model

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/mymusicuniverse', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error(err));

// Get Spotify access token
async function getAccessToken() {
  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    new URLSearchParams({ grant_type: 'client_credentials' }),
    {
      headers: {
        Authorization: `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return response.data.access_token;
}

// Fetch albums for all artists in DB
async function fetchAlbums() {
  const token = await getAccessToken();
  const artists = await Artist.find(); // all artists

  for (const artist of artists) {
    try {
      const res = await axios.get(
        `https://api.spotify.com/v1/artists/${artist.spotifyId}/albums?include_groups=album,single&limit=50`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      for (const albumData of res.data.items) {
        const album = {
          id: albumData.id,
          name: albumData.name,
          release_date: albumData.release_date,
          total_tracks: albumData.total_tracks,
          artistName: artist.name,
          images: albumData.images,
        };

        await Album.updateOne({ id: album.id }, album, { upsert: true });
      }

      console.log(`✅ Albums fetched for ${artist.name}`);
    } catch (err) {
      console.error(`❌ Error fetching albums for ${artist.name}:`, err.message);
    }
  }

  console.log('🎉 All albums fetched!');
  mongoose.connection.close();
}

// Run the function
fetchAlbums();
