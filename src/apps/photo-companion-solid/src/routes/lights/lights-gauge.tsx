import type { LightsSchedule } from "types";

import { Bulb, GaugeTime } from "@lib/components";
import { useTranslation } from "@lib/context";

interface Props {
	date: Date;
	lights: boolean;
	schedule: LightsSchedule;
}

export function LightGauge(props: Props) {
	const { t } = useTranslation();

	return (
		<section class="card" data-label="lights-schedule">
			<header>
				<h2>{t().TITLE.LIGHTS_DATA_BY_DATE}</h2>
			</header>
			<GaugeTime
				date={props.date}
				timeEnd={new Date(props.schedule.LIGHTS_END)}
				timeStart={new Date(props.schedule.LIGHTS_START)}
			>
				<Bulb
					glow={props.lights}
					height="20"
					width="20"
					x="-10"
					y="-10"
				/>
			</GaugeTime>
		</section>
	);
}
