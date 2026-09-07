const DEFAULT_THRESHOLD_MS = 1500;
const RECOVERY_TOLERANCE_MS = 300;

export function createHeadOrientationTracker(
  thresholdMs = DEFAULT_THRESHOLD_MS
) {
  let lookingAwaySince = null;
  let recoveryStartedAt = null;

  return {
    update(
      direction,
      timestamp = performance.now()
    ) {
      const isLookingAway =
        direction === "LEFT" ||
        direction === "RIGHT";

      if (isLookingAway) {
        recoveryStartedAt = null;

        if (lookingAwaySince === null) {
          lookingAwaySince = timestamp;
        }

        const durationMs =
          timestamp - lookingAwaySince;

        return {
          isLookingAway: true,
          durationMs,
          isDistracted:
            durationMs >= thresholdMs,
        };
      }

      if (lookingAwaySince !== null) {
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
            timestamp - lookingAwaySince;

          return {
            isLookingAway: false,
            durationMs,
            isDistracted:
              durationMs >= thresholdMs,
          };
        }
      }

      lookingAwaySince = null;
      recoveryStartedAt = null;

      return {
        isLookingAway: false,
        durationMs: 0,
        isDistracted: false,
      };
    },

    reset() {
      lookingAwaySince = null;
      recoveryStartedAt = null;
    },
  };
}
