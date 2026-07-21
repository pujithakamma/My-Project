import React, { useState, useCallback } from "react";
import "./SearchAndSort.css";

/**
 * SearchAndSort Component
 * @param {Object} props - Component props
 * @param {string} props.searchValue - Current search value
 * @param {function} props.onSearchChange - Callback for search input change
 * @param {string} props.sortField - Current sort field
 * @param {function} props.onSortChange - Callback for sort field change
 * @param {string} props.sortOrder - Current sort order ("asc" or "desc")
 * @param {function} props.onOrderChange - Callback for sort order change
 * @param {number} props.pageSize - Records per page
 * @param {function} props.onPageSizeChange - Callback for page size change
 * @param {function} props.onReset - Callback to reset all filters
 * @param {Array} props.sortOptions - Available sort fields [{label, value}]
 */
const SearchAndSort = ({
  searchValue = "",
  onSearchChange,
  sortField = "fullName",
  onSortChange,
  sortOrder = "asc",
  onOrderChange,
  pageSize = 10,
  onPageSizeChange,
  onReset,
  sortOptions = []
}) => {
  const [searchInput, setSearchInput] = useState(searchValue);

  // Debounce search to avoid too many API calls
  const debounceTimer = React.useRef(null);

  const handleSearchInputChange = useCallback(
    (e) => {
      const value = e.target.value;
      setSearchInput(value);

      // Clear previous timer
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      // Set new timer for debounced search (500ms)
      debounceTimer.current = setTimeout(() => {
        onSearchChange(value);
      }, 500);
    },
    [onSearchChange]
  );

  const handleReset = () => {
    setSearchInput("");
    if (onReset) {
      onReset();
    }
  };

  return (
    <div className="search-sort-container">
      {/* Search Section */}
      <div className="search-section">
        <input
          type="text"
          className="search-input"
          placeholder="Search by name, email, mobile, village, or farm..."
          value={searchInput}
          onChange={handleSearchInputChange}
        />
        <span className="search-icon">🔍</span>
      </div>

      {/* Controls Section */}
      <div className="controls-section">
        {/* Sort Field */}
        <div className="sort-group">
          <label htmlFor="sort-field">Sort By:</label>
          <select
            id="sort-field"
            className="sort-select"
            value={sortField}
            onChange={(e) => onSortChange(e.target.value)}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Order */}
        <div className="sort-group">
          <label htmlFor="sort-order">Order:</label>
          <select
            id="sort-order"
            className="sort-select"
            value={sortOrder}
            onChange={(e) => onOrderChange(e.target.value)}
          >
            <option value="asc">↑ Ascending</option>
            <option value="desc">↓ Descending</option>
          </select>
        </div>

        {/* Page Size */}
        <div className="sort-group">
          <label htmlFor="page-size">Per Page:</label>
          <select
            id="page-size"
            className="sort-select"
            value={pageSize}
            onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>

        {/* Reset Button */}
        <button className="reset-btn" onClick={handleReset} title="Reset all filters">
          ↻ Reset
        </button>
      </div>
    </div>
  );
};

export default SearchAndSort;
