import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "react-use";

import Search from "../components/Search";
import MovieCard from "../components/MovieCard";
import Pagination from "../components/Pagination";

import { getPopularMovies, searchMovies } from "../services/tmdb";

export default function MoviesPage() {
  // Router hooks
  const [searchParams, setSearchParams] = useSearchParams();

  // Values derived from URL
  const query = searchParams.get("query") || "";
  const page = Number(searchParams.get("page")) || 1;

  // Component state
  const [movies, setMovies] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  // Search state
  const [searchTerm, setSearchTerm] = useState(query);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(query);

  // Custom hooks
  useDebounce(
    () => {
      setDebouncedSearchTerm(searchTerm);
    },
    500,
    [searchTerm],
  );

  async function fetchMovies() {
    try {
      const data = query
        ? await searchMovies(query, page)
        : await getPopularMovies(page);

      const moviesWithPosters = data.results.filter(
        (movie) => movie.poster_path,
      );

      setMovies(moviesWithPosters);
      setTotalPages(Math.min(data.total_pages, 500));
    } catch (error) {
      console.error(error);
    }
  }

  const goToPage = (newPage) => {
    const params = {
      page: String(newPage),
    };

    if (query) {
      params.query = query;
    }

    setSearchParams(params);
  };

  useEffect(() => {
    fetchMovies();
  }, [page, query]);

  useEffect(() => {
    if (debouncedSearchTerm === query) return;

    const params = {
      page: "1",
    };

    if (debouncedSearchTerm) {
      params.query = debouncedSearchTerm;
    }

    setSearchParams(params);
  }, [debouncedSearchTerm, query, setSearchParams]);

  return (
    <main className="bg">
      <div className="wrapper">
        <header>
          <h1>
            Discover <span className="text-gradient">Movies</span>
            You'll Love Without the Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        <section className="all-movies">
          <h2>Movies</h2>

          <ul>
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </ul>

          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={goToPage}
          />
        </section>
      </div>
    </main>
  );
}
