import { isNullable } from "utils/validators";

import {
	clamp,
	normalizeSignedDegrees,
	toDegrees,
	toRadians
} from "../shared";

import type { Degree } from "../types";

interface Vector {
	x: number;
	y: number;
	z: number;
}

function horizontalVector(azimuth: Degree, altitude: Degree): Vector {
	const azimuthRadians = toRadians(azimuth);
	const altitudeRadians = toRadians(altitude);
	const horizontal = Math.cos(altitudeRadians);

	return {
		x: horizontal * Math.sin(azimuthRadians),
		y: horizontal * Math.cos(azimuthRadians),
		z: Math.sin(altitudeRadians)
	};
}

function dot(left: Vector, right: Vector): number {
	return left.x * right.x + left.y * right.y + left.z * right.z;
}

export function angularRadius(radius: number, distance?: number): Degree {
	if (isNullable(distance)) {
		throw new Error("Topocentric distance is required for eclipse calculations");
	}

	return toDegrees(Math.asin(clamp({ maximum: 1, minimum: -1, value: radius / distance })));
}

export function angularSeparation(
	leftLongitude: Degree,
	leftLatitude: Degree,
	rightLongitude: Degree,
	rightLatitude: Degree
): Degree {
	const leftLatitudeRadians = toRadians(leftLatitude);
	const rightLatitudeRadians = toRadians(rightLatitude);
	const longitudeDifference = toRadians(normalizeSignedDegrees(leftLongitude - rightLongitude));
	const cosine = Math.sin(leftLatitudeRadians) * Math.sin(rightLatitudeRadians)
		+ Math.cos(leftLatitudeRadians) * Math.cos(rightLatitudeRadians) * Math.cos(longitudeDifference);

	return toDegrees(Math.acos(clamp({ maximum: 1, minimum: -1, value: cosine })));
}

export function circleOverlapArea(leftRadius: Degree, rightRadius: Degree, separation: Degree): number {
	if (separation >= leftRadius + rightRadius) {
		return 0;
	}

	if (separation <= Math.abs(leftRadius - rightRadius)) {
		return Math.PI * Math.min(leftRadius, rightRadius) ** 2;
	}

	const leftTerm = Math.acos(clamp({
		maximum: 1,
		minimum: -1,
		value: (separation ** 2 + leftRadius ** 2 - rightRadius ** 2) / (2 * separation * leftRadius)
	}));

	const rightTerm = Math.acos(clamp({
		maximum: 1,
		minimum: -1,
		value: (separation ** 2 + rightRadius ** 2 - leftRadius ** 2) / (2 * separation * rightRadius)
	}));

	const triangle = 0.5 * Math.sqrt(Math.max(0,
		(-separation + leftRadius + rightRadius)
		* (separation + leftRadius - rightRadius)
		* (separation - leftRadius + rightRadius)
		* (separation + leftRadius + rightRadius)
	));

	return leftRadius ** 2 * leftTerm + rightRadius ** 2 * rightTerm - triangle;
}

export function getHorizontalOffsets(
	centerAzimuth: Degree,
	centerAltitude: Degree,
	targetAzimuth: Degree,
	targetAltitude: Degree
): { altitude: Degree; azimuth: Degree } {
	const centerAzimuthRadians = toRadians(centerAzimuth);
	const centerAltitudeRadians = toRadians(centerAltitude);
	const center = horizontalVector(centerAzimuth, centerAltitude);
	const target = horizontalVector(targetAzimuth, targetAltitude);

	const azimuthBasis = {
		x: Math.cos(centerAzimuthRadians),
		y: -Math.sin(centerAzimuthRadians),
		z: 0
	};

	const altitudeBasis = {
		x: -Math.sin(centerAltitudeRadians) * Math.sin(centerAzimuthRadians),
		y: -Math.sin(centerAltitudeRadians) * Math.cos(centerAzimuthRadians),
		z: Math.cos(centerAltitudeRadians)
	};

	const forward = dot(target, center);

	return {
		altitude: toDegrees(Math.atan2(dot(target, altitudeBasis), forward)),
		azimuth: toDegrees(Math.atan2(dot(target, azimuthBasis), forward))
	};
}
