import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // For accessing URL parameters

function ArtistDetail() {
  const [artist, setArtist] = useState(null);
  const { id } = useParams(); // Get the ID from the URL

  useEffect(() => {
    // Fetch artist details using the ID from the URL
    fetch(`http://localhost:5051/api/artists/${id}`)
      .then(response => response.json())
      .then(data => setArtist(data))
      .catch(error => console.error("Error fetching artist details:", error));
  }, [id]); // Re-fetch if the ID changes

  if (!artist) return <div>Loading...</div>;

  return (
    <div>
      <h1>{artist.name}</h1>
      <img src={artist.image} alt={artist.name} /> {/* Adjust this based on your data */}
      <p>{artist.bio}</p> {/* Display bio */}
      {/* Display other artist details, such as albums or songs, as needed */}
    </div>
  );
}

export default ArtistDetail;
