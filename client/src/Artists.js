import React, { useEffect, useState } from "react";
import axios from "axios";

function Artists() {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/artists")
      .then(response => setArtists(response.data))
      .catch(error => console.error("Error fetching artists:", error));
  }, []);

  return (
    <div>
      <h1>Artists</h1>
      <ul>
        {artists.map((artist) => (
          <li key={artist._id}>{artist.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default Artists;
