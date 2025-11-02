import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Artists from "./pages/Artists";
import Albums from "./pages/Albums";
import Concerts from "./pages/Concerts";
import Admin from "./pages/Admin";
import JazzArtists from "./components/JazzArtists";
import ArtistProfile from "./components/ArtistProfile";
import SearchPage from "./components/SearchPage";
import logo from "./images/MyMusicUniverseLogo.png";
import './App.css';

function App() {
  const [artistName, setArtistName] = useState("");

  const handleSearch = () => {
    if (artistName) {
      window.location.href = `/artist/${artistName}`;
    }
  };

  return (
    <Router>
      <div className="App">
        <header className="navbar">
          <div className="logo">
            <img src={logo} alt="My Music Universe Logo" />
          </div>
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

        <div className="search-container">
          <input
            type="text"
            placeholder="Search for artist/album"
            value={artistName}
            onChange={(e) => setArtistName(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/artists" element={<Artists />} />
            <Route path="/artist/:name" element={<ArtistProfile />} />
            <Route path="/albums" element={<Albums />} />
            <Route path="/concerts" element={<Concerts />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/jazz-artists" element={<JazzArtists />} />
            <Route path="/search" element={<SearchPage />} />
          </Routes>
        </main>

        <footer>
          <p>Powered by Spotify API</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
