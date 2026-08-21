import { useState, useEffect, useRef } from "react";

import vehicleData from "../data/vehicleData";

import EmergencyContacts from "../components/EmergencyContacts";
import EmergencyButton from "../components/EmergencyButton";
import EmergencyModal from "../components/EmergencyModal";
import Navbar from "../components/Navbar";
import EmergencyHistory from "../components/EmergencyHistory";
import AIAssistant from "../components/AIAssistant";
import LiveSensorMonitor from "../components/LiveSensorMonitor";
import SimulationControls from "../components/SimulationControls";
import SensorGraph from "../components/SensorGraph";
import LiveLocation from "../components/LiveLocation";

import {
  startVehicleSimulator,
  triggerSimulationEvent,
} from "../simulator/vehicleSimulator";

import { detectEmergency } from "../detection/emergencyDetector";
import RiskScore from "../components/RiskScore";

function Dashboard() {
  const [emergency, setEmergency] = useState(false);
  const [emergencyReason, setEmergencyReason] = useState("");
  const [history, setHistory] = useState([]);

  const [vehicle, setVehicle] = useState({
    speed: 0,
    temperature: 0,
    heartRate: 0,
    motion: "Starting...",
    battery: 0,
    emergency: false,
    event: "Normal",
  });

  const lastEmergencyEvent = useRef(null);

  // =====================================
  // RANDOM VEHICLE SIMULATOR
  // =====================================

  useEffect(() => {
    const stopSimulator = startVehicleSimulator((data) => {
      setVehicle(data);

      const result = detectEmergency(data);

      if (
        result.emergency &&
        data.event !== "Normal" &&
        lastEmergencyEvent.current !== data.event
      ) {
        lastEmergencyEvent.current = data.event;

        setEmergency(true);
        setEmergencyReason(result.reason);

        const newEvent = {
          id: Date.now(),
          type: `Automatic Detection: ${data.event}`,
          date: new Date().toLocaleString(),
          location: vehicleData.location,
          status: "Emergency Automatically Detected",
        };

        setHistory((prev) => [newEvent, ...prev]);
      }

      // Reset emergency lock
      // when simulation returns to normal
      if (data.event === "Normal") {
        lastEmergencyEvent.current = null;
      }
    });

    return stopSimulator;
  }, []);

  // =====================================
  // MANUAL SIMULATION
  // =====================================

  const handleSimulation = (event) => {
    const data = triggerSimulationEvent(event);

    setVehicle(data);

    const result = detectEmergency(data);

    // Return to normal
    if (event === "Normal") {
      lastEmergencyEvent.current = null;
      return;
    }

    // Emergency detected
    if (result.emergency) {
      lastEmergencyEvent.current = event;

      setEmergency(true);
      setEmergencyReason(result.reason);

      const newEvent = {
        id: Date.now(),
        type: `Manual Simulation: ${event}`,
        date: new Date().toLocaleString(),
        location: vehicleData.location,
        status: "Emergency Automatically Detected",
      };

      setHistory((prev) => [newEvent, ...prev]);
    }
  };

  return (
    <div className="dashboard">

      <Navbar />

      {/* =========================
          DASHBOARD HEADER
          ========================= */}

      <div className="dashboard-header">

        <div>
          <h1>SmartDrive Dashboard</h1>

          <p>
            Driver Safety & Emergency Assistance
          </p>
        </div>

        <div className="system-status">
          <span className="status-dot"></span>
          System Active
        </div>

      </div>


      {/* =========================
          TOP DASHBOARD AREA
          STATUS + LIVE LOCATION
          ========================= */}

      <div className="dashboard-top">

        {/* QUICK STATUS */}

        <div className="status-grid">

          {/* Vehicle Status */}

          <div className="status-card">

            <div className="card-icon">
              🚗
            </div>

            <div>
              <h3>Vehicle Status</h3>

              <p className="status-value">
                {vehicleData.vehicleStatus}
              </p>

              <span className="status-label">
                System connected
              </span>
            </div>

          </div>


          {/* Heart Rate */}

          <div className="status-card">

            <div className="card-icon">
              ❤️
            </div>

            <div>
              <h3>Heart Rate</h3>

              <p className="status-value">
                {vehicle.heartRate} BPM
              </p>

              <span className="status-label">
                Driver monitoring
              </span>
            </div>

          </div>


          {/* Vehicle Speed */}

          <div className="status-card">

            <div className="card-icon">
              🚗
            </div>

            <div>
              <h3>Vehicle Speed</h3>

              <p className="status-value">
                {vehicle.speed} km/h
              </p>

              <span className="status-label">
                Live simulation
              </span>
            </div>

          </div>


          {/* Current Location */}

          <div className="status-card">

            <div className="card-icon">
              📍
            </div>

            <div>
              <h3>Current Location</h3>

              <p className="status-value">
                {vehicleData.location}
              </p>

              <span className="status-label">
                GPS monitoring
              </span>
            </div>

          </div>

          <RiskScore history={history} />

        </div>


        {/* LIVE LOCATION */}

        <LiveLocation />

      </div>


      {/* =========================
          LIVE SENSOR MONITOR
          ========================= */}

      <LiveSensorMonitor vehicle={vehicle} />


      {/* =========================
          SENSOR GRAPHS
          ========================= */}

      <SensorGraph vehicle={vehicle} />


      {/* =========================
          SIMULATION CONTROLS
          ========================= */}

      <SimulationControls
        onSimulate={handleSimulation}
      />


      {/* =========================
          EMERGENCY CONTACTS
          ========================= */}

      <EmergencyContacts />


      {/* =========================
          EMERGENCY SYSTEM
          ========================= */}

      <div className="emergency-section">

        <h2>🚨 Emergency System</h2>

        <p>
          Use the button below to simulate a vehicle accident.
        </p>

        <EmergencyButton
          onEmergency={() => {

            setEmergency(true);

            setEmergencyReason(
              "Manual accident simulation triggered."
            );

            const newEvent = {
              id: Date.now(),
              type: "Accident Simulation",
              date: new Date().toLocaleString(),
              location: vehicleData.location,
              status: "Emergency Activated",
            };

            setHistory((prev) => [
              newEvent,
              ...prev,
            ]);
          }}
        />

      </div>


      {/* =========================
          EMERGENCY MODAL
          ========================= */}

      {emergency && (
        <EmergencyModal
          reason={emergencyReason}
          onCancel={() => {
            setEmergency(false);
            setEmergencyReason("");
          }}
        />
      )}


      {/* =========================
          EMERGENCY HISTORY
          ========================= */}

      <EmergencyHistory
        history={history}
      />


      {/* =========================
          AI ASSISTANT
          ========================= */}

      <AIAssistant
        vehicleStatus={vehicleData.vehicleStatus}
        heartRate={vehicle.heartRate}
        location={vehicleData.location}
        emergency={emergency}
      />

    </div>
  );
}

export default Dashboard;