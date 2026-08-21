function SimulationControls({ onSimulate }) {
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
        >
          🟢 Normal Driving
        </button>

        <button
          className="simulation-button"
          onClick={() => onSimulate("Sudden Acceleration")}
        >
          ⚡ Sudden Acceleration
        </button>

        <button
          className="simulation-button"
          onClick={() => onSimulate("Sudden Braking")}
        >
          🛑 Sudden Braking
        </button>

        <button
          className="simulation-button"
          onClick={() => onSimulate("Driver Stress")}
        >
          ❤️ Driver Stress
        </button>

        <button
          className="simulation-button"
          onClick={() => onSimulate("Abnormal Motion")}
        >
          📐 Abnormal Motion
        </button>

        <button
          className="simulation-button danger"
          onClick={() => onSimulate("Accident")}
        >
          🚨 Simulate Accident
        </button>

      </div>

    </div>
  );
}

export default SimulationControls;