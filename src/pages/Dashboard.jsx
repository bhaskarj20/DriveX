
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import vehicleData from "../data/vehicleData";
import EmergencyContacts from "../components/EmergencyContacts";
import EmergencyModal from "../components/EmergencyModal";
import Navbar from "../components/Navbar";
import EmergencyHistory from "../components/EmergencyHistory";
import AIAssistant from "../components/AIAssistant";
import LiveSensorMonitor from "../components/LiveSensorMonitor";
import SimulationControls from "../components/SimulationControls";
import SensorGraph from "../components/SensorGraph";
import LiveLocation from "../components/LiveLocation";
import DriveControls from "../components/DriveControls";

import {
  startVehicleSimulator,
  triggerSimulationEvent,
} from "../simulator/vehicleSimulator";

import { calculateRisk } from "../detection/emergencyDetector";

import RiskScore from "../components/RiskScore";

import { createTelemetry } from "../telemetry/telemetry";

import {
  DRIVE_STATES,
  createDriveSession,
  beginPreDriveCheck,
  startDrive,
  endDrive,
  resetDrive,
} from "../drive/driveSession";

import { generateDriverState } from "../driverState/driverStateSimulator";

import CameraView from "../camera/CameraView";

function Dashboard() {
  const [emergency, setEmergency] = useState(false);
  const [emergencyReason, setEmergencyReason] = useState("");
  const [history, setHistory] = useState([]);

  const [driveSession, setDriveSession] = useState(
    createDriveSession()
  );

  const [driverState, setDriverState] = useState({
    state: "ALERT",
    confidence: 0,
    source: "SIMULATION",
    timestamp: null,
  });

  const driverStateRef = useRef(driverState);

  const [risk, setRisk] = useState({
    riskScore: 0,
    riskLevel: "Low",
    emergency: false,
    reasons: [],
    signals: {},
  });

  const [vehicle, setVehicle] = useState({
    speed: 0,
    temperature: 0,
    heartRate: 0,
    motion: "Waiting",
    battery: 0,
    emergency: false,
    event: "Normal",
    dataSource: "SIMULATION",
    timestamp: null,
  });

  const lastEmergencyEvent = useRef(null);

  const handleDriverStateChange = useCallback(
    (nextDriverState) => {
      driverStateRef.current = nextDriverState;
      setDriverState(nextDriverState);
    },
    []
  );

  useEffect(() => {
    if (driveSession.status !== DRIVE_STATES.ACTIVE) {
      return undefined;
    }

    const stopSimulator = startVehicleSimulator((data) => {
      const telemetry = createTelemetry(data);

      const simulatedDriverState =
        generateDriverState();

      // ==========================================
      // CAMERA DRIVER STATE
      // ==========================================

      if (
        driverStateRef.current.source === "CAMERA"
      ) {
        const riskResult = calculateRisk(
          telemetry,
          driverStateRef.current
        );

        setVehicle(telemetry);
        setRisk(riskResult);

        const criticalDriver =
          driverStateRef.current.state === "CRITICAL";

        const emergencyTrigger =
          riskResult.emergency || criticalDriver;

        const emergencyKey = criticalDriver
          ? "CRITICAL_DRIVER"
          : telemetry.event;

        if (
          emergencyTrigger &&
          (telemetry.event !== "Normal" ||
            criticalDriver) &&
          lastEmergencyEvent.current !== emergencyKey
        ) {
          lastEmergencyEvent.current =
            emergencyKey;

          setEmergency(true);

          setEmergencyReason(
            criticalDriver
              ? "Critical driver state detected: drowsiness and distraction detected simultaneously."
              : riskResult.reasons.length > 0
                ? riskResult.reasons.join(" ")
                : "Emergency condition detected."
          );

          const newEvent = {
            id: Date.now(),
            type: criticalDriver
              ? "Automatic Detection: Critical Driver State"
              : `Automatic Detection: ${telemetry.event}`,
            date: new Date().toLocaleString(),
            location: vehicleData.location,
            status:
              "Emergency Automatically Detected",
          };

          setHistory((prev) => [
            newEvent,
            ...prev,
          ]);
        }

        if (telemetry.event === "Normal" && !criticalDriver) {
          lastEmergencyEvent.current = null;
        }

        return;
      }

      // ==========================================
      // SIMULATED DRIVER STATE
      // ==========================================

      const riskResult = calculateRisk(
        telemetry,
        simulatedDriverState
      );

      driverStateRef.current =
        simulatedDriverState;

      setVehicle(telemetry);
      setDriverState(simulatedDriverState);
      setRisk(riskResult);

      if (
        riskResult.emergency &&
        telemetry.event !== "Normal" &&
        lastEmergencyEvent.current !==
          telemetry.event
      ) {
        lastEmergencyEvent.current =
          telemetry.event;

        setEmergency(true);

        setEmergencyReason(
          riskResult.reasons.length > 0
            ? riskResult.reasons.join(" ")
            : "Emergency condition detected."
        );

        const newEvent = {
          id: Date.now(),
          type: `Automatic Detection: ${telemetry.event}`,
          date: new Date().toLocaleString(),
          location: vehicleData.location,
          status:
            "Emergency Automatically Detected",
        };

        setHistory((prev) => [
          newEvent,
          ...prev,
        ]);
      }

      if (telemetry.event === "Normal") {
        lastEmergencyEvent.current = null;
      }
    });

    return stopSimulator;
  }, [driveSession.status]);

  const handleStartDrive = () => {
    setDriveSession((current) =>
      beginPreDriveCheck(current)
    );
  };

  const handleBeginDrive = () => {
    driverStateRef.current = {
      state: "ALERT",
      confidence: 0,
      source: "CAMERA",
      timestamp: null,
    };

    setDriverState(
      driverStateRef.current
    );

    setDriveSession((current) =>
      startDrive(current)
    );

    lastEmergencyEvent.current = null;
  };

  const handleEndDrive = () => {
    setDriveSession((current) =>
      endDrive(current)
    );

    lastEmergencyEvent.current = null;

    setEmergency(false);
    setEmergencyReason("");

    driverStateRef.current = {
      state: "ALERT",
      confidence: 0,
      source: "SIMULATION",
      timestamp: null,
    };

    setDriverState(
      driverStateRef.current
    );

    setVehicle({
      speed: 0,
      temperature: 0,
      heartRate: 0,
      motion: "Drive Ended",
      battery: 0,
      emergency: false,
      event: "Normal",
      dataSource: "SIMULATION",
      timestamp: null,
    });

    setRisk({
      riskScore: 0,
      riskLevel: "Low",
      emergency: false,
      reasons: [],
      signals: {},
    });
  };

  const handleNewDrive = () => {
    setDriveSession((current) =>
      resetDrive(current)
    );
  };

  const handleSimulation = (event) => {
    if (
      driveSession.status !==
      DRIVE_STATES.ACTIVE
    ) {
      return;
    }

    const data = triggerSimulationEvent(event);

    const telemetry = createTelemetry(data);

    const riskResult = calculateRisk(
      telemetry,
      driverStateRef.current
    );

    setVehicle(telemetry);
    setRisk(riskResult);

    if (event === "Normal") {
      lastEmergencyEvent.current = null;
      return;
    }

    if (riskResult.emergency) {
      lastEmergencyEvent.current = event;

      setEmergency(true);

      setEmergencyReason(
        riskResult.reasons.length > 0
          ? riskResult.reasons.join(" ")
          : "Emergency condition detected."
      );

      const newEvent = {
        id: Date.now(),
        type: `Manual Simulation: ${event}`,
        date: new Date().toLocaleString(),
        location: vehicleData.location,
        status:
          "Emergency Automatically Detected",
      };

      setHistory((prev) => [
        newEvent,
        ...prev,
      ]);
    }
  };

  const isActive =
    driveSession.status === DRIVE_STATES.ACTIVE;

  return (
    <div className="dashboard-page">
      <Navbar />

      <div className="dashboard-container">

        <div className="dashboard-header">
          <div>
            <h1>DriveX Dashboard</h1>

            <p>
              Driver Safety & Emergency Assistance
            </p>
          </div>

          <div className="system-status">
            <span className="status-dot"></span>

            {isActive
              ? "Drive Active"
              : "System Ready"}
          </div>
        </div>

        <DriveControls
          status={driveSession.status}
          onStartDrive={handleStartDrive}
          onBeginDrive={handleBeginDrive}
          onEndDrive={handleEndDrive}
          onNewDrive={handleNewDrive}
        />

        <div className="status-grid">

          <div className="status-card">
            <div className="status-icon">
              🚗
            </div>

            <div>
              <h3>Vehicle Status</h3>

              <p>
                {vehicleData.vehicleStatus}
              </p>
            </div>
          </div>

          <div className="status-card">
            <div className="status-icon">
              ❤️
            </div>

            <div>
              <h3>Heart Rate</h3>

              <p>
                {vehicle.heartRate} BPM
              </p>
            </div>
          </div>

          <div className="status-card">
            <div className="status-icon">
              ⚡
            </div>

            <div>
              <h3>Speed</h3>

              <p>
                {vehicle.speed} km/h
              </p>
            </div>
          </div>

          <div className="status-card">
            <div className="status-icon">
              📍
            </div>

            <div>
              <h3>Location</h3>

              <p>
                {vehicleData.location}
              </p>
            </div>
          </div>

          <div className="status-card">
            <div className="status-icon">
              📷
            </div>

            <div>
              <h3>Driver State</h3>

              <p>
                {driverState.state}
              </p>

              <small>
                Source: {driverState.source}

                {driverState.confidence > 0 &&
                  ` • ${Math.round(
                    driverState.confidence * 100
                  )}% confidence`}
              </small>
            </div>
          </div>

          <RiskScore risk={risk} />

        </div>

        <LiveLocation />

        <LiveSensorMonitor
          vehicle={vehicle}
        />

        <CameraView
          active={isActive}
          onDriverStateChange={
            handleDriverStateChange
          }
        />

        <SensorGraph
          vehicle={vehicle}
        />

        <SimulationControls
          onSimulate={handleSimulation}
        />

        <EmergencyContacts />

        <EmergencyHistory
          history={history}
        />

        <AIAssistant
          vehicleStatus={
            vehicleData.vehicleStatus
          }
          heartRate={vehicle.heartRate}
          location={vehicleData.location}
        />

      </div>

      {emergency && (
        <EmergencyModal
          reason={emergencyReason}
          onCancel={() =>
            setEmergency(false)
          }
        />
      )}

    </div>
  );
}

export default Dashboard;
