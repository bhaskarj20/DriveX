import { useCallback, useEffect, useRef, useState } from "react";

import CameraView from "../camera/CameraView";
import LiveLocation from "../components/LiveLocation";
import LiveSensorMonitor from "../components/LiveSensorMonitor";
import SimulationControls from "../components/SimulationControls";
import DriveControls from "../components/DriveControls";
import DriveHistory from "../components/DriveHistory";
import RiskScore from "../components/RiskScore";
import SensorGraph from "../components/SensorGraph";
import AIAssistant from "../components/AIAssistant";
import EmergencyContacts from "../components/EmergencyContacts";
import EmergencyHistory from "../components/EmergencyHistory";
import EmergencyModal from "../components/EmergencyModal";
import DriverProfile from "../components/DriverProfile";
import VehicleProfile from "../components/VehicleProfile";

import {
  DRIVE_STATES,
  createDriveSession,
  endDrive,
} from "../drive/driveSession";

import {
  triggerSimulationEvent,
  startVehicleSimulator,
} from "../simulator/vehicleSimulator";

import {
  createTelemetry,
  sendTelemetry,
} from "../telemetry/telemetry";

import {
  calculateRisk,
  sendRiskEvent,
} from "../detection/emergencyDetector";

import {
  DRIVER_STATES,
  createDriverStateData,
  sendDriverStateEvent,
} from "../driverState/driverState";

