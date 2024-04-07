import { t } from "@stores/lang";
import { CardInfo } from "@lib/components";
import { formatTimeDuration } from "@stores/lang";
import type { IlluminationState, LightsSchedule } from "types";
import type { LightsProvider } from "lights-schedule";

/**
 * TODO: timer
 */

export const LightsInfo = (props: { provider: LightsProvider, schedule: LightsSchedule, state: IlluminationState }) => {

	return (
		<CardInfo
			data={{
				[t().LABEL.CITY]: t().CITIES[props.provider.city ?? "SAINT_PETERSBURG"],
				[t().LABEL.LIGHTS_CITY]: props.state.lights ? t().LABEL.TURNED_ON : t().LABEL.TURNED_OFF,
				[t().LABEL.DURATION_LIGHTS]: formatTimeDuration(props.schedule.duration),
				/* [timerMessage]: formatTimeDuration($timer) */
			}}
		/>
	);
};
