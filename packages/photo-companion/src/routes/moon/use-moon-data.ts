import { getMoonIllumination, getMoonPhases, getMoonPosition, getMoonTimes } from "moon-sun-calc";
import { createMemo } from "solid-js";
import { calcDuration } from "utils/date";
import { round } from "utils/math";

import type { MoonIllumination } from "moon-sun-calc/src/moon/types";
import type { MoonPhaseName } from "types";

import { useSettings } from "~/lib/context/settings";
import { useTranslation } from "~/lib/context/translation";
import { useDatetime } from "~/lib/hooks";

export interface MoonData {
	altitude: string;
	angle: number;
	azimuth: string;
	distance: string;
	duration: string;
	fraction: string;
	fullMoonName?: MoonIllumination["fullMoonName"];
	moonrise: Nullish<Date>;
	moonset: Nullish<Date>;
	parallacticAngle: string;
	phaseName: MoonPhaseName;
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
	const { settings } = useSettings();
	const { getDatetime } = useDatetime();
	const { formatters } = useTranslation();

	const data = createMemo(() => ({
		illumination: getMoonIllumination(getDatetime(), true),
		phases: getMoonPhases(getDatetime()),
		position: getMoonPosition(getDatetime(), settings.latitude, settings.longitude, true),
		times: getMoonTimes(getDatetime(), settings.latitude, settings.longitude)
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
			fullMoonName: illumination.fullMoonName,
			moonrise: times.rise,
			moonset: times.set,
			parallacticAngle: formatters().formatDegrees(round(position.parallacticAngle, 1)),
			phaseName: illumination.phase.id,
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
