import "./EmptyState.css";

function EmptyState({ title, message, icon }) {
  return (
    <div className="empty-state-container">
      <div className="empty-state-icon">{icon || "📭"}</div>
      <p className="empty-state-title">{title}</p>
      <p className="empty-state-message">{message}</p>
    </div>
  );
}

export default EmptyState;
