import { useEffect, useState } from "react";

function SensorGraph({ vehicle }) {
  const [heartRateData, setHeartRateData] = useState([]);
  const [speedData, setSpeedData] = useState([]);

  useEffect(() => {
    setHeartRateData((prev) => [
      ...prev,
      vehicle.heartRate,
    ].slice(-20));

    setSpeedData((prev) => [
      ...prev,
      vehicle.speed,
    ].slice(-20));
  }, [vehicle.heartRate, vehicle.speed]);

  const maxHeartRate = Math.max(
    ...heartRateData,
    100
  );

  const maxSpeed = Math.max(
    ...speedData,
    100
  );

  const createPoints = (data, maxValue) => {
    if (data.length < 2) return "";

    const width = 500;
    const height = 180;

    return data
      .map((value, index) => {
        const x =
          (index / (data.length - 1)) *
          width;

        const y =
          height -
          (value / maxValue) * height;

        return `${x},${y}`;
      })
      .join(" ");
  };

  return (
    <div className="sensor-graphs">

      {/* =========================
          HEART RATE GRAPH
          ========================= */}

      <div className="graph-card">

        <div className="graph-header">

          <div>
            <h2>❤️ Heart Rate</h2>

            <p>
              Live driver monitoring
            </p>
          </div>

          <strong>
            {vehicle.heartRate} BPM
          </strong>

        </div>

        <svg
          viewBox="0 0 500 180"
          className="sensor-svg"
          preserveAspectRatio="none"
        >

          <line
            x1="0"
            y1="45"
            x2="500"
            y2="45"
            className="graph-grid"
          />

          <line
            x1="0"
            y1="90"
            x2="500"
            y2="90"
            className="graph-grid"
          />

          <line
            x1="0"
            y1="135"
            x2="500"
            y2="135"
            className="graph-grid"
          />

          {heartRateData.length >= 2 && (
            <polyline
              points={createPoints(
                heartRateData,
                maxHeartRate
              )}
              className="heart-line"
              fill="none"
            />
          )}

        </svg>

      </div>

      {/* =========================
          SPEED GRAPH
          ========================= */}

      <div className="graph-card">

        <div className="graph-header">

          <div>
            <h2>🚗 Vehicle Speed</h2>

            <p>
              Live vehicle telemetry
            </p>
          </div>

          <strong>
            {vehicle.speed} km/h
          </strong>

        </div>

        <svg
          viewBox="0 0 500 180"
          className="sensor-svg"
          preserveAspectRatio="none"
        >

          <line
            x1="0"
            y1="45"
            x2="500"
            y2="45"
            className="graph-grid"
          />

          <line
            x1="0"
            y1="90"
            x2="500"
            y2="90"
            className="graph-grid"
          />

          <line
            x1="0"
            y1="135"
            x2="500"
            y2="135"
            className="graph-grid"
          />

          {speedData.length >= 2 && (
            <polyline
              points={createPoints(
                speedData,
                maxSpeed
              )}
              className="speed-line"
              fill="none"
            />
          )}

        </svg>

      </div>

    </div>
  );
}

export default SensorGraph;