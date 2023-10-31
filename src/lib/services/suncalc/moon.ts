// @ts-expect-error: no types for this package
import SunCalc from "suncalc3";
import { round } from "../../helpers";

interface Time {
	angle: number;
	date: Date;
	time: string;
}

const calcTime = (date: Date): Time => {
	const hours = date.getHours();
	const minutes = date.getMinutes();
	const angle = Math.round(360 * (hours * 60 + minutes) / (24 * 60));

	return {
		angle,
		date,
		time: new Intl.DateTimeFormat("ru-RU", {
			hour: "2-digit",
			minute: "2-digit",
			hour12: false
		}).format(date)
	};
};

export const getMoonData = (date: Date = new Date, lat: number, lon: number): EphemeridesTime => {
	const dataMoon = SunCalc.getMoonTimes(date, lat, lon);
	const illumination = SunCalc.getMoonIllumination(date);

	return {
		moonrise: calcTime(dataMoon.rise),
		moonset: calcTime(dataMoon.set),
		fraction: round(illumination.fraction, 5),
		waxing: illumination.angle < 0,
		phaseValue: illumination.phaseValue,
		angle: illumination.angle
	};
};
