export function detectEmergency(vehicle) {
  const {
    speed,
    heartRate,
    motion,
    event,
  } = vehicle;

  let riskScore = 0;

  // Sudden braking
  if (event === "Sudden Braking") {
    riskScore += 2;
  }

  // Abnormal movement
  if (motion === "Abnormal") {
    riskScore += 2;
  }

  // Rapid acceleration
  if (event === "Sudden Acceleration") {
    riskScore += 1;
  }

  // Driver stress
  if (event === "Driver Stress") {
    riskScore += 1;
  }

  // Elevated heart rate
  if (heartRate >= 100) {
    riskScore += 2;
  } else if (heartRate >= 90) {
    riskScore += 1;
  }

  // High speed
  if (speed >= 90) {
    riskScore += 1;
  }

  // Emergency threshold
  if (riskScore >= 4) {
    return {
      emergency: true,
      riskScore,
      reason: "Multiple abnormal vehicle and driver signals detected.",
    };
  }

  return {
    emergency: false,
    riskScore,
    reason: "No critical condition detected.",
  };
}