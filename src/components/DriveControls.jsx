import { DRIVE_STATES } from "../drive/driveSession";

function DriveControls({
  status,
  onStartDrive,
  onBeginDrive,
  onEndDrive,
  onNewDrive,
}) {
  const isIdle = status === DRIVE_STATES.IDLE;
  const isPreDriveCheck = status === DRIVE_STATES.PRE_DRIVE_CHECK;
  const isActive = status === DRIVE_STATES.ACTIVE;
  const isSummary = status === DRIVE_STATES.SUMMARY;

  if (isIdle) {
    return (
      <div className="emergency-section">
        <h2>Ready to Drive</h2>
        <p>
          Start a drive to activate vehicle and driver monitoring.
        </p>

        <button
          className="primary-button"
          onClick={onStartDrive}
        >
          🚗 Start Drive
        </button>
      </div>
    );
  }


if (isPreDriveCheck) {
  return (
    <div className="emergency-section pre-drive-check">
      <h2>🔍 Pre-Drive Check</h2>

      <p className="pre-drive-description">
        DriveX is preparing the safety monitoring system.
      </p>

      <div className="pre-drive-checks">
        <p className="pre-drive-item">
          <span>❤️</span>
          <strong>Heart Rate Source</strong>
          <em>SIMULATION</em>
          <b>✓</b>
        </p>

        <p className="pre-drive-item">
          <span>🚗</span>
          <strong>Vehicle Telemetry</strong>
          <em>Ready</em>
          <b>✓</b>
        </p>

        <p className="pre-drive-item">
          <span>🛡️</span>
          <strong>Risk Engine</strong>
          <em>Ready</em>
          <b>✓</b>
        </p>

        <p className="pre-drive-item">
          <span>📷</span>
          <strong>Driver Camera</strong>
          <em>Ready</em>
          <b>✓</b>
        </p>

        <p className="pre-drive-item">
          <span>📍</span>
          <strong>Live GPS</strong>
          <em>Ready</em>
          <b>✓</b>
        </p>
      </div>

      <button
        className="primary-button pre-drive-button"
        onClick={onBeginDrive}
      >
        ▶️ Begin Drive
      </button>
    </div>
  );
}

  if (isActive) {
    return (
      <div className="emergency-section">
        <h2>🚗 Active Drive</h2>
        <p>
          Vehicle and driver safety monitoring is currently active.
        </p>

        <button
          className="primary-button"
          onClick={onEndDrive}
        >
          🛑 End Drive
        </button>
      </div>
    );
  }

  if (isSummary) {
    return (
      <div className="emergency-section">
        <h2>📊 Drive Summary</h2>
        <p>
          The drive has ended. Drive history and analytics will be
          connected here.
        </p>

        <button
          className="primary-button"
          onClick={onNewDrive}
        >
          🚗 Start New Drive
        </button>
      </div>
    );
  }

  return null;
}

export default DriveControls;