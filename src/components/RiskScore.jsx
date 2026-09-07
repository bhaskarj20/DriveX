function RiskScore({ risk }) {
  const riskScore = risk?.riskScore ?? 0;
  const riskLevel = risk?.riskLevel ?? "Low";
  const reasons = risk?.reasons ?? [];

  let displayLevel = "Low Risk";

  if (riskLevel === "High") {
    displayLevel = "High Risk";
  } else if (riskLevel === "Moderate") {
    displayLevel = "Moderate Risk";
  }

  return (
    <div className="risk-card">
      <div className="risk-icon">🛡️</div>

      <div className="risk-info">
        <h3>Driver Risk Score</h3>

        <div className="risk-score">
          {riskScore}
          <span>/10</span>
        </div>

        <p>{displayLevel}</p>

        <small>
          {reasons.length > 0
            ? reasons[0]
            : "No critical condition detected."}
        </small>
      </div>
    </div>
  );
}

export default RiskScore;