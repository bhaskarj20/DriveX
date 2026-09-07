const LEFT_EYE = {
top: 159,
bottom: 145,
left: 33,
right: 133,
};

const RIGHT_EYE = {
top: 386,
bottom: 374,
left: 362,
right: 263,
};

const NOSE_TIP = 1;
const LEFT_CHEEK = 234;
const RIGHT_CHEEK = 454;

function distance(pointA, pointB) {
const dx = pointA.x - pointB.x;
const dy = pointA.y - pointB.y;

return Math.sqrt(dx * dx + dy * dy);
}

function calculateEyeOpenness(landmarks, eye) {
const top = landmarks[eye.top];
const bottom = landmarks[eye.bottom];
const left = landmarks[eye.left];
const right = landmarks[eye.right];

if (!top || !bottom || !left || !right) {
return null;
}

const verticalDistance = distance(top, bottom);
const horizontalDistance = distance(left, right);

if (horizontalDistance === 0) {
return null;
}

return verticalDistance / horizontalDistance;
}

export function analyzeEyes(landmarks) {
if (!landmarks || landmarks.length === 0) {
return {
leftEyeOpenness: null,
rightEyeOpenness: null,
averageEyeOpenness: null,
};
}

const leftEyeOpenness = calculateEyeOpenness(
landmarks,
LEFT_EYE
);

const rightEyeOpenness = calculateEyeOpenness(
landmarks,
RIGHT_EYE
);

const validValues = [
leftEyeOpenness,
rightEyeOpenness,
].filter((value) => value !== null);

const averageEyeOpenness =
validValues.length > 0
? validValues.reduce(
(sum, value) => sum + value,
0
) / validValues.length
: null;

return {
leftEyeOpenness,
rightEyeOpenness,
averageEyeOpenness,
};
}

export function analyzeHeadOrientation(landmarks) {
if (!landmarks || landmarks.length === 0) {
return {
direction: "UNKNOWN",
value: null,
};
}

const nose = landmarks[NOSE_TIP];
const leftCheek = landmarks[LEFT_CHEEK];
const rightCheek = landmarks[RIGHT_CHEEK];

if (!nose || !leftCheek || !rightCheek) {
return {
direction: "UNKNOWN",
value: null,
};
}

const faceWidth = distance(leftCheek, rightCheek);

if (faceWidth === 0) {
return {
direction: "UNKNOWN",
value: null,
};
}

const faceCenterX =
(leftCheek.x + rightCheek.x) / 2;

const horizontalOffset =
(nose.x - faceCenterX) / faceWidth;

let direction = "FORWARD";

if (horizontalOffset < -0.08) {
direction = "LEFT";
} else if (horizontalOffset > 0.08) {
direction = "RIGHT";
}

return {
direction,
value: horizontalOffset,
};
}
