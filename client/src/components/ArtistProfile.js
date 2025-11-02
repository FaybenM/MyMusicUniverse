import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles.css';

const ArtistProfile = () => {
  const { name } = useParams();
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5051/api/spotify/artist/${name}`);
        if (!response.ok) throw new Error('Artist not found');
        const data = await response.json();
        setArtist(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchArtist();
  }, [name]);

  const formatDuration = ms => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (loading) return <div className="loading">Loading artist profile...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!artist) return <div className="not-found">Artist not found</div>;

  return (
    <div className="artist-profile">
      <Link to="/artists" className="back-button">← Back to Artists</Link>

      <div className="artist-header">
        <img 
          src={artist.imageUrl || '/default-artist.png'} 
          alt={artist.name} 
          className="artist-image"
        />
        <div className="artist-info">
          <h1>{artist.name}</h1>
          <p className="followers">{artist.followers?.toLocaleString()} followers</p>
          <div className="genres">
            {artist.genres?.map((genre, index) => (
              <span key={index} className="genre-tag">{genre}</span>
            ))}
          </div>
          <p className="last-updated">
            Last updated: {artist.lastUpdated ? new Date(artist.lastUpdated).toLocaleDateString() : 'N/A'}
          </p>
        </div>
      </div>

      <div className="artist-content">
        {/* Top Tracks */}
        <div className="top-tracks">
          <h2>Popular Tracks</h2>
          {artist.topTracks?.length > 0 ? (
            <ul className="tracks-list">
              {artist.topTracks.map((track, index) => (
                <li key={track.id} className="track-item">
                  <span className="track-number">{index + 1}</span>
                  <img 
                    src={track.album?.imageUrl || '/default-track.png'} 
                    alt={track.name} 
                    className="track-image"
                  />
                  <div className="track-info">
                    <span className="track-name">{track.name}</span>
                    <span className="track-album">{track.album?.name}</span>
                    <span className="track-duration">{formatDuration(track.duration_ms)}</span>
                  </div>
                  {track.preview_url && (
                    <audio controls className="track-preview">
                      <source src={track.preview_url} type="audio/mpeg" />
                    </audio>
                  )}
                </li>
              ))}
            </ul>
          ) : <p>No top tracks available.</p>}
        </div>

        {/* Top Albums */}
        <div className="top-albums">
          <h2>Albums</h2>
          {artist.topAlbums?.length > 0 ? (
            <div className="albums-grid">
              {artist.topAlbums
                .sort((a, b) => new Date(b.release_date) - new Date(a.release_date))
                .map(album => (
                  <div key={album.id} className="album-card">
                    <img 
                      src={album.imageUrl || '/default-album.png'} 
                      alt={album.name} 
                    />
                    <div className="album-info">
                      <h3>{album.name}</h3>
                      <p>{album.release_date?.split('-')[0]} • {album.total_tracks} tracks</p>
                    </div>
                  </div>
                ))}
            </div>
          ) : <p>No albums available.</p>}
        </div>
      </div>
    </div>
  );
};

export default ArtistProfile;
