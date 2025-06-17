import React, { useEffect, useState } from "react";
import Search from "./components/Search.jsx";
import Moviecard from "./components/Moviecard.jsx";
import Spinner from "./components/spinner.jsx";

const API_BASE_URL = 'https://moviesdatabase.p.rapidapi.com';
const API_KEY = import.meta.env.VITE_RAPIDAPI_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    'x-rapidapi-key': API_KEY,
    'x-rapidapi-host': 'moviesdatabase.p.rapidapi.com'
  }
};

// Fallback movie data using your local assets
const FALLBACK_MOVIES = [
  {
    id: '1',
    titleText: { text: 'The Shawshank Redemption' },
    releaseYear: { year: 1994 },
    ratingsSummary: { aggregateRating: 9.3 },
    primaryImage: { url: '/src/assets/m1.jpg' }
  },
  {
    id: '2',
    titleText: { text: 'The Godfather' },
    releaseYear: { year: 1972 },
    ratingsSummary: { aggregateRating: 9.2 },
    primaryImage: { url: '/src/assets/m2.jpg' }
  },
  {
    id: '3',
    titleText: { text: 'The Dark Knight' },
    releaseYear: { year: 2008 },
    ratingsSummary: { aggregateRating: 9.0 },
    primaryImage: { url: '/src/assets/m3.jpg' }
  },
  {
    id: '4',
    titleText: { text: 'Pulp Fiction' },
    releaseYear: { year: 1994 },
    ratingsSummary: { aggregateRating: 8.9 },
    primaryImage: { url: '/src/assets/m4.jpg' }
  },
  {
    id: '5',
    titleText: { text: 'Inception' },
    releaseYear: { year: 2010 },
    ratingsSummary: { aggregateRating: 8.8 },
    primaryImage: { url: '/no-movie.png' }
  },
  {
    id: '6',
    titleText: { text: 'Fight Club' },
    releaseYear: { year: 1999 },
    ratingsSummary: { aggregateRating: 8.8 },
    primaryImage: { url: '/no-movie.png' }
  }
];

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUsingFallback, setIsUsingFallback] = useState(true); // Start with fallback mode
  const [apiLimitReached, setApiLimitReached] = useState(false);

  const fetchMovies = async (query = '') => {
    setIsLoading(true);
    setErrorMessage('');

    // If we know API limit is reached, skip API call entirely
    if (apiLimitReached) {
      handleFallbackData(query);
      setIsLoading(false);
      return;
    }

    try {
      let endpoint;
      if (query) {
        endpoint = `${API_BASE_URL}/titles/search/title/${encodeURIComponent(query)}?exact=false&titleType=movie`;
      } else {
        endpoint = `${API_BASE_URL}/titles?list=most_pop_movies&limit=20`;
      }

      const response = await fetch(endpoint, API_OPTIONS);

      if (response.status === 429) {
        console.warn('API rate limit exceeded, switching to offline mode');
        setApiLimitReached(true); // Remember that API limit is reached
        handleFallbackData(query);
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setIsUsingFallback(false);
      
      if (data.results && data.results.length > 0) {
        setMovieList(data.results);
      } else {
        setErrorMessage(query ? 'No movies found for your search' : 'No movies available');
        setMovieList([]);
      }

    } catch (error) {
      console.error('Error fetching movies:', error);
      setApiLimitReached(true); // Switch to offline mode on any error
      handleFallbackData(query);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFallbackData = (query = '') => {
    setIsUsingFallback(true);
    
    if (query) {
      const filteredMovies = FALLBACK_MOVIES.filter(movie =>
        movie.titleText.text.toLowerCase().includes(query.toLowerCase())
      );
      setMovieList(filteredMovies);
      if (filteredMovies.length === 0) {
        setErrorMessage('No movies found. Try: "Shawshank", "Godfather", "Dark Knight", "Pulp Fiction", "Inception", or "Fight Club"');
      } else {
        setErrorMessage('');
      }
    } else {
      setMovieList(FALLBACK_MOVIES);
      setErrorMessage('');
    }
  };

  // Initialize with fallback data immediately
  useEffect(() => {
    handleFallbackData();
  }, []);

  // Fetch movies when search term changes (with debounce effect)
  useEffect(() => {
    if (searchTerm.trim()) {
      const timeoutId = setTimeout(() => {
        fetchMovies(searchTerm);
      }, 500); // 500ms debounce

      return () => clearTimeout(timeoutId);
    } else {
      // If search term is empty, fetch popular movies
      fetchMovies();
    }
  }, [searchTerm]);
  
  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>Find Movies You'll Enjoy Without the Hassle</h1>

          <Search searchTerm={searchTerm} setsearchTerm={setSearchTerm} />
        </header>
        <section className="all-movies">
          <h2 className="mt-[40px]">
            All Movies 
            {isUsingFallback && <span className="text-sm text-yellow-400 ml-2">(Demo Mode)</span>}
          </h2>
          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <Moviecard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;