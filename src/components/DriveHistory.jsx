function DriveHistory({
  drives,
  onClearHistory,
}) {
  const handleClearHistory = () => {
    const confirmed = window.confirm(
      "Are you sure you want to clear all Drive History?"
    );

    if (!confirmed) {
      return;
    }

    onClearHistory();
  };

  const formatDateTime = (timestamp) => {
    if (!timestamp) {
      return "Not available";
    }

    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(timestamp));
  };

  return (
    <div className="history-section">
      <div className="history-header">
        <div>
          <h2>🚗 Drive History</h2>

          <p>
            Your completed DriveX drives.
          </p>
        </div>

        {drives.length > 0 && (
          <button
            className="clear-history-button"
            onClick={handleClearHistory}
          >
            🗑️ Clear History
          </button>
        )}
      </div>

      {drives.length === 0 ? (
        <p className="empty-history">
          No completed drives recorded.
        </p>
      ) : (
        drives.map((drive) => (
          <div
            className="history-card"
            key={drive.id}
          >
            <div>
              <h3>🚗 Drive</h3>

              <p>
                Started:{" "}
                {formatDateTime(
                  drive.startedAt
                )}
              </p>

              <p>
                Ended:{" "}
                {formatDateTime(
                  drive.endedAt
                )}
              </p>
            </div>

            <div className="drive-history-stats">
              <span>
                🏎️ Max Speed:{" "}
                <strong>
                  {drive.maxSpeed} km/h
                </strong>
              </span>

              <span>
                ❤️ Max Heart Rate:{" "}
                <strong>
                  {drive.maxHeartRate} BPM
                </strong>
              </span>

              <span>
                🛡️ Highest Risk:{" "}
                <strong>
                  {drive.highestRiskScore}/10
                </strong>
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default DriveHistory;
