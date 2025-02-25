import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // For accessing URL parameters
import './styles.css';

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
    <div className="artist-detail-container">
      <h1 className="artist-name">{artist.name}</h1>
      <div className="artist-image-container">
        <img src={artist.image} alt={artist.name} className="artist-image" />
      </div>
      <p className="artist-bio">{artist.bio}</p>
      {/* You can add more artist details here */}
    </div>
  );
}

export default ArtistDetail;
