import { Bulb, GaugeTime } from "~/lib/components";
import { useTranslation } from "~/lib/context/translation";
import { useDatetime } from "~/lib/hooks";
import { useCityLights } from "~/services/city-lights";

export function LightGauge() {
	const { getScheduleByDate, getStateByDate } = useCityLights();
	const { getDatetime } = useDatetime();
	const { t } = useTranslation();

	return (
		<section class="card" data-label="lights-schedule">
			<header>
				<h2>{t().TITLE.LIGHTS_DATA_BY_DATE}</h2>
			</header>
			<GaugeTime
				date={getDatetime()}
				timeEnd={new Date(getScheduleByDate().LIGHTS_END)}
				timeStart={new Date(getScheduleByDate().LIGHTS_START)}
			>
				<Bulb
					glow={getStateByDate().lights}
					height="20"
					width="20"
					x="-10"
					y="-10"
				/>
			</GaugeTime>
		</section>
	);
}
