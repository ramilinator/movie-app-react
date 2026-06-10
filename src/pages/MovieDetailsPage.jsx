import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getMovieDetails,
  getMovieVideos,
  getMovieCredits,
} from "../services/tmdb";

export default function MovieDetailsPage() {
  const { id } = useParams();

  const location = useLocation();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [cast, setCast] = useState([]);

  useEffect(() => {
    fetchMovie();
  }, [id]);

  async function fetchMovie() {
    try {
      const movieData = await getMovieDetails(id);

      const videoData = await getMovieVideos(id);

      const creditsData = await getMovieCredits(id);

      setMovie(movieData);

      const officialTrailer = videoData.results.find(
        (video) => video.site === "YouTube" && video.type === "Trailer",
      );

      setTrailer(officialTrailer || null);

      setCast(creditsData.cast.slice(0, 10));
    } catch (error) {
      console.error(error);
    }
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
    genres,
    runtime,
    profile_path,
  } = movie;

  return (
    <main>
      <div className="movie-details-page wrapper">
        <div className="discover-more-button">
          <button
            className="close-btn"
            onClick={() => {
              const from = location.state?.from;
              navigate(from ? `${from.pathname}${from.search}` : "/");
            }}
          >
            ✕
          </button>
        </div>

        <section className="hero-section">
          <div className="movie-overview-wrapper">
            {/* Trailer */}
            {trailer && (
              <section className="movie-trailer">
                <h2>Official Trailer</h2>

                <div className="trailer-container">
                  <iframe
                    src={`https://www.youtube.com/embed/${trailer.key}`}
                    title={trailer.name}
                    allowFullScreen
                  />
                </div>
              </section>
            )}
            <div className="movie-overview">
              <h1>{title}</h1>
              <p>{overview || "No overview available."}</p>
              <div className="movie-details-meta">
                {genres?.length > 0 && (
                  <div className="genres">
                    <label>Genre:</label>
                    {genres.map((genre) => (
                      <span key={genre.id} className="genre-badge">
                        {genre.name}
                      </span>
                    ))}
                  </div>
                )}
                <div className="movie-stats">
                  <p className="movie-rating">
                    <label>Rating:</label>
                    <img src="/star.svg" alt="Rating" />
                    <span>
                      {vote_average ? vote_average.toFixed(1) : "N/A"}
                    </span>
                  </p>
                  <p>
                    <label>Runtime:</label> {runtime ? `${runtime} min` : "N/A"}
                  </p>
                  <p>
                    <label>Language:</label> {original_language?.toUpperCase()}
                  </p>
                  <p>
                    <label>Release Date:</label> {release_date || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="movie-poster">
            <h2>Movie Poster</h2>
            <img
              className="movie-poster-img"
              src={`https://image.tmdb.org/t/p/w500${poster_path}`}
              alt={title}
            />
          </div>
        </section>

        {/* Cast */}
        {cast.length > 0 && (
          <section className="movie-cast">
            <h2>Cast</h2>
            <ul className="cast-grid">
              {cast.map((actor) => (
                <li key={actor.id} className="cast-card">
                  <img
                    src={
                      actor.profile_path
                        ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                        : "/no-avatar.png"
                    }
                    alt={actor.name}
                  />
                  <p>{actor.name}</p>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}
