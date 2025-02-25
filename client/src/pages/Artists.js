import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Import Link

function Artists() {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5051/api/artists") // This is backend URL
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
            <li key={artist.id}>
              <Link to={`/artists/${artist.id}`}>{artist.name}</Link> {/* Link to Artist Detail */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Artists;
