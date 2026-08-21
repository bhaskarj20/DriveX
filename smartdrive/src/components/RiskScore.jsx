function RiskScore({ history }) {
  const emergencyCount = history.length;

  const riskScore = Math.min(
    10 + emergencyCount * 15,
    100
  );

  let riskLevel = "Low Risk";

  if (riskScore >= 70) {
    riskLevel = "High Risk";
  } else if (riskScore >= 40) {
    riskLevel = "Moderate Risk";
  }

  return (
    <div className="risk-card">
      <div className="risk-icon">🛡️</div>

      <div className="risk-info">
        <h3>Driver Risk Score</h3>

        <div className="risk-score">
          {riskScore}
          <span>/100</span>
        </div>

        <p>{riskLevel}</p>

        <small>
          Based on {emergencyCount} recorded emergency event
          {emergencyCount !== 1 ? "s" : ""}
        </small>
      </div>
    </div>
  );
}

export default RiskScore;