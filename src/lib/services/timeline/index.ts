import { getScheduleStateByDate } from "../schedule";
import { calcEphemeridesData } from "../suncalc";
import { LAT, LON } from "../../constants";

interface TimelineEntry {
	name: string;
	timestamp: number;
}

export const getTimeline = (date = new Date()) => {
	const scheduleDate = getScheduleStateByDate(date.getTime());
	const ephemerisData = calcEphemeridesData(date, LAT, LON);

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

	for (const [ key, { date } ] of Object.entries(ephemerisData)) {
		entries.push(
			{
				name: key,
				timestamp: date.getTime()
			}
		);
	}

	const today = new Date().getTime();

	entries = entries.filter(item => item.timestamp >= today);
	entries.sort((a, b) => a.timestamp - b.timestamp);

	return entries;
};
