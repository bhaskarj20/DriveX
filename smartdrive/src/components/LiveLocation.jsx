import { useEffect, useState } from "react";

function LiveLocation() {
  const [position, setPosition] = useState({
    x: 50,
    y: 50,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((prev) => ({
        x: Math.min(
          90,
          Math.max(10, prev.x + (Math.random() * 6 - 3))
        ),

        y: Math.min(
          90,
          Math.max(10, prev.y + (Math.random() * 6 - 3))
        ),
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="live-location">

      {/* Header */}

      <div className="location-header">

        <div>
          <h2>📍 Live Vehicle Location</h2>

          <p>
            Simulated GPS tracking
          </p>
        </div>

        <div className="gps-status">
          <span className="gps-dot"></span>
          GPS Active
        </div>

      </div>

      {/* Map */}

      <div className="simulated-map">

        {/* Roads */}

        <div className="road road-horizontal road-one"></div>

        <div className="road road-horizontal road-two"></div>

        <div className="road road-vertical road-three"></div>

        <div className="road road-vertical road-four"></div>

        <div className="road road-diagonal"></div>

        {/* Map labels */}

        <span className="map-label label-one">
          Park Street
        </span>

        <span className="map-label label-two">
          Main Road
        </span>

        <span className="map-label label-three">
          City Center
        </span>

        {/* Vehicle */}

        <div
          className="vehicle-marker"
          style={{
            left: `${position.x}%`,
            top: `${position.y}%`,
          }}
        >
          🚗
        </div>

      </div>

      {/* Location information */}

      <div className="location-info">

        <div className="location-item">

          <span>📍</span>

          <div>
            <strong>Current Location</strong>

            <p>
              Kolkata, West Bengal
            </p>
          </div>

        </div>

        <div className="location-item">

          <span>📡</span>

          <div>
            <strong>GPS Signal</strong>

            <p>
              Strong
            </p>
          </div>

        </div>

        <div className="location-item">

          <span>🔄</span>

          <div>
            <strong>Last Updated</strong>

            <p>
              Just now
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default LiveLocation;