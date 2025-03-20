const axios = require("axios");

let accessToken = null; // Variable to store the access token
let tokenExpirationTime = null; // Variable to store the expiration time

// Function to fetch a new Spotify access token
const getSpotifyToken = async () => {
  try {
    // If the token has expired, request a new one
    if (!accessToken || Date.now() >= tokenExpirationTime) {
      const response = await axios.post(
        "https://accounts.spotify.com/api/token",
        new URLSearchParams({
          grant_type: "client_credentials",
          client_id: process.env.SPOTIFY_CLIENT_ID,
          client_secret: process.env.SPOTIFY_CLIENT_SECRET,
        }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      // Store the access token and its expiration time (1 hour)
      accessToken = response.data.access_token;
      tokenExpirationTime = Date.now() + response.data.expires_in * 1000; // expires_in is in seconds, so we multiply by 1000

      console.log("New access token fetched:", accessToken);
    }

    return accessToken;
  } catch (error) {
    console.error("Error fetching Spotify token:", error);
    throw error;
  }
};

// Function to search for an artist on Spotify
const getArtistFromSpotify = async (artistName) => {
  console.log("Searching for artist:", artistName);

  try {
    const token = await getSpotifyToken(); // Ensure you get a valid token before making the request

    const response = await fetch(`https://api.spotify.com/v1/search?q=${artistName}&type=artist`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    console.log("Spotify API response:", data);

    if (data.artists && data.artists.items.length > 0) {
      return data.artists.items[0];
    } else {
      console.log("Artist not found on Spotify.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching from Spotify:", error);
    return null;
  }
};

// Function to get the top tracks of an artist
const getTopTracks = async (spotifyId) => {
  const spotifyApiUrl = `https://api.spotify.com/v1/artists/${spotifyId}/top-tracks?country=US`;

  try {
    const token = await getSpotifyToken();
    const response = await axios.get(spotifyApiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.tracks;
  } catch (error) {
    console.error("Error fetching top tracks:", error);
    return [];
  }
};

// Function to get the top albums of an artist
const getTopAlbums = async (spotifyId) => {
  const spotifyApiUrl = `https://api.spotify.com/v1/artists/${spotifyId}/albums`;

  try {
    const token = await getSpotifyToken();
    const response = await axios.get(spotifyApiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.items;
  } catch (error) {
    console.error("Error fetching top albums:", error);
    return [];
  }
};

// Function to get artists by genre
const getArtistsByGenre = async (genre, limit = 20) => {
  try {
    const token = await getSpotifyToken();
    const response = await axios.get("https://api.spotify.com/v1/search", {
      headers: { Authorization: `Bearer ${token}` },
      params: { q: `genre:${genre}`, type: "artist", limit: limit },
    });

    if (!response.data.artists || !response.data.artists.items.length) {
      return [];
    }

    return response.data.artists.items.map((artist) => ({
      spotifyId: artist.id,
      name: artist.name,
      genres: artist.genres,
      imageUrl: artist.images.length > 0 ? artist.images[0].url : null,
      followers: artist.followers.total,
    }));
  } catch (error) {
    console.error("Error fetching artists:", error);
    throw error;
  }
};

module.exports = {
  getSpotifyToken,
  getArtistFromSpotify,
  getTopTracks,
  getTopAlbums,
  getArtistsByGenre,
};
