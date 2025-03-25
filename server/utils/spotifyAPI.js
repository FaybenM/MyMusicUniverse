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

// Retry function
const fetchWithRetry = async (url, retries = 5, delay = 1000) => {
  try {
    const token = await getSpotifyToken();
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 429 && retries > 0) {
      const retryAfter = error.response.headers['retry-after'] || delay / 1000;  // Default to delay if no header is present
      console.log(`Rate limit exceeded. Retrying in ${retryAfter} seconds...`);
      await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));  // Wait before retrying
      return fetchWithRetry(url, retries - 1, delay);  // Retry
    } else {
      console.error('Error in fetch:', error.message);
      throw error;  // Propagate error if not 429 or retries exhausted
    }
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
  return await fetchWithRetry(spotifyApiUrl);  // Use retry function here

};

// Function to get the top albums of an artist
const getTopAlbums = async (spotifyId) => {
  const spotifyApiUrl = `https://api.spotify.com/v1/artists/${spotifyId}/albums`;

  return await fetchWithRetry(spotifyApiUrl);  // Use retry function here
  
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
