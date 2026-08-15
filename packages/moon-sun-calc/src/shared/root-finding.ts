import { normalizeSignedDegrees } from "./math";

import type { Degree, Meter, Millisecond } from "../types";
import type {
	MeridianCrossing,
	MeridianCrossingsInput,
	RefineMinimumInput,
	RefineRootInput,
	RootSearchInput
} from "./types";

const DEFAULT_REFINEMENT_TOLERANCE: Millisecond = 100;

export function refineMinimum({
	fn,
	left,
	right,
	tolerance = DEFAULT_REFINEMENT_TOLERANCE
}: RefineMinimumInput): Millisecond {
	const ratio = (Math.sqrt(5) - 1) / 2;
	let leftMiddle = right - ratio * (right - left);
	let rightMiddle = left + ratio * (right - left);
	let leftValue = fn(leftMiddle);
	let rightValue = fn(rightMiddle);

	for (let index = 0; index < 100 && right - left > tolerance; index += 1) {
		if (leftValue <= rightValue) {
			right = rightMiddle;
			rightMiddle = leftMiddle;
			rightValue = leftValue;
			leftMiddle = right - ratio * (right - left);
			leftValue = fn(leftMiddle);
		} else {
			left = leftMiddle;
			leftMiddle = rightMiddle;
			leftValue = rightValue;
			rightMiddle = left + ratio * (right - left);
			rightValue = fn(rightMiddle);
		}
	}

	return (left + right) / 2;
}

export function refineRoot({
	fn,
	left,
	right,
	tolerance = DEFAULT_REFINEMENT_TOLERANCE
}: RefineRootInput): Millisecond {
	let leftValue = fn(left);

	for (let index = 0; index < 60 && right - left > tolerance; index += 1) {
		const middle = (left + right) / 2;
		const middleValue = fn(middle);

		if (Math.sign(leftValue) === Math.sign(middleValue)) {
			left = middle;
			leftValue = middleValue;
		} else {
			right = middle;
		}
	}

	return (left + right) / 2;
}

export function roots({
	end,
	fn,
	isContinuous = () => true,
	start,
	step
}: RootSearchInput): Millisecond[] {
	const result: Millisecond[] = [];
	let previousTime = start;
	let previousValue = fn(start);

	for (let time = Math.min(start + step, end); time <= end; time = Math.min(time + step, end)) {
		const value = fn(time);

		if ((previousValue === 0 || value === 0 || Math.sign(previousValue) !== Math.sign(value))
			&& isContinuous(previousValue, value)) {
			const root = previousValue === 0
				? previousTime
				: value === 0
					? time
					: refineRoot({ fn, left: previousTime, right: time });
			if (root >= start && root < end && (result.length === 0 || root - result[result.length - 1] > 1000)) {
				result.push(root);
			}
		}

		if (time === end) {
			break;
		}

		previousTime = time;
		previousValue = value;
	}

	return result;
}

export function horizonDip(elevation: Meter): Degree {
	return elevation > 0 ? 1.76 * Math.sqrt(elevation) / 60 : 0;
}

export function meridianCrossings({
	end,
	hourAngle,
	start,
	step
}: MeridianCrossingsInput): MeridianCrossing[] {
	const transit = roots({
		end,
		fn: hourAngle,
		isContinuous: (left, right) => Math.abs(left - right) < 180,
		start,
		step
	})
		.map(time => ({ kind: "transit" as const, time }));

	const antiValue = (time: Millisecond) => normalizeSignedDegrees(hourAngle(time) - 180);

	const anti = roots({
		end,
		fn: antiValue,
		isContinuous: (left, right) => Math.abs(left - right) < 180,
		start,
		step
	})
		.map(time => ({ kind: "anti" as const, time }));

	return [ ...transit, ...anti ].sort((left, right) => left.time - right.time);
}
