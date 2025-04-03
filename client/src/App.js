import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Artists from "./pages/Artists";
import ArtistPage from "./pages/ArtistPage";  
import ArtistDetail from "./pages/ArtistDetail"; 
import Albums from "./pages/Albums";
import Concerts from "./pages/Concerts";
import Admin from "./pages/Admin";
import logo from "./images/MyMusicUniverseLogo.png";
import JazzArtists from './components/JazzArtists';


function App() {
  const [artistName, setArtistName] = useState("");

  const handleSearch = () => {
    // Redirect to ArtistPage with the artist name
    if (artistName) {
      window.location.href = `/artists/${artistName}`;
    }
  };

  return (
    <Router>
      <header className="navbar">
        {/* Logo without background */}
        <div className="logo">
          <img src={logo} alt="My Music Universe Logo" />
        </div>
        {/* Nav Links with background */}
        <div className="nav-container">
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/artists">Artists</Link></li>
            <li><Link to="/albums">Albums</Link></li>
            <li><Link to="/concerts">Concerts</Link></li>
            <li><Link to="/admin">Admin</Link></li>
          </ul>
        </div>
      </header>

      {/* Search for an artist */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for an artist"
          value={artistName}
          onChange={(e) => setArtistName(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/artists" element={<Artists />} />
        <Route path="/artists/:id" element={<ArtistPage />} />
        <Route path="/artists/:id/detail" element={<ArtistDetail />} />
        <Route path="/albums" element={<Albums />} />
        <Route path="/concerts" element={<Concerts />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/jazz-artists" element={<JazzArtists />} />
      </Routes>
    </Router>
  );
}

export default App;
