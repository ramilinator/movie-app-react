import { Routes, Route } from "react-router-dom";
import MoviesPage from "./pages/MoviesPage";
import MovieDetailsPage from "./pages/MovieDetailsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MoviesPage />} />
      <Route path="/movie/:id" element={<MovieDetailsPage />} />
    </Routes>
  );
}

export default App;
