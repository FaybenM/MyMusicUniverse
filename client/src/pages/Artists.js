import { useEffect, useState } from "react";
import axios from "axios";
import '../styles.css';

function Artists() {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5051/api/artists")
      .then(response => {
        setArtists(response.data);
      })
      .catch(error => console.error("Error fetching artists:", error));
  }, []);

  const formatDuration = ms => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="artists-page">
      <h1 className="page-title">All Artists</h1>

      {artists.length === 0 ? (
        <p>No artists found.</p>
      ) : (
        <div className="artists-grid">
          {artists.map(artist => (
            <div key={artist.spotifyId} className="artist-card">
              <img 
                src={artist.imageUrl || "https://via.placeholder.com/150"} 
                alt={artist.name} 
                className="artist-image"
              />
              <h3>{artist.name}</h3>
              <p className="followers">{artist.followers?.toLocaleString()} followers</p>
              
              <div className="genres">
                {artist.genres?.map((g, i) => (
                  <span key={i} className="genre-tag">{g}</span>
                ))}
              </div>

              {/* Top Tracks */}
              <div className="top-tracks-preview">
                <h4>Top Tracks</h4>
                {artist.topTracks?.map(track => (
                  <div key={track.id} className="track-item">
                    <span>{track.name} ({formatDuration(track.duration_ms)})</span>
                    {track.preview_url && (
                      <audio controls>
                        <source src={track.preview_url} type="audio/mpeg" />
                      </audio>
                    )}
                  </div>
                ))}
              </div>

              {/* Top Albums */}
              <div className="top-albums-preview">
                <h4>Top Albums</h4>
                <ol>
                  {artist.topAlbums?.map(album => (
                    <li key={album.id}>{album.name}</li>
                  ))}
                </ol>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Artists;
