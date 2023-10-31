// @ts-expect-error: no types for this package
import SunCalc from "suncalc3";
import { round } from "../../helpers";

export interface MoonData {
	moonrise: Date;
	moonset: Date;
	fraction: number;
	waxing: boolean;
	phaseValue: number;
	angle: number;
}

export const getMoonData = (date: Date = new Date, lat: number, lon: number): MoonData => {
	const dataMoon = SunCalc.getMoonTimes(date, lat, lon);
	const illumination = SunCalc.getMoonIllumination(date);

	return {
		moonrise: dataMoon.rise,
		moonset: dataMoon.set,
		fraction: round(illumination.fraction, 4),
		waxing: illumination.angle < 0,
		phaseValue: illumination.phaseValue,
		angle: illumination.angle
	};
};
