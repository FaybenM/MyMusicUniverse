import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ArtistDetail from "./ArtistDetail"; // Import the ArtistDetail component
import '../styles.css';

const ArtistPage = () => {
  const { id } = useParams(); // Get the artist ID from the URL
  const [artist, setArtist] = useState(null);

  // Fetch the artist details from the backend
  useEffect(() => {
    fetch(`http://localhost:5051/api/artists/${id}`)
      .then((response) => response.json())
      .then((data) => setArtist(data))
      .catch((error) => console.error("Error fetching artist details:", error));
  }, [id]);

  if (!artist) return <div>Loading...</div>;

  return (
    <div className="artist-page">
      <header className="artist-header">
        <img
          src={artist.imageUrl || "https://via.placeholder.com/300"} // Use artist image or placeholder
          alt="Artist"
          className="artist-photo"
        />
        <h1>{artist.name}</h1>
      </header>

      <section className="artist-bio">
        <h2>Bio</h2>
        <p>{artist.bio || "No bio available."}</p>
      </section>

      <section className="top-albums">
        <h2>Top Albums</h2>
        <div className="albums-grid">
          {artist.topAlbums?.map((album, index) => (
            <div key={index} className="album">
              <img
                src={album.imageUrl || "https://via.placeholder.com/150"} // Album cover or placeholder
                alt={album.name}
                className="album-cover"
              />
              <p>{album.name}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="top-songs">
        <h2>Top Songs</h2>
        <ul>
          {artist.topSongs?.map((song, index) => (
            <li key={index}>{song.name}</li>
          ))}
        </ul>
      </section>

      {/* Pass artist data to ArtistDetail */}
      <ArtistDetail artist={artist} />
    </div>
  );
};

export default ArtistPage;
