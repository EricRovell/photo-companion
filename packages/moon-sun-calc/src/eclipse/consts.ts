import type { Kilometer, Millisecond } from "../types";

export const SUN_RADIUS: Kilometer = 695_700;
export const MOON_RADIUS: Kilometer = 1737.4;

export const CANDIDATE_WINDOW: Millisecond = 12 * 60 * 60 * 1000;
export const SEARCH_MARGIN: Millisecond = 2 * 24 * 60 * 60 * 1000;
export const SEARCH_STEP: Millisecond = 5 * 60 * 1000;
export const ROOT_TOLERANCE: Millisecond = 100;
export const PEAK_COMPARISON_TOLERANCE: Millisecond = 1000;
