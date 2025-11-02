import React from "react";
import '../styles.css';

function ArtistDetail({ artist }) {
  if (!artist) return <div>Loading...</div>;

  return (
    <div className="artist-detail-container">
      <h1 className="artist-name">{artist.name}</h1>
      <p className="artist-genres">Genres: {artist.genres.join(", ")}</p>
      <p className="artist-bio">{artist.bio || "No bio available."}</p>

      <div className="top-songs">
        <h2>Top Songs</h2>
        <ul>
          {artist.topSongs?.map((song, index) => (
            <li key={index}>{song.name}</li>
          ))}
        </ul>
      </div>

      <div className="top-albums">
        <h2>Top Albums</h2>
        <ul>
          {artist.topAlbums?.map((album, index) => (
            <li key={index}>{album.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ArtistDetail;
