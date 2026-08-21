import {
	findNextLocalLunarEclipse,
	findPreviousLocalLunarEclipse,
	getLunarEclipseState,
	getNearbyLocalLunarEclipse
} from "moon-sun-calc";
import { createMemo } from "solid-js";
import { isNullable } from "utils/validators";

import { useDatetime } from "~/features/datetime-query";
import { useSettings } from "~/features/settings";

import { ECLIPSE_CONTEXT_MARGIN } from "../config";

import type { LunarEclipseDirection } from "../types";

export function useLunarEclipse() {
	const { getDatetime, setDatetimeQuery } = useDatetime();
	const { settings } = useSettings();
	const latitude = () => settings.latitude;
	const longitude = () => settings.longitude;
	const observer = () => ({ latitude: latitude(), longitude: longitude() });

	const state = createMemo(() => getLunarEclipseState({ instant: getDatetime(), observer: observer() }));

	const event = createMemo(() => getNearbyLocalLunarEclipse({
		instant: getDatetime(),
		margin: ECLIPSE_CONTEXT_MARGIN,
		observer: observer()
	}));

	const navigate = (direction: LunarEclipseDirection) => {
		const input = {
			instant: getDatetime(),
			observer: observer(),
			visibleOnly: true
		};

		const target = direction === "next"
			? findNextLocalLunarEclipse(input)
			: findPreviousLocalLunarEclipse(input);

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
