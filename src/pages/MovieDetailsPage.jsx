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

  const {
    title,
    poster_path,
    vote_average,
    release_date,
    original_language,
    overview,
  } = movie;

  return (
    <main>
      <div className="wrapper movie-details-wrapper">
        <div className="movie-poster">
          <img
            src={`https://image.tmdb.org/t/p/w500${poster_path}`}
            alt={title}
          />
        </div>

        <div className="movie-details">
          <div className="movie-details-main">
            <h1>{title}</h1>
            <p>{overview}</p>
          </div>

          <div className="movie-details-additional">
            <p className="movie-details-rating">
              <strong>Ratings:</strong> <img src="/star.svg" alt="Rating" />
              {vote_average ? vote_average.toFixed(1) : "N/A"}
            </p>

            <span>•</span>
            <p className="lang">
              {" "}
              <strong>Language:</strong> {original_language}
            </p>
            <span>•</span>
            <p>
              <strong>Release Date:</strong> {release_date || "N/A"}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
