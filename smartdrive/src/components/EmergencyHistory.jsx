function EmergencyHistory({ history }) {
  return (
    <div className="history-section">
      <h2>📋 Emergency History</h2>

      {history.length === 0 ? (
        <p className="empty-history">
          No emergency events recorded.
        </p>
      ) : (
        history.map((event) => (
          <div className="history-card" key={event.id}>
            <div>
              <h3>🚨 {event.type}</h3>
              <p>{event.date}</p>
              <p>📍 {event.location}</p>
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