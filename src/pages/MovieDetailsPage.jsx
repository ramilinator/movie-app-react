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

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : "/fallback-backdrop.jpg";

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/fallback-poster.jpg";

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

  const starRating = Math.round((vote_average || 0) / 2);

  const handleBack = () => {
    const from = location.state?.from;
    navigate(from ? `${from.pathname}${from.search}` : "/");
  };

  return (
    <main>
      <div className="movie-details-page">
        <div
          className="movie-hero-overlay"
          style={{
            backgroundImage: `url(${backdropUrl})`,
          }}
        >
          <div className="movie-hero wrapper">
            <section className="discover-more">
              <button className="back-btn" onClick={handleBack}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
            </section>

            <section className="movie-overview">
              <div className="movie-title-and-rating">
                <p className="movie-rating">
                  {Array.from({ length: 5 }, (_, index) => (
                    <img
                      src="/star.svg"
                      className={
                        index < starRating ? "star filled" : "star empty"
                      }
                      alt=""
                    />
                  ))}

                  <span className="movie-rating-score">
                    {vote_average ? `${vote_average.toFixed(1)} / 10` : "N/A"}
                  </span>
                </p>
                <h1>{title}</h1>
              </div>

              <p>{overview || "No overview available."}</p>
              {genres?.length > 0 && (
                <div className="genres">
                  <label>Genre: </label>

                  {genres.map((genre) => (
                    <span key={genre.id} className="genre-badge">
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
        <div className="movie-more-details wrapper">
          <section className="movie-poster">
            <h2>Movie Poster</h2>
            <div className="movie-poster-image">
              <img
                src={`https://image.tmdb.org/t/p/w500${poster_path}`}
                alt={title}
              />
            </div>
          </section>

          <section className="movie-traile-section">
            {trailer && (
              <div className="movie-trailer">
                <h2>Official Trailer</h2>

                <div className="trailer-container">
                  <iframe
                    src={`https://www.youtube.com/embed/${trailer.key}`}
                    title={trailer.name}
                    allowFullScreen
                  />
                </div>
              </div>
            )}
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
      </div>
    </main>
  );
}
