const DEFAULT_THRESHOLD = 0.18;
const DROWSINESS_DURATION_MS = 1500;
const RECOVERY_TOLERANCE_MS = 300;

export function createEyeStateTracker(
  threshold = DEFAULT_THRESHOLD
) {
  let eyesClosedSince = null;
  let recoveryStartedAt = null;

  return {
    update(
      eyeOpenness,
      timestamp = performance.now()
    ) {
      if (
        typeof eyeOpenness !== "number" ||
        Number.isNaN(eyeOpenness)
      ) {
        return {
          isLow: false,
          durationMs: 0,
          isDrowsy: false,
        };
      }

      const isLow = eyeOpenness < threshold;

      if (isLow) {
        recoveryStartedAt = null;

        if (eyesClosedSince === null) {
          eyesClosedSince = timestamp;
        }

        const durationMs =
          timestamp - eyesClosedSince;

        return {
          isLow: true,
          durationMs,
          isDrowsy:
            durationMs >= DROWSINESS_DURATION_MS,
        };
      }

      if (eyesClosedSince !== null) {
        if (recoveryStartedAt === null) {
          recoveryStartedAt = timestamp;
        }

        const recoveryDuration =
          timestamp - recoveryStartedAt;

        if (
          recoveryDuration <
          RECOVERY_TOLERANCE_MS
        ) {
          const durationMs =
            timestamp - eyesClosedSince;

          return {
            isLow: false,
            durationMs,
            isDrowsy:
              durationMs >= DROWSINESS_DURATION_MS,
          };
        }
      }

      eyesClosedSince = null;
      recoveryStartedAt = null;

      return {
        isLow: false,
        durationMs: 0,
        isDrowsy: false,
      };
    },

    reset() {
      eyesClosedSince = null;
      recoveryStartedAt = null;
    },
  };
}