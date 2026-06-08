const API_BASE_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

export async function getPopularMovies(page = 1) {
  const response = await fetch(
    `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&page=${page}`,
    API_OPTIONS
  );

  return response.json();
}

export async function getMovieDetails(id) {
  const response = await fetch(
    `${API_BASE_URL}/movie/${id}`,
    API_OPTIONS
  );

  return response.json();
}