import { getDayStart, shiftDate } from "utils/date";
import { normalizeDegrees, polarToCartesian } from "utils/math";

import { AZIMUTH_WIDGET_CONFIG } from "../config";

import type { AzimuthPathPoint } from "../types";

type GetPosition = (instant: Date) => AzimuthPathPoint;

function getHorizonCrossing(from: AzimuthPathPoint, to: AzimuthPathPoint) {
	const progress = -from.altitude / (to.altitude - from.altitude);
	let azimuthDelta = (to.azimuth - from.azimuth) % 360;

	if (azimuthDelta > 180) {
		azimuthDelta -= 360;
	} else if (azimuthDelta < -180) {
		azimuthDelta += 360;
	}

	return {
		altitude: 0,
		azimuth: normalizeDegrees(from.azimuth + azimuthDelta * progress)
	};
}

export function buildHorizonTrackPath(
	points: AzimuthPathPoint[],
	aboveHorizon: boolean,
	heading: number,
	center: number,
	radius: number
) {
	if (points.length === 0) {
		return "";
	}

	const commands: string[] = [];
	let previous = points[0];
	let previousMatches = (previous.altitude >= 0) === aboveHorizon;

	if (previousMatches) {
		commands.push(toMoveCommand(previous, heading, center, radius));
	}

	// Close the last sample back to the first so the visual track remains a
	// complete circle despite the Moon's day-to-day azimuth drift.
	for (const current of [ ...points.slice(1), points[0] ]) {
		const currentMatches = (current.altitude >= 0) === aboveHorizon;

		if (previousMatches && currentMatches) {
			commands.push(toArcCommand(previous, current, heading, center, radius));
		} else if (previousMatches) {
			commands.push(toArcCommand(previous, getHorizonCrossing(previous, current), heading, center, radius));
		} else if (currentMatches) {
			const crossing = getHorizonCrossing(previous, current);

			commands.push(toMoveCommand(crossing, heading, center, radius));
			commands.push(toArcCommand(crossing, current, heading, center, radius));
		}

		previous = current;
		previousMatches = currentMatches;
	}

	return commands.join(" ");
}

export function createAzimuthPath(date: Date, getPosition: GetPosition) {
	const start = getDayStart(date);
	const end = shiftDate(start, "day", 1).getTime();
	const interval = (end - start) / (AZIMUTH_WIDGET_CONFIG.path.sampleCount - 1);

	return Array.from(
		{ length: AZIMUTH_WIDGET_CONFIG.path.sampleCount },
		(_, index) => getPosition(new Date(start + interval * index))
	);
}

function toArcCommand(
	from: AzimuthPathPoint,
	to: AzimuthPathPoint,
	heading: number,
	center: number,
	radius: number
) {
	const coordinates = polarToCartesian(center, center, radius, to.azimuth - heading);
	let azimuthDelta = (to.azimuth - from.azimuth) % 360;

	if (azimuthDelta > 180) {
		azimuthDelta -= 360;
	} else if (azimuthDelta < -180) {
		azimuthDelta += 360;
	}

	const sweep = azimuthDelta >= 0 ? 1 : 0;

	return `A${radius} ${radius} 0 0 ${sweep} ${coordinates.x.toFixed(2)} ${coordinates.y.toFixed(2)}`;
}

function toMoveCommand(
	point: AzimuthPathPoint,
	heading: number,
	center: number,
	radius: number
) {
	const coordinates = polarToCartesian(center, center, radius, point.azimuth - heading);

	return `M${coordinates.x.toFixed(2)} ${coordinates.y.toFixed(2)}`;
}
