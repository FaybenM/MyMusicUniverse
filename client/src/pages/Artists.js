import { useEffect, useState } from "react";
import axios from "axios";

function Artists() {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5050/api/artists") // Adjust if your API is different
      .then(response => {
        console.log(response.data); // Check what is being received
        setArtists(response.data);
      })
      .catch(error => {
        console.error("Error fetching artists:", error);
      });
  }, []);

  return (
    <div>
      <h1>Artists</h1>
      {artists.length === 0 ? (
        <p>No artists found.</p>
      ) : (
        <ul>
          {artists.map((artist) => (
            <li key={artist.id}>{artist.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Artists;
