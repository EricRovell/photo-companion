import type { RiseSetInterval } from "moon-sun-calc";

import type { RiseSetWidgetProps } from "../../../types";

export interface RiseSetScenario extends Pick<RiseSetWidgetProps, "aboveHorizon" | "date" | "rise" | "set"> {
	description: string;
	phase?: number;
	title: string;
}

export interface RiseSetSelectionScenario extends Omit<RiseSetScenario, "rise" | "set"> {
	intervals: RiseSetInterval[];
}

// Local fixtures keep the visual states the same in every browser timezone.
export const at = (day: number, hour: number, minute = 0) => new Date(2026, 9, day, hour, minute);

const daytime = { rise: at(21, 6), set: at(21, 18) };
const overnight = { rise: at(21, 20), set: at(22, 8) };

export const visualScenarios: RiseSetScenario[] = [
	{
		...daytime,
		aboveHorizon: false,
		date: at(21, 5),
		description: "Empty arc and no marker before the rise.",
		title: "Before rise"
	},
	{
		...daytime,
		aboveHorizon: false,
		date: at(21, 6),
		description: "The rise event can precede the center reaching zero altitude. Show the endpoint marker while the body stays dim.",
		title: "At rise, center below horizon"
	},
	{
		...daytime,
		aboveHorizon: true,
		date: at(21, 9),
		description: "Three hours into a twelve-hour interval: 25% progress.",
		title: "Above the horizon"
	},
	{
		...daytime,
		aboveHorizon: true,
		date: at(21, 12),
		description: "The marker reaches the top halfway through the interval; this need not be solar noon.",
		title: "Interval midpoint"
	},
	{
		...daytime,
		aboveHorizon: false,
		date: at(21, 18),
		description: "Full arc and endpoint marker while the body is dim.",
		title: "At set"
	},
	{
		...daytime,
		aboveHorizon: false,
		date: at(21, 20),
		description: "The completed arc stays full and the marker disappears.",
		title: "After set"
	},
	{
		...overnight,
		aboveHorizon: true,
		date: at(21, 23),
		description: "The next-day set and midnight notch are relative to the actual event dates.",
		title: "Before midnight"
	},
	{
		...overnight,
		aboveHorizon: true,
		date: at(22, 2),
		description: "The previous-day rise remains active; midnight stays one-third along the arc.",
		title: "After midnight"
	},
	{
		aboveHorizon: true,
		date: at(21, 22),
		description: "Keep the body bright, show the known set, and leave progress unavailable.",
		rise: null,
		set: at(22, 8),
		title: "Rise unavailable"
	},
	{
		aboveHorizon: true,
		date: at(21, 12),
		description: "Keep the body bright, show the known rise, and leave progress unavailable.",
		rise: at(20, 20),
		set: null,
		title: "Set unavailable"
	},
	{
		aboveHorizon: true,
		date: at(21, 12),
		description: "Altitude keeps the body bright even without crossings in the search window.",
		phase: 0.5,
		rise: null,
		set: null,
		title: "Continuously above"
	},
	{
		aboveHorizon: false,
		date: at(21, 12),
		description: "Both times are unavailable, with a dim body and no marker.",
		rise: null,
		set: null,
		title: "Continuously below"
	},
	{
		aboveHorizon: true,
		date: at(21, 23, 55),
		description: "Five minutes into a twenty-minute interval crossing midnight: 25% progress.",
		rise: at(21, 23, 50),
		set: at(22, 0, 10),
		title: "Short interval across midnight"
	},
	{
		aboveHorizon: true,
		date: at(21, 14),
		description: "Elapsed time and both midnight markers remain meaningful beyond a 24-hour interval.",
		rise: at(20, 20),
		set: at(22, 8),
		title: "Long interval"
	}
];

const overnightCycles = [
	{ rise: at(20, 20), set: at(21, 8) },
	{ rise: at(21, 21), set: at(22, 9) }
];

const twoSunrises = [
	{ rise: new Date(2026, 3, 17, 0, 7), set: new Date(2026, 3, 17, 22, 12) },
	{ rise: new Date(2026, 3, 17, 23, 38), set: null }
];

export const selectionScenarios: RiseSetSelectionScenario[] = [
	{
		aboveHorizon: false,
		date: at(21, 12),
		description: "The morning set belongs to the previous cycle. Select tonight's rise and tomorrow's set.",
		intervals: overnightCycles,
		title: "Between overnight cycles"
	},
	{
		aboveHorizon: false,
		date: at(21, 12),
		description: "With no rise today, keep the completed cycle containing today's set.",
		intervals: [ overnightCycles[0], { rise: at(22, 0, 15), set: at(22, 12) } ],
		title: "Only a set today"
	},
	{
		aboveHorizon: true,
		date: at(21, 23),
		description: "Use the actual following set across the calendar boundary.",
		intervals: [ overnight ],
		title: "Only a rise today"
	},
	{
		aboveHorizon: false,
		date: new Date(2026, 3, 17, 0),
		description: "Select the first upcoming rise and its following set.",
		intervals: twoSunrises,
		title: "Two rises: before the first"
	},
	{
		aboveHorizon: false,
		date: new Date(2026, 3, 17, 23),
		description: "The first cycle has ended. Preview the second rise with its set unavailable.",
		intervals: twoSunrises,
		title: "Two rises: before the second"
	},
	{
		aboveHorizon: true,
		date: new Date(2026, 3, 18, 12),
		description: "Retain the preceding rise when the following set is beyond the search window.",
		intervals: twoSunrises,
		title: "Entering polar day"
	}
];
