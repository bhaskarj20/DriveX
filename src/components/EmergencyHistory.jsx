function EmergencyHistory({
  history,
  onClearHistory,
}) {
  const handleClearHistory = () => {
    const confirmed = window.confirm(
      "Are you sure you want to clear all Emergency History?"
    );

    if (!confirmed) {
      return;
    }

    onClearHistory();
  };

  return (
    <div className="history-section">
      <div className="history-header">
        <div>
          <h2>📋 Emergency History</h2>

          <p>
            Recorded emergency events.
          </p>
        </div>

        {history.length > 0 && (
          <button
            className="clear-history-button"
            onClick={handleClearHistory}
          >
            🗑️ Clear History
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <p className="empty-history">
          No emergency events recorded.
        </p>
      ) : (
        history.map((event) => (
          <div
            className="history-card"
            key={event.id}
          >
            <div>
              <h3>🚨 {event.type}</h3>

              <p>{event.date}</p>

              <p>
                📍 {event.location}
              </p>
            </div>

            <span className="history-status">
              {event.status}
            </span>
          </div>
        ))
      )}
    </div>
  );
}

export default EmergencyHistory;