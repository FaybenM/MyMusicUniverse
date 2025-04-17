import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchPage.css';

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  // Debounce search term to avoid too many re-renders or API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer); // Clean up the timer on component unmount
  }, [searchTerm]);

  const handleSearch = useCallback(async (e) => {
    e.preventDefault();
    if (debouncedSearchTerm.trim()) {
      setIsLoading(true);
      setError(null); // Reset error on new search

      try {
        // Simulate API call (you can replace this with your actual API call)
        const response = await fetch(`/api/artist/${encodeURIComponent(debouncedSearchTerm.trim())}`);
        if (!response.ok) throw new Error('No results found');
        navigate(`/artist/${encodeURIComponent(debouncedSearchTerm.trim())}`);
      } catch (err) {
        setError(err.message);
      }
      
      setIsLoading(false);
    }
  }, [debouncedSearchTerm, navigate]);

  const handlePopularSearch = (artist) => {
    setSearchTerm(artist);
    navigate(`/artist/${encodeURIComponent(artist)}`);
  };

  return (
    <div className="search-page">
      <div className="search-container">
        <h2>Discover Your Favorite Artists</h2>
        <p>Search for any artist to see their profile, top tracks, and albums</p>

        {/* Error Message */}
        {error && <div className="error-message">{error}</div>}

        {/* Search Form */}
        <form onSubmit={handleSearch} className="search-form">
          <label htmlFor="search-input" className="sr-only">Search for an artist</label>
          <input
            id="search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for an artist..."
            className="search-input"
          />
          <button 
            type="submit" 
            className="search-button"
            disabled={isLoading || !debouncedSearchTerm.trim()}
          >
            {isLoading ? <span className="spinner"></span> : 'Search'}
          </button>
        </form>

        {/* Popular Searches */}
        <div className="popular-searches">
          <h3>Popular Searches</h3>
          <div className="popular-artists">
            {['Taylor Swift', 'Drake', 'The Weeknd', 'Billie Eilish', 'BTS'].map((artist) => (
              <button 
                key={artist}
                className="artist-chip"
                onClick={() => handlePopularSearch(artist)}
              >
                {artist}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
