import { getMoonEvents, getMoonIllumination, getMoonPosition, getMoonZenithAngle, getNextMoonPhases } from "moon-sun-calc";
import { createMemo } from "solid-js";
import { calcDuration, getDayStart, shiftDate } from "utils/date";

import { getMoonRotation, normalizeAngleDegrees } from "~/entities/moon";
import { useDatetime } from "~/features/datetime-query";
import { useSettings } from "~/features/settings";

import { FULL_MOON_NAMES, PHASE_VALUES } from "../consts";

export function createMoonServiceState() {
	const { settings } = useSettings();
	const { getDatetime } = useDatetime();

	const observer = () => ({ latitude: settings.latitude, longitude: settings.longitude });
	const illumination = createMemo(() => getMoonIllumination(getDatetime()));

	const phases = createMemo(() => getNextMoonPhases(getDatetime()).map(event => ({
		phaseName: event.phase,
		phaseValue: PHASE_VALUES[event.phase],
		timestamp: event.time.getTime()
	})));

	const position = createMemo(() => getMoonPosition({ instant: getDatetime(), observer: observer() }));

	const times = createMemo(() => {
		const start = getDayStart(getDatetime());
		return getMoonEvents({
			interval: { end: shiftDate(start, "day", 1).getTime(), start },
			observer: observer()
		});
	});

	const moonrise = () => times().find(event => event.name === "MOONRISE")?.time ?? null;
	const moonset = () => times().find(event => event.name === "MOONSET")?.time ?? null;
	const zenithAngle = createMemo(() => getMoonZenithAngle(illumination().angle, position().parallacticAngle));

	return {
		altitude: () => position().apparentAltitude,
		angle: () => illumination().angle,
		azimuth: () => position().azimuth,
		distance: () => position().distance,
		duration: () => moonrise() || moonset() ? calcDuration(moonrise(), moonset()) : 0,
		fraction: () => illumination().fraction * 100,
		fullMoonName: () => illumination().phase === "FULL_MOON"
			? FULL_MOON_NAMES[getDatetime().getMonth()]
			: null,
		moonrise,
		moonset,
		parallacticAngle: () => position().parallacticAngle,
		phaseName: () => illumination().phase,
		phases,
		phaseValue: () => illumination().phaseValue,
		rotation: () => getMoonRotation(zenithAngle(), illumination().waxing),
		waxing: () => illumination().waxing,
		zenith: () => normalizeAngleDegrees(zenithAngle())
	};
}
