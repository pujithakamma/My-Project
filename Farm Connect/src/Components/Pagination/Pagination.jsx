import React from "react";
import "./Pagination.css";

/**
 * Pagination Component
 * @param {Object} props - Component props
 * @param {number} props.currentPage - Current page number
 * @param {number} props.totalPages - Total number of pages
 * @param {number} props.totalRecords - Total records count
 * @param {number} props.pageSize - Records per page
 * @param {function} props.onPageChange - Callback when page changes
 */
const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  totalRecords = 0,
  pageSize = 10,
  onPageChange
}) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (pageNum) => {
    onPageChange(pageNum);
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5; // Show max 5 page buttons

    if (totalPages <= maxVisible) {
      // Show all pages if total is less than maxVisible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate range around current page
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        end = maxVisible - 1;
      } else if (currentPage >= totalPages - 2) {
        start = totalPages - (maxVisible - 2);
      }

      // Add ellipsis if needed
      if (start > 2) {
        pages.push("...");
      }

      // Add page range
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis if needed
      if (end < totalPages - 1) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const startRecord = Math.min((currentPage - 1) * pageSize + 1, totalRecords);
  const endRecord = Math.min(currentPage * pageSize, totalRecords);

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        {totalRecords > 0 ? (
          <span>
            Showing <strong>{startRecord}</strong> to <strong>{endRecord}</strong> of{" "}
            <strong>{totalRecords}</strong> records
          </span>
        ) : (
          <span>No records found</span>
        )}
      </div>

      <div className="pagination-controls">
        {/* Previous Button */}
        <button
          className="pagination-btn prev-btn"
          onClick={handlePrevious}
          disabled={currentPage === 1}
          title="Previous Page"
        >
          ← Previous
        </button>

        {/* Page Numbers */}
        <div className="page-numbers">
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              className={`page-btn ${
                page === currentPage ? "active" : ""
              } ${page === "..." ? "ellipsis" : ""}`}
              onClick={() => {
                if (page !== "...") {
                  handlePageClick(page);
                }
              }}
              disabled={page === "..."}
              title={page === "..." ? "" : `Go to page ${page}`}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Next Button */}
        <button
          className="pagination-btn next-btn"
          onClick={handleNext}
          disabled={currentPage === totalPages}
          title="Next Page"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default Pagination;
