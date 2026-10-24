import type { RiseSetWidgetProps } from "../types";

type SummaryOptions = Pick<RiseSetWidgetProps, "aboveHorizon" | "belowHorizonInterval" | "date" | "nextRise" | "rise" | "set">;

export function getRiseSetSummary(options: SummaryOptions) {
	const current = options.date.getTime();
	// Event links have whole seconds; calculator events can include milliseconds.
	const atEvent = (event: Nullish<Date>) => !!event && (
		event.getTime() === current ||
		(current % 1000 === 0 && Math.floor(event.getTime() / 1000) === current / 1000)
	);

	const upcoming = (event: Nullish<Date>) => !!event && event.getTime() > current && !atEvent(event);
	const untilSet = options.aboveHorizon && (!options.set || upcoming(options.set)) && !atEvent(options.rise);
	const nextEvent = untilSet ? options.set : options.nextRise ?? null;
	const start = options.aboveHorizon ? options.rise : options.belowHorizonInterval?.start ?? null;
	const end = options.aboveHorizon ? options.set : options.belowHorizonInterval?.end ?? null;

	return {
		end,
		nextEvent,
		start,
		untilSet
	};
}
