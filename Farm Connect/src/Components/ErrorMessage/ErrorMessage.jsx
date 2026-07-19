import "./ErrorMessage.css";

function ErrorMessage({ error, onRetry }) {
  return (
    <div className="error-message-container">
      <div className="error-icon">⚠️</div>
      <p className="error-title">Oops! Something went wrong</p>
      <p className="error-text">{error}</p>
      {onRetry && (
        <button className="error-retry-btn" onClick={onRetry}>
          🔄 Retry
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
