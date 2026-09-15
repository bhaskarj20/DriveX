import {
  createExternalHeartRate,
  isValidHeartRateData,
} from "../heartRate/heartRateSource";

const DATA_SOURCES = {
  SIMULATION: "SIMULATION",
  EXTERNAL: "EXTERNAL",
};

export function createTelemetry(data) {
  return {
    speed: data.speed ?? 0,
    temperature: data.temperature ?? 0,
    heartRate: data.heartRate ?? 0,
    heartRateSource:
      data.heartRateSource ??
      data.dataSource ??
      DATA_SOURCES.SIMULATION,
    heartRateTimestamp:
      data.heartRateTimestamp ??
      data.timestamp ??
      new Date().toISOString(),
    motion: data.motion ?? "Unknown",
    battery: data.battery ?? 0,
    emergency: data.emergency ?? false,
    event: data.event ?? "Normal",
    dataSource:
      data.dataSource ?? DATA_SOURCES.SIMULATION,
    timestamp:
      data.timestamp ?? new Date().toISOString(),
  };
}

export function createExternalTelemetry(data = {}) {
  const heartRateData = createExternalHeartRate({
    heartRate: data.heartRate ?? 0,
    timestamp: data.heartRateTimestamp,
  });

  if (!isValidHeartRateData(heartRateData)) {
    throw new Error(
      "Invalid external heart rate data"
    );
  }

  return createTelemetry({
    ...data,
    heartRate: heartRateData.heartRate,
    heartRateSource: heartRateData.source,
    heartRateTimestamp: heartRateData.timestamp,
    dataSource: DATA_SOURCES.EXTERNAL,
    timestamp:
      data.timestamp ?? heartRateData.timestamp,
  });
}

export async function sendTelemetry(
  telemetry,
  driverProfileId
) {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/telemetry`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        driverProfile: driverProfileId,
        speed: telemetry.speed,
        heartRate: telemetry.heartRate,
        motion: telemetry.motion,
        timestamp: telemetry.timestamp,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Telemetry request failed: ${response.status}`
    );
  }

  return response.json();
}

export { DATA_SOURCES };