let vehicleState = {
  speed: 50,
  temperature: 30,
  heartRate: 76,
  motion: "Normal",
  battery: 90,
  emergency: false,
  event: "Normal",
};

let activeEvent = null;
let eventTicksRemaining = 0;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function startRandomEvent() {
  const events = [
    "Sudden Acceleration",
    "Sudden Braking",
    "Driver Stress",
    "Abnormal Motion",
  ];

  activeEvent =
    events[Math.floor(Math.random() * events.length)];

  eventTicksRemaining =
    Math.floor(Math.random() * 2) + 2;
}

/*
  Manually trigger an event from the
  Simulation Controls panel.
*/
export function triggerSimulationEvent(event) {
  if (event === "Normal") {
    activeEvent = null;
    eventTicksRemaining = 0;

    vehicleState.event = "Normal";
    vehicleState.motion = "Normal";

    return generateVehicleData();
  }

  if (event === "Accident") {
    activeEvent = "Accident";
    eventTicksRemaining = 3;

    return generateVehicleData();
  }

  activeEvent = event;
  eventTicksRemaining = 3;

  return generateVehicleData();
}

export function generateVehicleData() {
  // Randomly start an event
  if (!activeEvent && Math.random() < 0.08) {
    startRandomEvent();
  }

  // -------------------------
  // EVENT BEHAVIOUR
  // -------------------------

  if (activeEvent === "Sudden Acceleration") {
    vehicleState.speed = clamp(
      vehicleState.speed +
        Math.floor(Math.random() * 8) +
        6,
      0,
      120
    );

    vehicleState.heartRate = clamp(
      vehicleState.heartRate + 3,
      60,
      140
    );

    vehicleState.motion = "Rapid Acceleration";
  }

  else if (activeEvent === "Sudden Braking") {
    vehicleState.speed = clamp(
      vehicleState.speed -
        Math.floor(Math.random() * 10) -
        12,
      0,
      120
    );

    vehicleState.heartRate = clamp(
      vehicleState.heartRate + 5,
      60,
      140
    );

    vehicleState.motion = "Sudden Braking";
  }

  else if (activeEvent === "Driver Stress") {
    vehicleState.heartRate = clamp(
      vehicleState.heartRate +
        Math.floor(Math.random() * 5) +
        3,
      60,
      140
    );

    vehicleState.motion = "Normal";
  }

  else if (activeEvent === "Abnormal Motion") {
    vehicleState.speed = clamp(
      vehicleState.speed +
        Math.floor(Math.random() * 21) -
        10,
      0,
      120
    );

    vehicleState.heartRate = clamp(
      vehicleState.heartRate + 3,
      60,
      140
    );

    vehicleState.motion = "Abnormal";
  }

  // -------------------------
  // ACCIDENT SIMULATION
  // -------------------------

  else if (activeEvent === "Accident") {
    // Simulate a severe combined event

    vehicleState.speed = clamp(
      vehicleState.speed - 25,
      0,
      120
    );

    vehicleState.heartRate = clamp(
      vehicleState.heartRate + 12,
      60,
      140
    );

    vehicleState.motion = "Abnormal";
  }

  // -------------------------
  // NORMAL DRIVING
  // -------------------------

  else {
    const speedChange =
      Math.floor(Math.random() * 11) - 5;

    vehicleState.speed = clamp(
      vehicleState.speed + speedChange,
      0,
      100
    );

    // Natural heart-rate movement
    const targetHeartRate =
      72 + vehicleState.speed * 0.18;

    if (vehicleState.heartRate < targetHeartRate) {
      vehicleState.heartRate += 1;
    }
    else if (
      vehicleState.heartRate > targetHeartRate
    ) {
      vehicleState.heartRate -= 1;
    }

    // Tiny natural variation
    if (Math.random() < 0.4) {
      vehicleState.heartRate +=
        Math.random() < 0.5 ? -1 : 1;
    }

    vehicleState.heartRate = clamp(
      vehicleState.heartRate,
      65,
      110
    );

    // Motion state
    if (vehicleState.speed < 5) {
      vehicleState.motion = "Stationary";
    }
    else if (vehicleState.speed < 40) {
      vehicleState.motion = "Normal";
    }
    else if (vehicleState.speed < 75) {
      vehicleState.motion = "Cruising";
    }
    else {
      vehicleState.motion = "High Speed";
    }
  }

  // -------------------------
  // TEMPERATURE
  // -------------------------

  vehicleState.temperature = Number(
    clamp(
      vehicleState.temperature +
        (Math.random() * 0.6 - 0.3),
      28,
      36
    ).toFixed(1)
  );

  // -------------------------
  // BATTERY
  // -------------------------

  vehicleState.battery = clamp(
    vehicleState.battery - 0.1,
    0,
    100
  );

  // -------------------------
  // EVENT TIMER
  // -------------------------

  if (activeEvent) {
    eventTicksRemaining--;

    if (eventTicksRemaining <= 0) {
      activeEvent = null;
    }
  }

  return {
    speed: Math.round(vehicleState.speed),

    temperature:
      vehicleState.temperature,

    heartRate:
      Math.round(vehicleState.heartRate),

    motion:
      vehicleState.motion,

    battery:
      Number(vehicleState.battery.toFixed(1)),

    emergency:
      vehicleState.emergency,

    event:
      activeEvent || "Normal",
  };
}

// -------------------------
// START SIMULATOR
// -------------------------

export function startVehicleSimulator(onUpdate) {
  onUpdate(generateVehicleData());

  const interval = setInterval(() => {
    onUpdate(generateVehicleData());
  }, 2000);

  return () => clearInterval(interval);
}