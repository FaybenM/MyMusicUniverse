import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import ArtistProfile from './components/ArtistProfile';
import SearchPage from './components/SearchPage'; // We'll create this next

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>My Music Universe</h1>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<SearchPage />} />
            <Route path="/artist/:name" element={<ArtistProfile />} />
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