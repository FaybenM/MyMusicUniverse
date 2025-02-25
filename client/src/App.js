import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./pages/Home";
import Artists from "./pages/Artists";
import ArtistPage from "./pages/ArtistPage";  
import ArtistDetail from "./pages/ArtistDetail"; 
import Albums from "./pages/Albums";
import Concerts from "./pages/Concerts";
import Admin from "./pages/Admin";


function App() {
  return (
    <Router>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/artists">Artists</Link></li>
          <li><Link to="/albums">Albums</Link></li>
          <li><Link to="/concerts">Concerts</Link></li>
          <li><Link to="/admin">Admin</Link></li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/artists" element={<Artists />} />
        <Route path="/artists/:id" element={<ArtistPage />} />
        <Route path="/artists/:id" element={<ArtistDetail />} />
        <Route path="/albums" element={<Albums />} />
        <Route path="/concerts" element={<Concerts />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
