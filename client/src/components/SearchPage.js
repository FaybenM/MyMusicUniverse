import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchPage.css';

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setIsLoading(true);
      navigate(`/artist/${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className="search-page">
      <div className="search-container">
        <h2>Discover Your Favorite Artists</h2>
        <p>Search for any artist to see their profile, top tracks, and albums</p>
        
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for an artist..."
            className="search-input"
          />
          <button 
            type="submit" 
            className="search-button"
            disabled={isLoading || !searchTerm.trim()}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </form>
        
        <div className="popular-searches">
          <h3>Popular Searches</h3>
          <div className="popular-artists">
            {['Taylor Swift', 'Drake', 'The Weeknd', 'Billie Eilish', 'BTS'].map(artist => (
              <button 
                key={artist}
                className="artist-chip"
                onClick={() => {
                  setSearchTerm(artist)
                }}
              >
                {artist}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )