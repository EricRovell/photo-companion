import { getScheduleStateByDate } from "../schedule";
import { getSunData } from "../suncalc/sun";
import { getMoonData } from "../suncalc/moon";
import { LAT, LON } from "../../constants";
import type { EventName } from "../../types";

interface TimelineEntry {
	name: EventName;
	timestamp: number;
}

export const getTimeline = (date = new Date()) => {
	const scheduleDate = getScheduleStateByDate(date.getTime());
	const sunData = getSunData(date, LAT, LON);
	const moonData = getMoonData(date, LAT, LON);

	let entries: TimelineEntry[] = [];

	if (scheduleDate) {
		entries.push(
			{
				name: "lights-on",
				timestamp: scheduleDate.timestampOn
			},
			{
				name: "lights-off",
				timestamp: scheduleDate.timestampOff
			}
		);
	}

	entries.push(
		{
			name: "sunrise",
			timestamp: sunData.sunriseStart.value.getTime()
		},
		{
			name: "sunset",
			timestamp: sunData.sunsetEnd.value.getTime()
		}
	);

	entries.push(
		{
			name: "moonrise",
			timestamp: moonData.moonrise.getTime()
		},
		{
			name: "moonset",
			timestamp: moonData.moonset.getTime()
		}
	);

	const today = new Date().getTime();

	entries = entries.filter(item => item.timestamp >= today);
	entries.sort((a, b) => a.timestamp - b.timestamp);

	return entries;
};
