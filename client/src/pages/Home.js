import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles.css";

const Home = () => {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5051/api/artists?limit=6")
      .then(res => setArtists(res.data.slice(0, 6)))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="home-page" style={{ width: "95%", margin: "0 auto" }}>
      <h1 style={{ fontFamily: "Shrikhand", textAlign: "center", color: "#ffedf6ff", textShadow: "4px 4px 6px rgba(227, 19, 81, 1)", marginBottom: 20 }}>
        My Music Universe
      </h1>

      {/* Artists Grid */}
      <div
        className="artist-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "30px",
          justifyItems: "center",
          alignItems: "center",
        }}
      >
        {artists.map((artist) => (
          <div
            key={artist._id}
            className="artist-card"
            style={{
              textAlign: "center",
              backgroundColor: "#f9f9f9",
              borderRadius: "10px",
              padding: "15px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              width: "100%",
              maxWidth: "250px",
            }}
          >
            <img
              src={artist.imageUrl || "https://via.placeholder.com/150"}
              alt={artist.name}
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                objectFit: "cover",
                marginBottom: "10px",
              }}
            />
            <h3 style={{ margin: "10px 0 5px", color: "#950606" }}>
              {artist.name}
            </h3>
            <p style={{ color: "#333", fontSize: "0.9rem" }}>
              {artist.genres?.[0] || "jazz"}
            </p>
          </div>
        ))}
      </div>

      {/* View More Button */}
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <button
          onClick={() => (window.location.href = "/artists")}
          style={{
            backgroundColor: "#3f1717",
            color: "#ffb4b4",
            border: "none",
            borderRadius: "8px",
            padding: "10px 20px",
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          View More Artists
        </button>
      </div>
    </div>
  );
};

export default Home;