function Dashboard({ onLogout }) {
  const [driveSession, setDriveSession] =
    useState(createDriveSession());

  const [driverProfileId, setDriverProfileId] =
    useState(null);

  const [vehicle, setVehicle] = useState({
    speed: 0,
    temperature: 0,
    heartRate: 0,
    heartRateSource: "SIMULATION",
    heartRateTimestamp: null,
    motion: "Stationary",
    battery: 0,
    emergency: false,
    event: "Normal",
    dataSource: "SIMULATION",
  });

  const [driverState, setDriverState] =
    useState(
      createDriverStateData({
        state: DRIVER_STATES.ALERT,
        confidence: 0,
        source: "CAMERA",
      })
    );

  const [risk, setRisk] = useState({
    riskScore: 0,
    riskLevel: "Low",
    emergency: false,
    reasons: [],
    signals: {},
  });

  const [emergency, setEmergency] =
    useState(false);

  const [emergencyReason, setEmergencyReason] =
    useState("");

  // 13V-5 — Latest live GPS location
  const [liveLocation, setLiveLocation] =
    useState({
      latitude: null,
      longitude: null,
      accuracy: null,
    });

  // Keep the latest GPS location available
  // to callbacks without restarting the simulator.
  const liveLocationRef = useRef({
    latitude: null,
    longitude: null,
    accuracy: null,
  });

  const handleLiveLocationChange = useCallback(
    (newLocation) => {
      liveLocationRef.current = newLocation;
      setLiveLocation(newLocation);
    },
    []
  );

  // 13V-4 — Load Emergency History
  const [history, setHistory] = useState(() => {
    try {
      const savedHistory =
        localStorage.getItem(
          "drivexEmergencyHistory"
        );

      return savedHistory
        ? JSON.parse(savedHistory)
        : [];
    } catch (error) {
      console.error(
        "Failed to load Emergency History:",
        error
      );

      return [];
    }
  });

  // 13V-4 — Save Emergency History
  useEffect(() => {
    try {
      localStorage.setItem(
        "drivexEmergencyHistory",
        JSON.stringify(history)
      );
    } catch (error) {
      console.error(
        "Failed to save Emergency History:",
        error
      );
    }
  }, [history]);

  const [driveHistory, setDriveHistory] =
    useState(() => {
      try {
        const savedHistory =
          localStorage.getItem(
            "drivexDriveHistory"
          );

        return savedHistory
          ? JSON.parse(savedHistory)
          : [];
      } catch (error) {
        console.error(
          "Failed to load Drive History:",
          error
        );

        return [];
      }
    });

  useEffect(() => {
    try {
      localStorage.setItem(
        "drivexDriveHistory",
        JSON.stringify(driveHistory)
      );
    } catch (error) {
      console.error(
        "Failed to save Drive History:",
        error
      );
    }
  }, [driveHistory]);

  const [activeSection, setActiveSection] =
    useState("overview");

  const [graphResetKey, setGraphResetKey] =
    useState(0);

  const [darkMode, setDarkMode] =
    useState(false);

  const driverStateRef =
    useRef(driverState);

  const lastEmergencyEvent =
    useRef(null);

  const driveStatsRef = useRef({
    startedAt: null,
    endedAt: null,
    maxSpeed: 0,
    maxHeartRate: 0,
    highestRiskScore: 0,
  });

  // Keep driver state ref synchronized
  useEffect(() => {
    driverStateRef.current =
      driverState;
  }, [driverState]);

  // Load the logged-in driver's profile ID
  useEffect(() => {
    const loadDriverProfileId =
      async () => {
        try {
          const savedUser =
            localStorage.getItem(
              "drivexUser"
            );

          if (!savedUser) {
            console.error(
              "DriveX user session not found."
            );

            return;
          }

          const user =
            JSON.parse(savedUser);

          if (!user?.id) {
            console.error(
              "DriveX user ID not found."
            );

            return;
          }

          const response =
            await fetch(
              `${import.meta.env.VITE_API_URL}/api/driver/profile/${user.id}`
            );

          const data =
            await response.json();

          if (!response.ok) {
            throw new Error(
              data.message ||
                "Failed to load driver profile"
            );
          }

          if (!data.profile?._id) {
            throw new Error(
              "Driver profile ID not found"
            );
          }

          setDriverProfileId(
            data.profile._id
          );
        } catch (error) {
          console.error(
            "Load driver profile ID error:",
            error
          );
        }
      };

    loadDriverProfileId();
  }, []);

  // Save telemetry to backend
  const saveTelemetry = useCallback(
    async (telemetry) => {
      if (!driverProfileId) {
        console.warn(
          "Telemetry not sent: driver profile ID is not available yet."
        );

        return;
      }

      try {
        await sendTelemetry(
          telemetry,
          driverProfileId
        );

        console.log(
          "Telemetry saved successfully."
        );
      } catch (error) {
        console.error(
          "Telemetry save error:",
          error
        );
      }
    },
    [driverProfileId]
  );

  // Save driver state event to backend
  const saveDriverStateEvent =
    useCallback(
      async (newDriverState) => {
        if (
          driveSession.status !==
          DRIVE_STATES.ACTIVE
        ) {
          return;
        }

        if (!driverProfileId) {
          console.warn(
            "Driver state event not sent: driver profile ID is not available yet."
          );

          return;
        }

        try {
          await sendDriverStateEvent(
            newDriverState,
            driverProfileId
          );

          console.log(
            "Driver state event saved successfully."
          );
        } catch (error) {
          console.error(
            "Driver state event save error:",
            error
          );
        }
      },
      [
        driverProfileId,
        driveSession.status,
      ]
    );

  // Save risk event to backend
  const saveRiskEvent = useCallback(
    async (riskResult) => {
      if (
        driveSession.status !==
        DRIVE_STATES.ACTIVE
      ) {
        return;
      }

      if (!driverProfileId) {
        console.warn(
          "Risk event not sent: driver profile ID is not available yet."
        );

        return;
      }

      try {
        await sendRiskEvent(
          riskResult,
          driverProfileId
        );

        console.log(
          "Risk event saved successfully."
        );
      } catch (error) {
        console.error(
          "Risk event save error:",
          error
        );
      }
    },
    [
      driverProfileId,
      driveSession.status,
    ]
  );

  // Reset vehicle
  const resetVehicle = useCallback(() => {
    setVehicle({
      speed: 0,
      temperature: 0,
      heartRate: 0,
      heartRateSource: "SIMULATION",
      heartRateTimestamp: null,
      motion: "Stationary",
      battery: 0,
      emergency: false,
      event: "Normal",
      dataSource: "SIMULATION",
    });
  }, []);

  // Reset driver state
  const resetDriverState =
    useCallback(() => {
      const resetState =
        createDriverStateData({
          state: DRIVER_STATES.ALERT,
          confidence: 0,
          source: "CAMERA",
        });

      driverStateRef.current =
        resetState;

      setDriverState(resetState);
    }, []);

  // Reset risk
  const resetRisk = useCallback(() => {
    setRisk({
      riskScore: 0,
      riskLevel: "Low",
      emergency: false,
      reasons: [],
      signals: {},
    });
  }, []);

  // Driver state change
  const handleDriverStateChange =
    useCallback(
      (newDriverState) => {
        driverStateRef.current =
          newDriverState;

        setDriverState(
          newDriverState
        );

        saveDriverStateEvent(
          newDriverState
        );

        const telemetry =
          createTelemetry(vehicle);

        const riskResult =
          calculateRisk(
            telemetry,
            newDriverState
          );

        setRisk(riskResult);

        driveStatsRef.current.highestRiskScore =
          Math.max(
            driveStatsRef.current
              .highestRiskScore,
            riskResult.riskScore
          );

        saveRiskEvent(
          riskResult
        );
      },
      [
        vehicle,
        saveDriverStateEvent,
        saveRiskEvent,
      ]
    );

  // Start Drive -> Pre-Drive Check
  const handleStartDrive = () => {
    setDriveSession((prev) => ({
      ...prev,
      status:
        DRIVE_STATES.PRE_DRIVE_CHECK,
    }));
  };

  // Begin Drive -> Active Drive
  const handleBeginDrive = () => {
    driveStatsRef.current = {
      startedAt:
        new Date().toISOString(),
      endedAt: null,
      maxSpeed: 0,
      maxHeartRate: 0,
      highestRiskScore: 0,
    };

    const newVehicleData =
      triggerSimulationEvent(
        "Normal"
      );

    setVehicle(newVehicleData);

    driveStatsRef.current.maxSpeed =
      Math.max(
        driveStatsRef.current.maxSpeed,
        newVehicleData.speed
      );

    driveStatsRef.current.maxHeartRate =
      Math.max(
        driveStatsRef.current.maxHeartRate,
        newVehicleData.heartRate
      );

    const telemetry =
      createTelemetry(
        newVehicleData
      );

    saveTelemetry(telemetry);

    const currentDriverState =
      driverStateRef.current;

    const riskResult =
      calculateRisk(
        telemetry,
        currentDriverState
      );

    driveStatsRef.current.highestRiskScore =
      Math.max(
        driveStatsRef.current
          .highestRiskScore,
        riskResult.riskScore
      );

    setRisk(riskResult);

    setDriveSession((prev) => ({
      ...prev,
      status:
        DRIVE_STATES.ACTIVE,
    }));

    saveRiskEvent(riskResult);
  };

  // End Drive
  const handleEndDrive = () => {
    driveStatsRef.current.endedAt =
      new Date().toISOString();

    const completedDrive = {
      id: Date.now(),
      startedAt:
        driveStatsRef.current.startedAt,
      endedAt:
        driveStatsRef.current.endedAt,
      maxSpeed:
        driveStatsRef.current.maxSpeed,
      maxHeartRate:
        driveStatsRef.current.maxHeartRate,
      highestRiskScore:
        driveStatsRef.current
          .highestRiskScore,
    };

    setDriveHistory((prev) => [
      completedDrive,
      ...prev,
    ]);

    driveStatsRef.current = {
      startedAt: null,
      endedAt: null,
      maxSpeed: 0,
      maxHeartRate: 0,
      highestRiskScore: 0,
    };

    setDriveSession((prev) =>
      endDrive(prev)
    );

    resetVehicle();
    resetRisk();
    resetDriverState();

    setEmergency(false);
    setEmergencyReason("");

    const emptyLocation = {
      latitude: null,
      longitude: null,
      accuracy: null,
    };

    liveLocationRef.current =
      emptyLocation;

    setLiveLocation(emptyLocation);

    lastEmergencyEvent.current =
      null;

    setGraphResetKey(
      (prev) => prev + 1
    );
  };

  // 13U-12 — Clear Drive History
  const handleClearHistory = () => {
    setDriveHistory([]);

    try {
      localStorage.removeItem(
        "drivexDriveHistory"
      );
    } catch (error) {
      console.error(
        "Failed to clear Drive History:",
        error
      );
    }
  };

  // Start New Drive
  const handleNewDrive = () => {
    resetVehicle();
    resetRisk();
    resetDriverState();

    setEmergency(false);
    setEmergencyReason("");

    const emptyLocation = {
      latitude: null,
      longitude: null,
      accuracy: null,
    };

    liveLocationRef.current =
      emptyLocation;

    setLiveLocation(emptyLocation);

    lastEmergencyEvent.current =
      null;

    setGraphResetKey(
      (prev) => prev + 1
    );

    setDriveSession({
      ...createDriveSession(),
      status:
        DRIVE_STATES.IDLE,
    });
  };

  // Manual simulation event
  const handleSimulation = (event) => {
    if (
      driveSession.status !==
      DRIVE_STATES.ACTIVE
    ) {
      return;
    }

    const newVehicleData =
      triggerSimulationEvent(event);

    if (!newVehicleData) {
      return;
    }

    setVehicle(newVehicleData);

    driveStatsRef.current.maxSpeed =
      Math.max(
        driveStatsRef.current.maxSpeed,
        newVehicleData.speed
      );

    driveStatsRef.current.maxHeartRate =
      Math.max(
        driveStatsRef.current.maxHeartRate,
        newVehicleData.heartRate
      );

    const telemetry =
      createTelemetry(
        newVehicleData
      );

    saveTelemetry(telemetry);

    const currentDriverState =
      driverStateRef.current;

    const riskResult =
      calculateRisk(
        telemetry,
        currentDriverState
      );

    driveStatsRef.current.highestRiskScore =
      Math.max(
        driveStatsRef.current
          .highestRiskScore,
        riskResult.riskScore
      );

    setRisk(riskResult);

    saveRiskEvent(riskResult);
  };

  // Vehicle simulator
  useEffect(() => {
    if (
      driveSession.status !==
      DRIVE_STATES.ACTIVE
    ) {
      return;
    }

    const stopSimulator =
      startVehicleSimulator(
        (newVehicleData) => {
          setVehicle(
            newVehicleData
          );

          driveStatsRef.current.maxSpeed =
            Math.max(
              driveStatsRef.current
                .maxSpeed,
              newVehicleData.speed
            );

          driveStatsRef.current.maxHeartRate =
            Math.max(
              driveStatsRef.current
                .maxHeartRate,
              newVehicleData.heartRate
            );

          const telemetry =
            createTelemetry(
              newVehicleData
            );

          saveTelemetry(
            telemetry
          );

          const currentDriverState =
            driverStateRef.current;

          const riskResult =
            calculateRisk(
              telemetry,
              currentDriverState
            );

          driveStatsRef.current.highestRiskScore =
            Math.max(
              driveStatsRef.current
                .highestRiskScore,
              riskResult.riskScore
            );

          setRisk(riskResult);

          saveRiskEvent(
            riskResult
          );

          const criticalDriver =
            currentDriverState.state ===
            DRIVER_STATES.CRITICAL;

          const emergencyTrigger =
            riskResult.emergency ||
            criticalDriver;

          const emergencyKey =
            criticalDriver
              ? "CRITICAL_DRIVER"
              : newVehicleData.event;

          if (
            emergencyTrigger &&
            (
              newVehicleData.event !==
                "Normal" ||
              criticalDriver
            ) &&
            lastEmergencyEvent.current !==
              emergencyKey
          ) {
            lastEmergencyEvent.current =
              emergencyKey;

            setEmergency(true);

            setEmergencyReason(
              criticalDriver
                ? "Critical driver state detected: drowsiness and distraction detected simultaneously."
                : riskResult.reasons.length >
                    0
                ? riskResult.reasons.join(
                    " "
                  )
                : "Emergency condition detected."
            );

            // 13V-5 — Save latest real GPS location
            const currentLocation =
              liveLocationRef.current;

            const newEvent = {
              id: Date.now(),

              type: criticalDriver
                ? "Automatic Detection: Critical Driver State"
                : `Automatic Detection: ${newVehicleData.event}`,

              date:
                new Date().toLocaleString(),

              location:
                currentLocation.latitude !==
                  null &&
                currentLocation.longitude !==
                  null
                  ? `${currentLocation.latitude.toFixed(
                      6
                    )}, ${currentLocation.longitude.toFixed(
                      6
                    )}`
                  : "Location unavailable",

              status:
                "Emergency Automatically Detected",
            };

            setHistory((prev) => [
              newEvent,
              ...prev,
            ]);
          }

          if (
            newVehicleData.event ===
              "Normal" &&
            !criticalDriver
          ) {
            lastEmergencyEvent.current =
              null;
          }
        }
      );

    return stopSimulator;
  }, [
    driveSession.status,
    saveTelemetry,
    saveRiskEvent,
  ]);

  // 13V-3 — Emergency Recovery
  const handleCloseEmergency = () => {
    setEmergency(false);
    setEmergencyReason("");

    resetRisk();

    setVehicle((prev) => ({
      ...prev,
      emergency: false,
    }));

    lastEmergencyEvent.current =
      null;
  };

  const isDriveActive =
    driveSession.status ===
    DRIVE_STATES.ACTIVE;

  return (
    <div
      className={`dashboard-app ${
        darkMode
          ? "dark-mode"
          : "light-mode"
      }`}
    >
      <aside className="dashboard-sidebar">
        <div className="sidebar-theme">
          <button
            className="theme-toggle"
            onClick={() =>
              setDarkMode(
                (prev) => !prev
              )
            }
          >
            {darkMode
              ? "☀️ Bright Mode"
              : "🌙 Dark Mode"}
          </button>
        </div>

        <div className="sidebar-brand">
          <h1>DriveX</h1>

          <span>
            Driver Safety System
          </span>
        </div>

        <nav className="sidebar-nav">
          <button
            className={
              activeSection ===
              "overview"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveSection(
                "overview"
              )
            }
          >
            📋 Overview
          </button>

          <button
            className={
              activeSection ===
              "driver-monitoring"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveSection(
                "driver-monitoring"
              )
            }
          >
            📷 Driver Monitoring
          </button>

          <button
            className={
              activeSection ===
              "emergency-center"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveSection(
                "emergency-center"
              )
            }
          >
            🚨 Emergency Center
          </button>

          <button
            className={
              activeSection ===
              "ai-copilot"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveSection(
                "ai-copilot"
              )
            }
          >
            🤖 AI Copilot
          </button>

          <button
            className={
              activeSection ===
              "analytics"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveSection(
                "analytics"
              )
            }
          >
            📊 Driver Analytics
          </button>

          <button
            className={
              activeSection ===
              "driver-profile"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveSection(
                "driver-profile"
              )
            }
          >
            👤 Driver Profile
          </button>

          <button
            className={
              activeSection ===
              "vehicle"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveSection(
                "vehicle"
              )
            }
          >
            🚗 Vehicle
          </button>
        </nav>

        <div className="sidebar-logout">
          <button
            className="logout-button"
            onClick={onLogout}
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h1>
              Driver Safety Dashboard
            </h1>

            <p>
              Real-time vehicle and
              driver monitoring
            </p>
          </div>

          <div className="driver-status-active">
            <span className="status-dot"></span>

            <div>
              <small>
                Driver Status
              </small>

              <strong>
                {isDriveActive
                  ? "Active"
                  : "Inactive"}
              </strong>
            </div>
          </div>
        </div>

        <div className="dashboard-summary">
          <div>
            <span>
              System Status
            </span>

            <strong>
              {isDriveActive
                ? "Monitoring Active"
                : "System Ready"}
            </strong>
          </div>

          <div>
            <span>
              Driver State
            </span>

            <strong>
              {driverState.state}
            </strong>
          </div>

          <div>
            <span>
              Current Risk
            </span>

            <strong>
              {risk.riskLevel}
            </strong>
          </div>

          <div>
            <span>
              Emergency
            </span>

            <strong>
              {emergency
                ? "Detected"
                : "Normal"}
            </strong>
          </div>
        </div>

        {/* Persistent Monitoring Layer */}
        <div
          style={{
            display:
              activeSection ===
              "driver-monitoring"
                ? "block"
                : "none",
          }}
        >
          <section className="dashboard-section">
            <div className="monitoring-grid">
              <CameraView
                active={
                  driveSession.status ===
                  DRIVE_STATES.ACTIVE
                }
                onDriverStateChange={
                  handleDriverStateChange
                }
              />

              <LiveLocation
                active={
                  driveSession.status ===
                  DRIVE_STATES.ACTIVE
                }
                visible={
                  activeSection ===
                  "driver-monitoring"
                }
                onLocationChange={
                  handleLiveLocationChange
                }
              />
            </div>
          </section>
        </div>

        {activeSection ===
          "overview" && (
          <section className="dashboard-section">
            <DriveControls
              status={
                driveSession.status
              }
              onStartDrive={
                handleStartDrive
              }
              onBeginDrive={
                handleBeginDrive
              }
              onEndDrive={
                handleEndDrive
              }
              onNewDrive={
                handleNewDrive
              }
            />

            <DriveHistory
              drives={driveHistory}
              onClearHistory={
                handleClearHistory
              }
            />

            <SimulationControls
              onSimulate={
                handleSimulation
              }
              disabled={
                driveSession.status !==
                DRIVE_STATES.ACTIVE
              }
            />

            <LiveSensorMonitor
              vehicle={vehicle}
            />
          </section>
        )}

        {activeSection ===
          "emergency-center" && (
          <section className="dashboard-section">
            <div className="emergency-section">
              <h2>
                🚨 Emergency Center
              </h2>

              <p>
                Current emergency status:{" "}
                <strong>
                  {emergency
                    ? "Emergency Detected"
                    : "Normal"}
                </strong>
              </p>

              <p>
                Current Risk:{" "}
                <strong>
                  {risk.riskLevel}
                </strong>
              </p>
            </div>

            <EmergencyContacts />

            <EmergencyHistory
              history={history}
              onClearHistory={() => {
                setHistory([]);

                try {
                  localStorage.removeItem(
                    "drivexEmergencyHistory"
                  );
                } catch (error) {
                  console.error(
                    "Failed to clear Emergency History:",
                    error
                  );
                }
              }}
            />
          </section>
        )}

        {activeSection ===
          "ai-copilot" && (
          <section className="dashboard-section">
            <AIAssistant
              vehicleData={vehicle}
              driverState={driverState}
              risk={risk}
              liveLocation={
                liveLocation
              }
            />
          </section>
        )}

        {activeSection ===
          "analytics" && (
          <section className="dashboard-section">
            <div className="analytics-summary">
              <div className="stat-card">
                <span>
                  Driver State
                </span>

                <strong>
                  {driverState.state}
                </strong>
              </div>

              <div className="stat-card">
                <span>
                  Risk Score
                </span>

                <strong>
                  {risk.riskScore}/10
                </strong>
              </div>

              <div className="stat-card">
                <span>
                  Speed
                </span>

                <strong>
                  {vehicle.speed} km/h
                </strong>
              </div>

              <div className="stat-card">
                <span>
                  Heart Rate
                </span>

                <strong>
                  {vehicle.heartRate} BPM
                </strong>
              </div>
            </div>

            <SensorGraph
              key={graphResetKey}
              vehicle={vehicle}
            />
          </section>
        )}

        {activeSection ===
          "driver-profile" && (
          <DriverProfile />
        )}

        {activeSection ===
          "vehicle" && (
          <VehicleProfile />
        )}
      </main>

      {emergency && (
        <EmergencyModal
          reason={emergencyReason}
          onCancel={
            handleCloseEmergency
          }
        />
      )}
    </div>
  );
}

export default Dashboard;