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

export async function sendDriverStateEvent(
  driverState,
  driverProfileId
) {
  if (!driverProfileId) {
    console.warn(
      "Driver state event not sent: driver profile ID is not available yet."
    );
    return;
  }

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/driver-state-events`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        driverProfile: driverProfileId,
        state: driverState.state,
        confidence: driverState.confidence,
        source: driverState.source,
        timestamp: driverState.timestamp,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Driver state event request failed: ${response.status}`
    );
  }

  return response.json();
}