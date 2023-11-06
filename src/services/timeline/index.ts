import { getLightsScheduleByDate } from "../lights";
import { getSunData } from "../sun";
import { getMoonData } from "../moon";
import { LAT, LON } from "@lib/constants";
import type { EventName } from "@lib/types";

interface TimelineEntry {
	name: EventName;
	timestamp: number;
}

export const getTimeline = (date = new Date()) => {
	const scheduleDate = getLightsScheduleByDate(date);
	const sunData = getSunData(date, LAT, LON);
	const moonData = getMoonData(date, LAT, LON);

	let entries: TimelineEntry[] = [];

	if (scheduleDate) {
		entries.push(
			{
				name: "lights:start",
				timestamp: scheduleDate["lights:start"]
			},
			{
				name: "lights:end",
				timestamp: scheduleDate["lights:end"]
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
