import { isNullable } from "utils/validators";

import type { LocalLunarEclipse, LunarEclipseContact } from "moon-sun-calc";

import type { EclipseContactPosition } from "~/entities/eclipse";
import type { Translation } from "~/features/translation";

export interface LunarEclipseContactStage {
	code?: string;
	contact: LunarEclipseContact;
	label: string;
	position: EclipseContactPosition;
}

type LunarEclipseContactStageLabels = Pick<
	Translation["LUNAR_ECLIPSE"],
	| "MAXIMUM"
	| "PARTIAL_BEGIN"
	| "PARTIAL_END"
	| "PENUMBRAL_BEGIN"
	| "PENUMBRAL_END"
	| "TOTAL_BEGIN"
	| "TOTAL_END"
>;

export function getContactStages(
	event: LocalLunarEclipse,
	labels: LunarEclipseContactStageLabels
): LunarEclipseContactStage[] {
	const stages: LunarEclipseContactStage[] = [
		{ code: "P1", contact: event.penumbralBegin, label: labels.PENUMBRAL_BEGIN, position: "begin" }
	];

	if (!isNullable(event.partialBegin)) {
		stages.push({
			code: "U1",
			contact: event.partialBegin,
			label: labels.PARTIAL_BEGIN,
			position: "begin"
		});
	}

	if (!isNullable(event.totalBegin)) {
		stages.push({
			code: "U2",
			contact: event.totalBegin,
			label: labels.TOTAL_BEGIN,
			position: "begin"
		});
	}

	stages.push({
		contact:
		event.peak,
		label:
		labels.MAXIMUM,
		position: "peak"
	});

	if (!isNullable(event.totalEnd)) {
		stages.push({
			code: "U3",
			contact:
			event.totalEnd,
			label: labels.TOTAL_END,
			position: "end"
		});
	}

	if (!isNullable(event.partialEnd)) {
		stages.push({
			code: "U4",
			contact: event.partialEnd,
			label: labels.PARTIAL_END,
			position: "end"
		});
	}

	stages.push({
		code: "P4",
		contact: event.penumbralEnd,
		label: labels.PENUMBRAL_END,
		position: "end"
	});

	return stages;
}
