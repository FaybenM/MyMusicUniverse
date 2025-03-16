const axios = require("axios");

const getArtistFromSpotify = async (artistName) => {
  // Log the artist name to verify it's being passed correctly
  console.log("Searching for artist:", artistName);

  try {
    // Make the API request to Spotify
    const response = await fetch(`https://api.spotify.com/v1/search?q=${artistName}&type=artist`, {
      headers: {
        Authorization: `Bearer ${process.env.SPOTIFY_API_KEY}`, // Ensure your token is correct
      },
    });

    // Convert the response to JSON
    const data = await response.json();

    // Log the response from Spotify
    console.log("Spotify API response:", data);

    // Check if the data contains artists
    if (data.artists && data.artists.items.length > 0) {
      return data.artists.items[0]; // Return the first artist from the response
    } else {
      console.log("Artist not found on Spotify.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching from Spotify:", error);
    return null;
  }
};


const getTopTracks = async (spotifyId) => {
  const spotifyApiUrl = `https://api.spotify.com/v1/artists/${spotifyId}/top-tracks?country=US`;

  try {
    const response = await axios.get(spotifyApiUrl);
    return response.data.tracks;
  } catch (error) {
    console.error("Error fetching top tracks:", error);
    return [];
  }
};

const getTopAlbums = async (spotifyId) => {
  const spotifyApiUrl = `https://api.spotify.com/v1/artists/${spotifyId}/albums`;

  try {
    const response = await axios.get(spotifyApiUrl);
    return response.data.items;
  } catch (error) {
    console.error("Error fetching top albums:", error);
    return [];
  }
};

module.exports = { getArtistFromSpotify, getTopTracks, getTopAlbums };
