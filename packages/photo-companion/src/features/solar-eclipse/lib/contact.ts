import { getEclipseContactLinkTime } from "~/entities/eclipse";

import type { SolarEclipseContactPosition } from "../model/types";

export function getSolarEclipseContactLinkTime(
	time: Date,
	position: SolarEclipseContactPosition
): Date {
	return getEclipseContactLinkTime(time, position);
}
