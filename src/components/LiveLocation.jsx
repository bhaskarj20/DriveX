import { useEffect, useState } from "react";

import "leaflet/dist/leaflet.css";

import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  LayersControl,
  useMap,
} from "react-leaflet";

function MapUpdater({ location, visible }) {
  const map = useMap();

  useEffect(() => {
    if (!visible) {
      return;
    }

    // Give the browser time to apply the visible layout
    const timer = setTimeout(() => {
      map.invalidateSize();

      if (
        location.latitude !== null &&
        location.longitude !== null
      ) {
        map.setView(
          [location.latitude, location.longitude],
          16
        );
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [location, visible, map]);

  return null;
}

function LiveLocation({
  active,
  visible = true,
  onLocationChange,
}) {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    accuracy: null,
  });

  const [gpsStatus, setGpsStatus] =
    useState("GPS Inactive");

  const [lastUpdated, setLastUpdated] =
    useState(null);

  const [error, setError] = useState("");

  // GPS tracking
  useEffect(() => {
    // Drive ended / GPS inactive
    if (!active) {
      setGpsStatus("GPS Inactive");
      setError("");

      // Clear previous GPS location
      const emptyLocation = {
        latitude: null,
        longitude: null,
        accuracy: null,
      };

      setLocation(emptyLocation);
      setLastUpdated(null);

      // Tell Dashboard that there is no active location
      if (onLocationChange) {
        onLocationChange(emptyLocation);
      }

      return;
    }

    if (!navigator.geolocation) {
      setGpsStatus("GPS Unavailable");
      setError(
        "Geolocation is not supported by this browser."
      );
      return;
    }

    setGpsStatus("Requesting GPS...");
    setError("");

    const watchId =
      navigator.geolocation.watchPosition(
        (currentPosition) => {
          const {
            latitude,
            longitude,
            accuracy,
          } = currentPosition.coords;

          const newLocation = {
            latitude,
            longitude,
            accuracy,
          };

          setLocation(newLocation);

          // Send latest GPS location to Dashboard
          if (onLocationChange) {
            onLocationChange(newLocation);
          }

          setGpsStatus("GPS Active");

          setLastUpdated(
            new Date().toLocaleTimeString()
          );

          setError("");
        },

        (geoError) => {
          setGpsStatus("GPS Error");

          if (geoError.code === 1) {
            setError(
              "Location permission was denied."
            );
          } else if (geoError.code === 2) {
            setError(
              "Current location is unavailable."
            );
          } else if (geoError.code === 3) {
            setError(
              "Location request timed out."
            );
          } else {
            setError(
              "Unable to get current location."
            );
          }
        },

        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 5000,
        }
      );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [active, onLocationChange]);

  const hasLocation =
    location.latitude !== null &&
    location.longitude !== null;

  return (
    <div className="live-location">
      {/* Header */}
      <div className="location-header">
        <div>
          <h2>📍 Live Vehicle Location</h2>

          <p>
            {active
              ? "Real-time GPS tracking"
              : "GPS tracking inactive"}
          </p>
        </div>

        <div className="gps-status">
          <span
            className={`gps-dot ${
              active ? "gps-active" : ""
            }`}
          ></span>

          {gpsStatus}
        </div>
      </div>

      {/* Real Map */}
      <div
        style={{
          height: "400px",
          width: "100%",
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        <MapContainer
          center={[22.5726, 88.3639]}
          zoom={13}
          scrollWheelZoom={true}
          style={{
            height: "100%",
            width: "100%",
          }}
        >
          <LayersControl position="topright">
            {/* Default */}
            <LayersControl.BaseLayer
              checked
              name="🗺️ Default"
            >
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                maxZoom={19}
              />
            </LayersControl.BaseLayer>

            {/* Satellite */}
            <LayersControl.BaseLayer
              name="🛰️ Satellite"
            >
              <TileLayer
                attribution="Tiles &copy; Esri"
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                maxZoom={19}
              />
            </LayersControl.BaseLayer>
          </LayersControl>

          <MapUpdater
            location={location}
            visible={visible}
          />

          {hasLocation && (
            <CircleMarker
              center={[
                location.latitude,
                location.longitude,
              ]}
              radius={10}
            >
              <Popup>
                <strong>
                  DriveX Vehicle
                </strong>

                <br />

                Current GPS location

                <br />

                Accuracy: ±
                {Math.round(location.accuracy)}
                m
              </Popup>
            </CircleMarker>
          )}
        </MapContainer>
      </div>

      {/* Location Information */}
      <div className="location-info">
        <div className="location-item">
          <span>📍</span>

          <div>
            <strong>Current Location</strong>

            {hasLocation ? (
              <p>
                {location.latitude.toFixed(6)},{" "}
                {location.longitude.toFixed(6)}
              </p>
            ) : (
              <p>
                {active
                  ? "Waiting for GPS..."
                  : "Drive not active"}
              </p>
            )}
          </div>
        </div>

        <div className="location-item">
          <span>📡</span>

          <div>
            <strong>GPS Signal</strong>

            <p>
              {hasLocation
                ? `Accuracy ±${Math.round(
                    location.accuracy
                  )} m`
                : gpsStatus}
            </p>
          </div>
        </div>

        <div className="location-item">
          <span>🔄</span>

          <div>
            <strong>Last Updated</strong>

            <p>
              {lastUpdated || "Not available"}
            </p>
          </div>
        </div>
      </div>

      {/* GPS Error */}
      {error && (
        <div className="location-error">
          {error}
        </div>
      )}
    </div>
  );
}

export default LiveLocation;