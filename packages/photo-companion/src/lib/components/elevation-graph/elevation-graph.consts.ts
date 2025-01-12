export const DAY_MS = 24 * 60 * 60 * 1000;
export const STEP_COUNT = 72;

export const ASPECT_RATIO = 5;

export const Y_MAX = 60;
export const Y_MIN = -60;
export const Y_RANGE = Y_MAX - Y_MIN;  // -60 ... 60

export const X_MIN = 0;
export const X_MAX = Y_RANGE * ASPECT_RATIO;
export const X_RANGE = X_MAX - X_MIN;  // -60 ... 60

export const Y_RANGE_TICKS = 20;
export const TICK_COUNT = 23; // 1 ... 23

export const ALTITUDE_MIN = -90;
export const ALTITUDE_MAX = 90;
