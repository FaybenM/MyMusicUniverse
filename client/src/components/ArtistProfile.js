import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ArtistProfile.css';

const ArtistProfile = () => {
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { name } = useParams();

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/spotify/artist/${name}`);
        
        if (!response.ok) {
          throw new Error('Artist not found');
        }
        
        const data = await response.json();
        setArtist(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchArtist();
  }, [name]);

  if (loading) return <div className="loading">Loading artist profile...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!artist) return <div className="not-found">Artist not found</div>;

  return (
    <div className="artist-profile">
      <div className="artist-header">
        {artist.images && artist.images.length > 0 && (
          <img 
            src={artist.images[0].url} 
            alt={artist.name} 
            className="artist-image"
          />
        )}
        <div className="artist-info">
          <h1>{artist.name}</h1>
          <p className="followers">{artist.followers?.toLocaleString()} followers</p>
          <div className="genres">
            {artist.genres?.map((genre, index) => (
              <span key={index} className="genre-tag">{genre}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="artist-content">
        <div className="top-tracks">
          <h2>Popular Tracks</h2>
          <ul className="tracks-list">
            {artist.topTracks?.map((track, index) => (
              <li key={track.id} className="track-item">
                <span className="track-number">{index + 1}</span>
                {track.album?.images && track.album.images.length > 0 && (
                  <img 
                    src={track.album.images[track.album.images.length - 1].url} 
                    alt={track.name} 
                    className="track-image"
                  />
                )}
                <div className="track-info">
                  <span className="track-name">{track.name}</span>
                  <span className="track-album">{track.album?.name}</span>
                </div>
                {track.preview_url && (
                  <audio controls className="track-preview">
                    <source src={track.preview_url} type="audio/mpeg" />
                  </audio>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="top-albums">
          <h2>Albums</h2>
          <div className="albums-grid">
            {artist.topAlbums?.map(album => (
              <div key={album.id} className="album-card">
                {album.images && album.images.length > 0 && (
                  <img 
                    src={album.images[0].url} 
                    alt={album.name} 
                    className="album-image"
                  />
                )}
                <div className="album-info">
                  <h3>{album.name}</h3>
                  <p>{album.release_date?.split('-')[0]} • {album.total_tracks} tracks</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistProfile;