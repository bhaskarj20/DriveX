import { DRIVER_STATES } from "./driverState";

export function calculateDriverState({
  eyeState,
  headState,
}) {
  const isDrowsy = eyeState?.isDrowsy === true;
  const isDistracted = headState?.isDistracted === true;

  let state = DRIVER_STATES.ALERT;

  if (isDrowsy && isDistracted) {
    state = DRIVER_STATES.CRITICAL;
  } else if (isDrowsy) {
    state = DRIVER_STATES.DROWSY;
  } else if (isDistracted) {
    state = DRIVER_STATES.DISTRACTED;
  }

  return state;
}