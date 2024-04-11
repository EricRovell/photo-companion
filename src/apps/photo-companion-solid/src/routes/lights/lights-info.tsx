import type { LightsCity, LightsSchedule } from "types";
import { createEffect, createSignal } from "solid-js";
import { createTimeoutLoop } from "ui-solid/primitives";

import { t } from "@stores/lang";
import { CardEntry, CardInfo } from "@lib/components";
import { formatTimeDuration } from "@stores/lang";
import { useLightsProvider } from "../../services/lights";

interface Props {
	schedule: LightsSchedule;
	city: LightsCity;
	lights: boolean;
}

function LightsCountdown(props: { lights: boolean }) {
	const { provider } = useLightsProvider();
	const getState = () => provider().getStateByDate();

	const [ time, setTime ] = createSignal(getState().timestamp - Date.now());

	const handleIncrement = () => setTime(value => value - 1000);

	createTimeoutLoop(handleIncrement, 1000);

	createEffect(() => {
		if (time() <= 0) {
			const { timestamp } = getState();
			setTime(timestamp - Date.now());
		}
	});

	return (
		<CardEntry property={props.lights ? t().LABEL.TILL_TURNED_OFF : t().LABEL.TILL_TURNED_ON}>
			{formatTimeDuration(time())}
		</CardEntry>
	);
}

export const LightsInfo = (props: Props) => {

	

	return (
		<CardInfo>
			<CardEntry property={t().LABEL.CITY}>
				{t().CITIES[props.city ?? "SAINT_PETERSBURG"]}
			</CardEntry>
			<CardEntry property={t().LABEL.LIGHTS_CITY}>
				{props.lights ? t().LABEL.TURNED_ON : t().LABEL.TURNED_OFF}
			</CardEntry>
			<CardEntry property={t().LABEL.DURATION_LIGHTS}>
				{formatTimeDuration(props.schedule.duration)}
			</CardEntry>
			<LightsCountdown lights={props.lights} />
		</CardInfo>
	);
};
