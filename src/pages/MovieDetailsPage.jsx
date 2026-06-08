import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMovieDetails } from "../services/tmdb";

export default function MovieDetailsPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    fetchMovie();
  }, [id]);

  async function fetchMovie() {
    const data = await getMovieDetails(id);

    setMovie(data);
  }

  if (!movie) {
    return <p>Loading...</p>;
  }

  return (
    <main>
      <h1>{movie.title}</h1>

      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
      />

      <p>{movie.overview}</p>

      <p>Release Date: {movie.release_date}</p>

      <p>Rating: {movie.vote_average}</p>
    </main>
  );
}
