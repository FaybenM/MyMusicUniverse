import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // For accessing URL parameters
import './styles.css';

function ArtistDetail() {
  const [artist, setArtist] = useState(null);
  const { id } = useParams(); // Get the Spotify ID from the URL

  useEffect(() => {
    // Fetch artist details using the Spotify ID from the URL
    fetch(`http://localhost:5051/api/artists/${id}`)
      .then(response => response.json())
      .then(data => setArtist(data))
      .catch(error => console.error("Error fetching artist details:", error));
  }, [id]); // Re-fetch if the ID changes

  if (!artist) return <div>Loading...</div>;

  return (
    <div className="artist-detail-container">
      <h1 className="artist-name">{artist.name}</h1>
      {artist.imageUrl && (
        <img src={artist.imageUrl} alt={artist.name} className="artist-image" />
      )}
      <p className="artist-genres">Genres: {artist.genres.join(", ")}</p>

      <h2>Top Songs</h2>
      <ul>
        {artist.topSongs.map(song => (
          <li key={song.spotifyId}>{song.name}</li>
        ))}
      </ul>

      <h2>Top Albums</h2>
      <ul>
        {artist.topAlbums.map(album => (
          <li key={album.spotifyId}>{album.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default ArtistDetail;
