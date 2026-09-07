export function calculateRisk(telemetry, driverState = null) {
  const {
    speed = 0,
    heartRate = 0,
    motion = "Unknown",
    event = "Normal",
  } = telemetry;

  let riskScore = 0;
  const reasons = [];

  // -------------------------
  // VEHICLE EVENTS
  // -------------------------

  if (event === "Sudden Braking") {
    riskScore += 2;
    reasons.push("Sudden braking detected.");
  }

  if (event === "Sudden Acceleration") {
    riskScore += 1;
    reasons.push("Sudden acceleration detected.");
  }

  if (event === "Driver Stress") {
    riskScore += 1;
    reasons.push("Driver stress signal detected.");
  }

  if (motion === "Abnormal") {
    riskScore += 2;
    reasons.push("Abnormal vehicle motion detected.");
  }

  // -------------------------
  // HEART RATE
  // -------------------------

  if (heartRate >= 100) {
    riskScore += 2;
    reasons.push("Elevated heart-rate signal detected.");
  } else if (heartRate >= 90) {
    riskScore += 1;
    reasons.push("Increased heart-rate signal detected.");
  }

  // -------------------------
  // SPEED
  // -------------------------

  if (speed >= 90) {
    riskScore += 1;
    reasons.push("High vehicle speed detected.");
  }

  // -------------------------
  // DRIVER STATE
  // -------------------------

  if (driverState?.state === "DISTRACTED") {
    riskScore += 1;
    reasons.push("Driver distraction detected.");
  }

  if (driverState?.state === "DROWSY") {
    riskScore += 2;
    reasons.push("Driver drowsiness detected.");
  }

  if (driverState?.state === "CRITICAL") {
    riskScore += 3;
    reasons.push("Critical driver state detected.");
  }

  // -------------------------
  // FINAL RISK
  // -------------------------

  const normalizedScore = Math.min(riskScore, 10);

  let riskLevel = "Low";

  if (normalizedScore >= 4) {
    riskLevel = "High";
  } else if (normalizedScore >= 2) {
    riskLevel = "Moderate";
  }

  const emergency = normalizedScore >= 4;

  return {
    riskScore: normalizedScore,
    riskLevel,
    emergency,
    reasons,
    signals: {
      speed,
      heartRate,
      motion,
      event,
      driverState: driverState?.state ?? "Unknown",
    },
  };
}

// Temporary compatibility wrapper.
export function detectEmergency(telemetry) {
  const result = calculateRisk(telemetry);

  return {
    emergency: result.emergency,
    riskScore: result.riskScore,
    reason:
      result.reasons.length > 0
        ? result.reasons.join(" ")
        : "No critical condition detected.",
  };
}