import { useState } from "react";
import vehicleData from "../data/vehicleData";
import EmergencyContacts from "../components/EmergencyContacts";
import EmergencyButton from "../components/EmergencyButton";
import EmergencyModal from "../components/EmergencyModal";
import Navbar from "../components/Navbar";
import EmergencyHistory from "../components/EmergencyHistory";
import AIAssistant from "../components/AIAssistant";
import vehicleData from "../data/vehicleData";

function Dashboard() {
  const [emergency, setEmergency] = useState(false);
  const [history, setHistory] = useState([]);

  return (
    <div className="dashboard">
      <Navbar />

      <div className="dashboard-header">
  <div>
    <h1>SmartDrive Dashboard</h1>
    <p>Driver Safety & Emergency Assistance</p>
  </div>

  <div className="system-status">
    <span className="status-dot"></span>
    System Active
  </div>
</div>

      <div className="status-grid">

  <div className="status-card">
    <div className="card-icon">🚗</div>
    <div>
      <h3>Vehicle Status</h3>
      <p className="status-value">
        {vehicleData.vehicleStatus}
      </p>
      <span className="status-label">System connected</span>
    </div>
  </div>

  <div className="status-card">
    <div className="card-icon">❤️</div>
    <div>
      <h3>Heart Rate</h3>
      <p className="status-value">
        {vehicleData.heartRate} BPM
      </p>
      <span className="status-label">Driver monitoring</span>
    </div>
  </div>

  <div className="status-card">
    <div className="card-icon">📍</div>
    <div>
      <h3>Current Location</h3>
      <p className="status-value">
        {vehicleData.location}
      </p>
      <span className="status-label">GPS monitoring</span>
    </div>
  </div>

</div>

<EmergencyContacts />

      <div className="emergency-section">
        <h2>🚨 Emergency System</h2>

        <p>
          Use the button below to simulate a vehicle accident.
        </p>

        <EmergencyButton
  onEmergency={() => {
    setEmergency(true);

    const newEvent = {
      id: Date.now(),
      type: "Accident Simulation",
      date: new Date().toLocaleString(),
      location: vehicleData.location,
      status: "Emergency Activated",
    };

    setHistory((prev) => [newEvent, ...prev]);
  }}
/>
      </div>

      {emergency && (
        <EmergencyModal
          onCancel={() => setEmergency(false)}
        />
      )}

      <EmergencyHistory history={history} />
      <AIAssistant
  vehicleStatus={vehicleData.status}
  heartRate={vehicleData.heartRate}
  location={vehicleData.location}
  emergency={emergency}
/>

    </div>
  );
}

export default Dashboard;