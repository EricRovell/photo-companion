import {
	findNextLocalSolarEclipse,
	findPreviousLocalSolarEclipse,
	getNearbyLocalSolarEclipse,
	getSolarEclipseState
} from "moon-sun-calc";
import { createMemo } from "solid-js";
import { isNullable } from "utils/validators";

import { useDatetime } from "~/features/datetime-query";
import { useSettings } from "~/features/settings";

import { ECLIPSE_CONTEXT_MARGIN } from "../config";

import type { SolarEclipseDirection } from "./types";

export function useSolarEclipse() {
	const { getDatetime, setDatetimeQuery } = useDatetime();
	const { settings } = useSettings();

	const latitude = () => settings.latitude;
	const longitude = () => settings.longitude;
	const observer = () => ({ latitude: latitude(), longitude: longitude() });

	const state = createMemo(() => getSolarEclipseState({ instant: getDatetime(), observer: observer() }));
	const event = createMemo(() => getNearbyLocalSolarEclipse({
		instant: getDatetime(),
		margin: ECLIPSE_CONTEXT_MARGIN,
		observer: observer()
	}));

	const navigate = (direction: SolarEclipseDirection) => {
		const input = {
			instant: getDatetime(),
			observer: observer(),
			visibleOnly: true
		};

		const target = direction === "next"
			? findNextLocalSolarEclipse(input)
			: findPreviousLocalSolarEclipse(input);

		if (!isNullable(target)) {
			setDatetimeQuery(target.peak.time);
		}
	};

	return {
		event,
		latitude,
		longitude,
		navigate,
		state
	};
}
