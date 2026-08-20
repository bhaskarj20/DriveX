function EmergencyButton({ onEmergency }) {
  return (
    <button onClick={onEmergency}>
      🚨 Simulate Accident
    </button>
  );
}

export default EmergencyButton;