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

export { DATA_SOURCES };