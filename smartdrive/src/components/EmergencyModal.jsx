import { useEffect, useState } from "react";

function EmergencyModal({ onCancel }) {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (countdown === 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  return (
    <div className="modal-overlay">
      <div className="emergency-modal">
        {countdown > 0 ? (
          <>
            <div className="emergency-icon">🚨</div>

            <h2>Emergency Detected</h2>

            <p>
              A possible accident has been detected.
            </p>

            <div className="countdown">
              {countdown}
            </div>

            <p>
              Are you safe?
            </p>

            <button
              className="safe-button"
              onClick={onCancel}
            >
              I'm Safe
            </button>
          </>
        ) : (
          <>
            <div className="emergency-icon">🚨</div>

            <h2>Emergency Activated</h2>

            <p>Emergency response has been initiated.</p>

            <div className="alert-status">
              <p>✓ Emergency contact notified</p>
              <p>✓ Authority notification simulated</p>
              <p>✓ Location shared</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default EmergencyModal;