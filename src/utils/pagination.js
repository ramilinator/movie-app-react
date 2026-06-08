export function getPageNumbers(page, totalPages) {
  const pages = [];

  // Always show first page
  pages.push(1);

  // Left ellipsis
  if (page > 4) {
    pages.push("...");
  }

  // Pages around current page
  for (
    let i = Math.max(2, page - 1);
    i <= Math.min(totalPages - 1, page + 1);
    i++
  ) {
    pages.push(i);
  }

  // Right ellipsis
  if (page < totalPages - 3) {
    pages.push("...");
  }

  // Always show last page
  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages;
}