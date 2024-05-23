import { getMoonPhases, getMoonIllumination, getMoonTimes, getMoonPosition } from "moon-sun-calc";
import { createMemo } from "solid-js";
import type { MoonPhaseName } from "types";
import { calcDuration } from "utils/date";
import { round } from "utils/math";

import { useDatetime, useLocation } from "@lib/hooks";
import { useTranslation } from "@lib/context";

export interface MoonData {
	duration: string;
	rotation: number;
	moonrise: Nullish<Date>;
	moonset: Nullish<Date>;
	fraction: string;
	waxing: boolean;
	phaseValue: number;
	angle: number;
	phases: ReturnType<typeof getMoonPhases>;
	zenith: string;
	azimuth: string;
	altitude: string;
	distance: string;
	parallacticAngle: string;
	name: MoonPhaseName;
}

interface Output {
	getMoonData: () => MoonData;
}

export function useMoonData(): Output {
	const { getLatitude, getLongitude } = useLocation();
	const { date } = useDatetime();
	const { formatters } = useTranslation();

	const data = createMemo(() => ({
		times: getMoonTimes(date(), getLatitude(), getLongitude()),
		illumination: getMoonIllumination(date(), true),
		position: getMoonPosition(date(), getLatitude(), getLongitude(), true),
		phases: getMoonPhases(date())
	}));

	const getMoonData = () => {
		const { times, illumination, position, phases } = data();

		return {
			duration: formatters().formatTimeDuration(calcDuration(times.rise, times.set)),
			moonrise: times.rise,
			moonset: times.set,
			fraction: formatters().formatPercent(round(illumination.fraction * 100, 1)),
			waxing: illumination.angle < 0,
			phaseValue: round(illumination.phaseValue, 4),
			angle: illumination.angle,
			phases: phases,
			rotation: -(illumination.angle - position.parallacticAngle) / 4,
			name: illumination.phase.id,
			zenith: formatters().formatDegrees(round(illumination.angle - position.parallacticAngle, 1)),
			azimuth: formatters().formatDegrees(round(position.azimuth, 1)),
			altitude: formatters().formatDegrees(round(position.altitude, 1)),
			distance: formatters().formatKilometers(round(position.distance, 2)),
			parallacticAngle: formatters().formatDegrees(round(position.parallacticAngle, 1))
		};
	};

	return {
		getMoonData
	};
}
