function LiveSensorMonitor({ vehicle }) {
  const heartRateSource =
    vehicle.heartRateSource || "SIMULATION";

  return (
    <div className="sensor-monitor">
      <div className="sensor-monitor-header">
        <div>
          <h2>📡 Live Sensor Monitor</h2>
          <p>Real-time virtual vehicle telemetry</p>
        </div>

        <div className="sensor-live-status">
          <span className="sensor-live-dot"></span>
          LIVE
        </div>
      </div>

      <div className="sensor-grid">
        {/* Heart Rate */}
        <div className="sensor-card">
          <div className="sensor-icon">❤️</div>

          <div className="sensor-info">
            <h3>Heart Rate</h3>

            <div className="sensor-value">
              {vehicle.heartRate}
              <span>BPM</span>
            </div>

            <small>
              Source: {heartRateSource}
            </small>

            <div className="sensor-bar">
              <div
                className="sensor-bar-fill"
                style={{
                  width: `${Math.min(
                    (vehicle.heartRate / 140) * 100,
                    100
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Speed */}
        <div className="sensor-card">
          <div className="sensor-icon">🚗</div>

          <div className="sensor-info">
            <h3>Vehicle Speed</h3>

            <div className="sensor-value">
              {vehicle.speed}
              <span>km/h</span>
            </div>

            <div className="sensor-bar">
              <div
                className="sensor-bar-fill"
                style={{
                  width: `${Math.min(
                    (vehicle.speed / 120) * 100,
                    100
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Temperature */}
        <div className="sensor-card">
          <div className="sensor-icon">🌡️</div>

          <div className="sensor-info">
            <h3>Temperature</h3>

            <div className="sensor-value">
              {vehicle.temperature}
              <span>°C</span>
            </div>

            <div className="sensor-bar">
              <div
                className="sensor-bar-fill"
                style={{
                  width: `${Math.min(
                    (vehicle.temperature / 50) * 100,
                    100
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Battery */}
        <div className="sensor-card">
          <div className="sensor-icon">🔋</div>

          <div className="sensor-info">
            <h3>Battery</h3>

            <div className="sensor-value">
              {vehicle.battery}
              <span>%</span>
            </div>

            <div className="sensor-bar">
              <div
                className="sensor-bar-fill"
                style={{
                  width: `${vehicle.battery}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Motion + Event */}
      <div className="sensor-status-row">
        <div className="sensor-status-item">
          <span>📐 Motion</span>
          <strong>{vehicle.motion}</strong>
        </div>

        <div className="sensor-status-item">
          <span>⚠️ Current Event</span>
          <strong>{vehicle.event}</strong>
        </div>
      </div>
    </div>
  );
}

export default LiveSensorMonitor;