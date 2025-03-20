import React, { useEffect, useState } from 'react';

const JazzArtists = () => {
  const [jazzArtists, setJazzArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJazzArtists = async () => {
      try {
        // Request to get jazz artists
        const response = await fetch('/api/spotify/genre/jazz');
        const data = await response.json();
        setJazzArtists(data);
      } catch (error) {
        console.error("Error fetching jazz artists:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJazzArtists();
  }, []);

  return (
    <div>
      <h2>Jazz Artists</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {jazzArtists.map((artist) => (
            <li key={artist.spotifyId}>
              <h3>{artist.name}</h3>
              <p>Followers: {artist.followers}</p>
              {artist.imageUrl && <img src={artist.imageUrl} alt={artist.name} />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default JazzArtists;
