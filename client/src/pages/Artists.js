import { useEffect, useState } from "react";
import axios from "axios";

function Artists() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Axios GET request to your backend API
    axios
      .get("http://localhost:5051/api/artists")
      .then((response) => {
        setArtists(response.data);  // Store data in state
        setLoading(false);  // Set loading to false after data is fetched
      })
      .catch((err) => {
        setError("Error fetching data");
        setLoading(false);  // Set loading to false in case of error
        console.error(err);  // Log the error for debugging
      });
  }, []);

  return (
    <div>
      <h1>Artists</h1>
      {loading ? (
        <p>Loading...</p>  // Display loading message until data is fetched
      ) : error ? (
        <p>{error}</p>  // Display error message if any
      ) : artists.length === 0 ? (
        <p>No artists found.</p>
      ) : (
        <ul>
          {artists.map((artist) => (
            <li key={artist.id}>{artist.name}</li>  // Display each artist's name
          ))}
        </ul>
      )}
    </div>
  );
}

export default Artists;
