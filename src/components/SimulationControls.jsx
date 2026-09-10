function SimulationControls({ onSimulate, disabled = false }) {
  return (
    <div className="simulation-controls">
      <div className="simulation-header">
        <div>
          <h2>🎛️ Simulation Controls</h2>
          <p>
            Manually simulate vehicle and driver events
          </p>
        </div>

        <span className="simulation-badge">
          DEMO MODE
        </span>
      </div>

      <div className="simulation-buttons">
        <button
          className="simulation-button normal"
          onClick={() => onSimulate("Normal")}
          disabled={disabled}
        >
          🟢 Normal Driving
        </button>

        <button
          className="simulation-button"
          onClick={() => onSimulate("Sudden Acceleration")}
          disabled={disabled}
        >
          ⚡ Sudden Acceleration
        </button>

        <button
          className="simulation-button"
          onClick={() => onSimulate("Sudden Braking")}
          disabled={disabled}
        >
          🛑 Sudden Braking
        </button>

        <button
          className="simulation-button"
          onClick={() => onSimulate("Driver Stress")}
          disabled={disabled}
        >
          ❤️ Driver Stress
        </button>

        <button
          className="simulation-button"
          onClick={() => onSimulate("Abnormal Motion")}
          disabled={disabled}
        >
          📐 Abnormal Motion
        </button>

        <button
          className="simulation-button danger"
          onClick={() => onSimulate("Accident")}
          disabled={disabled}
        >
          🚨 Simulate Accident
        </button>
      </div>
    </div>
  );
}

export default SimulationControls;