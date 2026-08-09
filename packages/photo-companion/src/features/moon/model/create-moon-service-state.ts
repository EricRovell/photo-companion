import { getMoonIllumination, getMoonPhases, getMoonPosition, getMoonTimes, getMoonZenithAngle } from "moon-sun-calc";
import { createMemo } from "solid-js";
import { calcDuration } from "utils/date";

import { getMoonRotation, normalizeAngleDegrees } from "~/entities/moon";
import { useDatetime } from "~/features/datetime-query";
import { useSettings } from "~/features/settings";

export function createMoonServiceState() {
	const { settings } = useSettings();
	const { getDatetime } = useDatetime();

	const illumination = createMemo(() => getMoonIllumination(getDatetime(), true));
	const phases = createMemo(() => getMoonPhases(getDatetime()));
	const position = createMemo(() => getMoonPosition(getDatetime(), settings.latitude, settings.longitude, true));
	const	times = createMemo(() => getMoonTimes(getDatetime(), settings.latitude, settings.longitude));
	const zenithAngle = createMemo(() => getMoonZenithAngle(illumination().angle, position().parallacticAngle));

	return {
		altitude: () => position().altitude,
		angle: () => illumination().angle,
		azimuth: () => position().azimuth,
		distance: () => position().distance,
		duration: () => calcDuration(times().rise, times().set),
		fraction: () => illumination().fraction * 100,
		fullMoonName: () => illumination().fullMoonName,
		moonrise: () => times().rise,
		moonset: () => times().set,
		parallacticAngle: () => position().parallacticAngle,
		phaseName: () => illumination().phase.id,
		phases,
		phaseValue: () => illumination().phaseValue,
		rotation: () => getMoonRotation(zenithAngle(), illumination().angle < 0),
		waxing: () => illumination().angle < 0,
		zenith: () => normalizeAngleDegrees(zenithAngle())
	};
}
