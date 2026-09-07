export const HEART_RATE_SOURCES = {
  SIMULATION: "SIMULATION",
  EXTERNAL: "EXTERNAL",
};

export function createHeartRateData({
  heartRate = 0,
  source = HEART_RATE_SOURCES.SIMULATION,
  timestamp = new Date().toISOString(),
} = {}) {
  return {
    heartRate,
    source,
    timestamp,
  };
}

export function isValidHeartRateData(data) {
  if (!data) {
    return false;
  }

  if (typeof data.heartRate !== "number") {
    return false;
  }

  if (
    data.source !== HEART_RATE_SOURCES.SIMULATION &&
    data.source !== HEART_RATE_SOURCES.EXTERNAL
  ) {
    return false;
  }

  return true;
}