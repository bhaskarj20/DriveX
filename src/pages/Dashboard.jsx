import { useCallback, useEffect, useRef, useState } from "react";

import CameraView from "../camera/CameraView";
import LiveLocation from "../components/LiveLocation";
import LiveSensorMonitor from "../components/LiveSensorMonitor";
import SimulationControls from "../components/SimulationControls";
import DriveControls from "../components/DriveControls";
import RiskScore from "../components/RiskScore";
import SensorGraph from "../components/SensorGraph";
import AIAssistant from "../components/AIAssistant";
import EmergencyContacts from "../components/EmergencyContacts";
import EmergencyHistory from "../components/EmergencyHistory";
import EmergencyModal from "../components/EmergencyModal";

import {
  DRIVE_STATES,
  createDriveSession,
  startDrive,
  endDrive,
} from "../drive/driveSession";

import {
  triggerSimulationEvent,
  startVehicleSimulator,
} from "../simulator/vehicleSimulator";

import { createTelemetry } from "../telemetry/telemetry";
import { calculateRisk } from "../detection/emergencyDetector";

import {
  DRIVER_STATES,
  createDriverStateData,
} from "../driverState/driverState";

import vehicleData from "../data/vehicleData";

function Dashboard() {
  const [driveSession, setDriveSession] =
    useState(createDriveSession());

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

  const [emergency, setEmergency] = useState(false);
  const [emergencyReason, setEmergencyReason] =
    useState("");

  const [history, setHistory] = useState([]);

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

  useEffect(() => {
    driverStateRef.current = driverState;
  }, [driverState]);

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

  const resetDriverState = useCallback(() => {
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

  const resetRisk = useCallback(() => {
    setRisk({
      riskScore: 0,
      riskLevel: "Low",
      emergency: false,
      reasons: [],
      signals: {},
    });
  }, []);

  const handleDriverStateChange =
    useCallback(
      (newDriverState) => {
        driverStateRef.current =
          newDriverState;

        setDriverState(
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
      },
      [vehicle]
    );

  const handleStartDrive = () => {
    setDriveSession((prev) =>
      startDrive(prev)
    );
  };

  const handleBeginDrive = () => {
    const newVehicleData =
      triggerSimulationEvent(
        "Normal"
      );

    setVehicle(newVehicleData);

    const telemetry =
      createTelemetry(
        newVehicleData
      );

    const currentDriverState =
      driverStateRef.current;

    const riskResult =
      calculateRisk(
        telemetry,
        currentDriverState
      );

    setRisk(riskResult);

    setDriveSession((prev) => ({
      ...prev,
      status: DRIVE_STATES.ACTIVE,
    }));
  };

  const handleEndDrive = () => {
    setDriveSession((prev) =>
      endDrive(prev)
    );

    resetVehicle();
    resetRisk();
    resetDriverState();

    setEmergency(false);
    setEmergencyReason("");

    lastEmergencyEvent.current =
      null;

    setGraphResetKey(
      (prev) => prev + 1
    );
  };

  const handleNewDrive = () => {
    resetVehicle();
    resetRisk();
    resetDriverState();

    setEmergency(false);
    setEmergencyReason("");

    lastEmergencyEvent.current =
      null;

    setGraphResetKey(
      (prev) => prev + 1
    );

    setDriveSession({
      ...createDriveSession(),
      status: DRIVE_STATES.IDLE,
    });
  };

  const handleSimulation = (event) => {
    if (
      driveSession.status !==
      DRIVE_STATES.ACTIVE
    ) {
      return;
    }

    const newVehicleData =
      triggerSimulationEvent(
        event
      );

    if (!newVehicleData) {
      return;
    }

    setVehicle(newVehicleData);

    const telemetry =
      createTelemetry(
        newVehicleData
      );

    const currentDriverState =
      driverStateRef.current;

    const riskResult =
      calculateRisk(
        telemetry,
        currentDriverState
      );

    setRisk(riskResult);
  };

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

          const telemetry =
            createTelemetry(
              newVehicleData
            );

          const currentDriverState =
            driverStateRef.current;

          const riskResult =
            calculateRisk(
              telemetry,
              currentDriverState
            );

          setRisk(riskResult);

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

            const newEvent = {
              id: Date.now(),

              type: criticalDriver
                ? "Automatic Detection: Critical Driver State"
                : `Automatic Detection: ${newVehicleData.event}`,

              date:
                new Date().toLocaleString(),

              location:
                vehicleData.location,

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
  }, [driveSession.status]);

  const handleCloseEmergency = () => {
    setEmergency(false);
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
            🏠 Overview
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

        </nav>

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
  "driver-monitoring" && (
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

      <LiveLocation />
    </div>
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
            />

          </section>
        )}

        {activeSection ===
          "ai-copilot" && (

          <section className="dashboard-section">

            <AIAssistant
              vehicleData={vehicle}
              driverState={
                driverState
              }
              risk={risk}
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

      </main>

      {emergency && (
        <EmergencyModal
          reason={
            emergencyReason
          }
          onCancel={
            handleCloseEmergency
          }
        />
      )}

    </div>
  );
}

export default Dashboard;