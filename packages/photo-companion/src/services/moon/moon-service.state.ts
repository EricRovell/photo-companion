import { getMoonIllumination, getMoonPhases, getMoonPosition, getMoonTimes } from "moon-sun-calc";
import { createMemo } from "solid-js";
import { calcDuration } from "utils/date";

import { useDatetime } from "~/hooks";
import { useSettings } from "~/services/settings";

export function createMoonServiceState() {
	const { settings } = useSettings();
	const { getDatetime } = useDatetime();

	const illumination = createMemo(() => getMoonIllumination(getDatetime(), true));
	const phases = createMemo(() => getMoonPhases(getDatetime()));
	const position = createMemo(() => getMoonPosition(getDatetime(), settings.latitude, settings.longitude, true));
	const	times = createMemo(() => getMoonTimes(getDatetime(), settings.latitude, settings.longitude));

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
		rotation: () => -(illumination().angle - position().parallacticAngle) / 4,
		waxing: () => illumination().angle < 0,
		zenith: () => illumination().angle - position().parallacticAngle
	};
}
