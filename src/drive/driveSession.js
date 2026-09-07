export const DRIVE_STATES = {
  IDLE: "IDLE",
  PRE_DRIVE_CHECK: "PRE_DRIVE_CHECK",
  ACTIVE: "ACTIVE",
  SUMMARY: "SUMMARY",
};

export function createDriveSession() {
  return {
    status: DRIVE_STATES.IDLE,
    sessionId: null,
    startedAt: null,
    endedAt: null,
  };
}

export function beginPreDriveCheck(session) {
  return {
    ...session,
    status: DRIVE_STATES.PRE_DRIVE_CHECK,
  };
}

export function startDrive(session) {
  return {
    ...session,
    status: DRIVE_STATES.ACTIVE,
    sessionId: crypto.randomUUID(),
    startedAt: new Date().toISOString(),
    endedAt: null,
  };
}

export function endDrive(session) {
  return {
    ...session,
    status: DRIVE_STATES.SUMMARY,
    endedAt: new Date().toISOString(),
  };
}

export function resetDrive(session) {
  return {
    ...session,
    status: DRIVE_STATES.IDLE,
    sessionId: null,
    startedAt: null,
    endedAt: null,
  };
}