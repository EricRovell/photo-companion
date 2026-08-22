import { getMoonIllumination, getMoonPosition, getSunPosition } from "moon-sun-calc";
import { getDayStart, shiftDate } from "utils/date";
import { clamp, scale } from "utils/math";
import { isNullable, isWithinRange } from "utils/validators";

import type { EarthshineOpportunity, EarthshineRating, EarthshineSample } from "../types";

const SAMPLE_INTERVAL = 5 * 60 * 1000;
const MAX_ILLUMINATION = 0.25;
const MIN_ILLUMINATION = 0.005;
const MIN_MOON_ALTITUDE = 3;
const MAX_SUN_ALTITUDE = -4;

function getRating(score: number): EarthshineRating {
	if (score >= 80) {
		return "EXCELLENT";
	}

	if (score >= 65) {
		return "GOOD";
	}

	if (score >= 45) {
		return "FAIR";
	}

	return "LOW";
}

/**
 * Estimates an astronomical earthshine viewing opportunity for the local day.
 *
 * Weather, aerosols, light pollution and the Earth's instantaneous albedo are
 * intentionally excluded, so this is an opportunity score rather than a
 * brightness prediction.
 */
export function getEarthshineProbability(
	date: Date,
	latitude: number,
	longitude: number
): EarthshineOpportunity | null {
	const startOfDay = getDayStart(date);
	const endOfDay = shiftDate(startOfDay, "day", 1).getTime();

	let currentWindowStart: null | number = null;
	let bestWindowStart = 0;
	let bestWindowEnd = 0;
	let bestSample: EarthshineSample | null = null;

	for (let timestamp = startOfDay; timestamp < endOfDay; timestamp += SAMPLE_INTERVAL) {
		const time = new Date(timestamp);
		const illumination = getMoonIllumination(time);
		const observer = { latitude, longitude };
		const moon = getMoonPosition({ instant: time, observer });
		const sun = getSunPosition({ instant: time, observer });

		if (
			!isWithinRange(illumination.fraction, MIN_ILLUMINATION, MAX_ILLUMINATION) ||
			moon.apparentAltitude < MIN_MOON_ALTITUDE ||
			sun.apparentAltitude > MAX_SUN_ALTITUDE
		) {
			currentWindowStart = null;
			continue;
		}

		currentWindowStart ??= timestamp;

		const phaseScore = clamp(scale(illumination.fraction, MIN_ILLUMINATION, MAX_ILLUMINATION, 1, 0), 0, 1);
		const darknessScore = clamp(scale(sun.apparentAltitude, MAX_SUN_ALTITUDE, -12, 0.2, 1), 0.2, 1);
		const altitudeScore = clamp(scale(moon.apparentAltitude, MIN_MOON_ALTITUDE, 20, 0.2, 1), 0.2, 1);

		const score = Math.round(100 * (0.5 * phaseScore + 0.3 * darknessScore + 0.2 * altitudeScore));

		const sample = {
			altitude: moon.apparentAltitude,
			azimuth: moon.azimuth,
			illumination: illumination.fraction,
			score,
			time,
			waxing: illumination.waxing
		};

		if (isNullable(bestSample) || sample.score > bestSample.score) {
			bestSample = sample;
			bestWindowStart = currentWindowStart;
			bestWindowEnd = timestamp + SAMPLE_INTERVAL;
		} else if (currentWindowStart === bestWindowStart) {
			bestWindowEnd = timestamp + SAMPLE_INTERVAL;
		}
	}

	if (isNullable(bestSample)) {
		return null;
	}

	const { waxing, ...peak } = bestSample;

	return {
		dateEnd: new Date(bestWindowEnd),
		dateStart: new Date(bestWindowStart),
		peak,
		rating: getRating(peak.score),
		waxing
	};
}
