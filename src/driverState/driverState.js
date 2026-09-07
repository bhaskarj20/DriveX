export const DRIVER_STATES = {
  ALERT: "ALERT",
  DISTRACTED: "DISTRACTED",
  DROWSY: "DROWSY",
  CRITICAL: "CRITICAL",
};

export function createDriverStateData({
  state = DRIVER_STATES.ALERT,
  confidence = 0,
  source = "SIMULATION",
  timestamp = new Date().toISOString(),
} = {}) {
  return {
    state,
    confidence,
    source,
    timestamp,
  };
}

export function isValidDriverStateData(data) {
  if (!data) {
    return false;
  }

  if (!Object.values(DRIVER_STATES).includes(data.state)) {
    return false;
  }

  if (typeof data.confidence !== "number") {
    return false;
  }

  if (data.confidence < 0 || data.confidence > 1) {
    return false;
  }

  if (typeof data.source !== "string") {
    return false;
  }

  return true;
}