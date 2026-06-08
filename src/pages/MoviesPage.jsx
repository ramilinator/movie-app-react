import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import MovieCard from "../components/MovieCard";
import Pagination from "../components/Pagination";

import { getPopularMovies } from "../services/tmdb";

export default function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;

  useEffect(() => {
    async function fetchMovies() {
      try {
        const data = await getPopularMovies(page);

        setMovies(data.results || []);
        // setTotalPages(Math.min(data.total_pages, 500));
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      }
    }
    console.log(movies);
    fetchMovies();
  }, [page]);

  const goToPage = (newPage) => {
    setSearchParams({ page: newPage });
  };

  return (
    <main className="bg">
      <div className="wrapper">
        <header>
          <h1>
            Discover <span className="text-gradient">Movies</span> You'll Love
            Without the Hassle
          </h1>
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
