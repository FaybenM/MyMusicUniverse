import { useEffect, useState } from "react";
import axios from "axios";

function Artists() {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5051/api/artists") // This is your backend URL
      .then(response => {
        console.log(response.data); // Check what is being received
        setArtists(response.data); // Set the response data to your state
      })
      .catch(error => {
        console.error("Error fetching artists:", error); // Handle errors
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
