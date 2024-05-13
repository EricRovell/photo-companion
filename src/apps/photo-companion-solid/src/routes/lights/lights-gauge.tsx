import { t } from "@stores/lang";
import { Bulb, GaugeTime } from "@lib/components";
import type { LightsSchedule } from "types";

interface Props {
	date: Date;
	schedule: LightsSchedule;
	lights: boolean;
}

export const LightGauge = (props: Props) => (
	<section data-label="lights-schedule" class="card">
		<header>
			<h2>{t().TITLE.LIGHTS_DATA_BY_DATE}</h2>
		</header>
		<GaugeTime
			date={props.date}
			timeStart={new Date(props.schedule.LIGHTS_START)}
			timeEnd={new Date(props.schedule.LIGHTS_END)}
		>
			<Bulb
				x="-10"
				y="-10"
				width="20"
				height="20"
				glow={props.lights}
			/>
		</GaugeTime>
	</section>
);
