import React from "react";
import './styles.css';
const ArtistPage = () => {
  return (
    <div className="artist-page">
      <header className="artist-header">
        <img
          src="https://via.placeholder.com/300" // Replace with dynamic artist photo
          alt="Artist"
          className="artist-photo"
        />
        <h1>Artist Name</h1>
      </header>

      <section className="artist-bio">
        <h2>Bio</h2>
        <p>
          This is a brief bio of the artist. Here you can describe the artist's
          background, achievements, and musical journey.
        </p>
      </section>

      <section className="top-albums">
        <h2>Top Albums</h2>
        <div className="albums-grid">
          {/* Placeholder for album covers, can be dynamically fetched */}
          <div className="album">
            <img
              src="https://via.placeholder.com/150"
              alt="Album 1"
              className="album-cover"
            />
            <p>Album 1</p>
          </div>
          <div className="album">
            <img
              src="https://via.placeholder.com/150"
              alt="Album 2"
              className="album-cover"
            />
            <p>Album 2</p>
          </div>
        </div>
      </section>

      <section className="top-songs">
        <h2>Top Songs</h2>
        <ul>
          <li>Song 1</li>
          <li>Song 2</li>
          <li>Song 3</li>
        </ul>
      </section>
    </div>
  );
};

export default ArtistPage;
