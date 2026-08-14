import type { TimelineEvent } from "~/entities/timeline-event/types";

interface TimelineEntry {
	date: Date;
	items: TimelineEvent[];
}

export interface EventsProps {
	timeline: TimelineEntry[];
}
