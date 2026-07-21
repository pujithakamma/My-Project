import React from "react";
import "./Loader.css";

/**
 * Loader Component - Shows loading spinner with message
 * @param {Object} props - Component props
 * @param {boolean} props.isLoading - Whether to show loader
 * @param {string} props.message - Optional loading message
 */
const Loader = ({ isLoading = false, message = "Loading..." }) => {
  if (!isLoading) return null;

  return (
    <div className="loader-overlay">
      <div className="loader-container">
        <div className="spinner"></div>
        <p className="loader-message">{message}</p>
      </div>
    </div>
  );
};

export default Loader;
