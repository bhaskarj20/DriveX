import {
  DRIVER_STATES,
  createDriverStateData,
} from "./driverState";

const simulatedStates = [
  DRIVER_STATES.ALERT,
  DRIVER_STATES.DISTRACTED,
  DRIVER_STATES.DROWSY,
  DRIVER_STATES.CRITICAL,
];

export function generateDriverState() {
  const state =
    simulatedStates[
      Math.floor(Math.random() * simulatedStates.length)
    ];

  const confidence =
    Number((0.75 + Math.random() * 0.24).toFixed(2));

  return createDriverStateData({
    state,
    confidence,
    source: "SIMULATION",
  });
}