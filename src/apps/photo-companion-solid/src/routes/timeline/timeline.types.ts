import type { TimelineEvent } from "types";

interface TimelineEntry {
	date: Date;
	items: TimelineEvent[];
}

export interface EventsProps {
	timeline: TimelineEntry[];
}
