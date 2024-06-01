import { getMoonIllumination, getMoonPhases, getMoonPosition, getMoonTimes } from "moon-sun-calc";
import { createMemo } from "solid-js";
import { calcDuration } from "utils/date";
import { round } from "utils/math";

import type { MoonPhaseName } from "types";

import { useTranslation } from "@lib/context";
import { useDatetime, useLocation } from "@lib/hooks";

export interface MoonData {
	altitude: string;
	angle: number;
	azimuth: string;
	distance: string;
	duration: string;
	fraction: string;
	moonrise: Nullish<Date>;
	moonset: Nullish<Date>;
	name: MoonPhaseName;
	parallacticAngle: string;
	phases: ReturnType<typeof getMoonPhases>;
	phaseValue: number;
	rotation: number;
	waxing: boolean;
	zenith: string;
}

interface Output {
	getMoonData: () => MoonData;
}

export function useMoonData(): Output {
	const { getLatitude, getLongitude } = useLocation();
	const { getDatetime } = useDatetime();
	const { formatters } = useTranslation();

	const data = createMemo(() => ({
		illumination: getMoonIllumination(getDatetime(), true),
		phases: getMoonPhases(getDatetime()),
		position: getMoonPosition(getDatetime(), getLatitude(), getLongitude(), true),
		times: getMoonTimes(getDatetime(), getLatitude(), getLongitude())
	}));

	const getMoonData = () => {
		const { illumination, phases, position, times } = data();

		return {
			altitude: formatters().formatDegrees(round(position.altitude, 1)),
			angle: illumination.angle,
			azimuth: formatters().formatDegrees(round(position.azimuth, 1)),
			distance: formatters().formatKilometers(round(position.distance, 2)),
			duration: formatters().formatTimeDuration(calcDuration(times.rise, times.set)),
			fraction: formatters().formatPercent(round(illumination.fraction * 100, 1)),
			moonrise: times.rise,
			moonset: times.set,
			name: illumination.phase.id,
			parallacticAngle: formatters().formatDegrees(round(position.parallacticAngle, 1)),
			phases: phases,
			phaseValue: round(illumination.phaseValue, 4),
			rotation: -(illumination.angle - position.parallacticAngle) / 4,
			waxing: illumination.angle < 0,
			zenith: formatters().formatDegrees(round(illumination.angle - position.parallacticAngle, 1))
		};
	};

	return {
		getMoonData
	};
}
