import { getPageNumbers } from "../utils/pagination";

export default function Pagination({ page, totalPages, onPageChange }) {
  return (
    <div className="pagination">
      <button disabled={page === 1} onClick={() => onPageChange(page - 1)}>
        Previous
      </button>

      {getPageNumbers(page, totalPages).map((item, index) =>
        item === "..." ? (
          <span key={`ellipsis-${index}`}>...</span>
        ) : (
          <button
            key={item}
            onClick={() => onPageChange(item)}
            className={page === item ? "active" : ""}
          >
            {item}
          </button>
        ),
      )}

      <button
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
}
