import { findMoonRiseSetIntervals, getMoonAge, getMoonIllumination, getMoonPosition, getMoonZenithAngle } from "moon-sun-calc";
import { createMemo } from "solid-js";
import { calcDuration } from "utils/date";

import { getMoonRotation, normalizeAngleDegrees } from "~/entities/moon";
import { useDatetime } from "~/features/datetime-query";
import { useSettings } from "~/features/settings";
import { createRiseSetEvents } from "~/shared/lib/rise-set";

import { FULL_MOON_NAMES } from "../consts";

export function createMoonServiceState() {
	const { settings } = useSettings();
	const { getDatetime } = useDatetime();

	const observer = () => ({
		latitude: settings.latitude,
		longitude: settings.longitude
	});

	const age = createMemo(() => getMoonAge(getDatetime()));
	const illumination = createMemo(() => getMoonIllumination(getDatetime()));

	const position = createMemo(() => getMoonPosition({
		instant: getDatetime(),
		observer: observer()
	}));

	const { belowHorizonInterval, nextRise, rise: moonrise, riseSetTimes, set: moonset } = createRiseSetEvents({
		date: getDatetime,
		findIntervals: findMoonRiseSetIntervals,
		observer
	});

	const zenithAngle = createMemo(() => getMoonZenithAngle(illumination().angle, position().parallacticAngle));

	return {
		age,
		altitude: () => position().apparentAltitude,
		angle: () => illumination().angle,
		azimuth: () => position().azimuth,
		belowHorizonInterval,
		distance: () => position().distance,
		duration: () => moonrise() || moonset() ? calcDuration(moonrise(), moonset()) : 0,
		fraction: () => illumination().fraction * 100,
		fullMoonName: () => illumination().phase === "FULL_MOON"
			? FULL_MOON_NAMES[getDatetime().getMonth()]
			: null,
		moonrise,
		moonset,
		nextRise,
		parallacticAngle: () => position().parallacticAngle,
		phaseName: () => illumination().phase,
		phaseValue: () => illumination().phaseValue,
		riseSetTimes,
		rotation: () => getMoonRotation(zenithAngle(), illumination().waxing),
		waxing: () => illumination().waxing,
		zenith: () => normalizeAngleDegrees(zenithAngle())
	};
}
