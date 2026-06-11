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

  return (
    <main>
      <div
        className="movie-details-page"
        style={{
          backgroundImage: `url(${backdropUrl})`,
        }}
      >
        <section className="discover-more-button">
          <button
            className="close-btn"
            onClick={() => {
              const from = location.state?.from;
              navigate(from ? `${from.pathname}${from.search}` : "/");
            }}
          >
            ✕
          </button>
        </section>

        <div className="movie-hero-overlay">
          <div className="movie-overview-wrapper wrapper">
            <div className="trailer-and-overview">
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
                <p>{overview || "No overview available."}</p>
                <div className="movie-details-meta">
                  <div className="movie-stats">
                    <p className="movie-runtime">
                      <label>Runtime:</label>{" "}
                      {runtime ? `${runtime} min` : "N/A"}
                    </p>
                    <p className="movie-lang">
                      <label>Language:</label>{" "}
                      {original_language?.toUpperCase()}
                    </p>
                    <p className="release-date">
                      <label>Release Date:</label> {release_date || "N/A"}
                    </p>
                  </div>
                </div>
              </section>
            </div>

            <section className="movie-poster">
              <h2>Movie Poster</h2>
              <div className="movie-poster-image">
                <img
                  className="movie-poster-img"
                  src={`https://image.tmdb.org/t/p/w500${poster_path}`}
                  alt={title}
                />
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
