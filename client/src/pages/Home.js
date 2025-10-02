import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './styles.css';

const Home = () => {
  const [jazzArtists, setJazzArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loadingArtists, setLoadingArtists] = useState(true);
  const [loadingAlbums, setLoadingAlbums] = useState(true);

  // Fetch jazz artists
  useEffect(() => {
    const fetchJazzArtists = async () => {
      try {
        const response = await fetch('/api/spotify/genre/jazz');
        const data = await response.json();
        setJazzArtists(data);
      } catch (error) {
        console.error("Error fetching jazz artists:", error);
      } finally {
        setLoadingArtists(false);
      }
    };
    fetchJazzArtists();
  }, []);

  // Fetch featured albums
  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await fetch('/api/albums?limit=6');
        const data = await response.json();
        setAlbums(data);
      } catch (error) {
        console.error("Error fetching albums:", error);
      } finally {
        setLoadingAlbums(false);
      }
    };
    fetchAlbums();
  }, []);

  return (
    <div className="home-page">
      <header className="home-header">
        <h1>Discover Jazz Artists & Albums</h1>
        <input type="text" placeholder="Search for an artist..." className="search-bar" />
      </header>

      {/* Featured Artists */}
      <section className="featured-artists">
        <h2>Featured Artists</h2>
        {loadingArtists ? (
          <p>Loading artists...</p>
        ) : (
          <div className="artists-grid">
            {jazzArtists.map(artist => (
              <Link to={`/artist/${artist.spotifyId}`} key={artist.spotifyId} className="artist-card">
                <img src={artist.imageUrl || "https://via.placeholder.com/150"} alt={artist.name} className="artist-image" />
                <p>{artist.name}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Featured Albums */}
      <section className="featured-albums">
        <h2>Top Albums</h2>
        {loadingAlbums ? (
          <p>Loading albums...</p>
        ) : (
          <div className="albums-grid">
            {albums.map(album => (
              <Link to={`/album/${album.id}`} key={album.id} className="album-card">
                <img src={album.imageUrl || "https://via.placeholder.com/150"} alt={album.name} className="album-image" />
                <div className="album-info">
                  <h3>{album.name}</h3>
                  <p>{album.artistName}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
