// utils/spotifyAPI.js
const fetch = require("node-fetch");
require("dotenv").config();

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

// Function to get an access token from Spotify
async function getSpotifyAccessToken() {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
  });

  const data = await response.json();
  return data.access_token; // Return access token
}

// Function to fetch artist details from Spotify
async function getArtistFromSpotify(artistName) {
  const token = await getSpotifyAccessToken();
  const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
    artistName
  )}&type=artist&limit=1`;

  const response = await fetch(searchUrl, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();
  if (data.artists.items.length === 0) return null; // No artist found

  const artist = data.artists.items[0];
  return {
    spotifyId: artist.id,
    name: artist.name,
    genres: artist.genres,
    imageUrl: artist.images.length > 0 ? artist.images[0].url : "",
    followers: artist.followers.total,
  };
}

// Function to fetch top 3 songs
async function getTopTracks(spotifyId) {
  const token = await getSpotifyAccessToken();
  const url = `https://api.spotify.com/v1/artists/${spotifyId}/top-tracks?market=US`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();
  return data.tracks.slice(0, 3).map(track => ({
    name: track.name,
    spotifyId: track.id,
  }));
}

// Function to fetch top 3 albums
async function getTopAlbums(spotifyId) {
  const token = await getSpotifyAccessToken();
  const url = `https://api.spotify.com/v1/artists/${spotifyId}/albums?include_groups=album&limit=3`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();
  return data.items.map(album => ({
    name: album.name,
    spotifyId: album.id,
  }));
}

module.exports = { getArtistFromSpotify, getTopTracks, getTopAlbums };
