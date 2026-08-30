import type { LightsScheduleStatus } from "types";

import type { Translation } from "~/features/translation";

export function getLightsScheduleStatusMessage(
	status: LightsScheduleStatus,
	translation: Translation
): null | string {
	switch (status) {
		case "CONTINUOUS_DARKNESS":
			return translation.MESSAGE.LIGHTS_CONTINUOUS_DARKNESS;
		case "CONTINUOUS_DAYLIGHT":
			return translation.MESSAGE.LIGHTS_CONTINUOUS_DAYLIGHT;
		case "UNAVAILABLE":
			return translation.MESSAGE.LIGHTS_SCHEDULE_UNAVAILABLE;
		default:
			return null;
	}
}
