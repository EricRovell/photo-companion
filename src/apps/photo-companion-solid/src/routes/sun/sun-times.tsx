import { GaugeTime, Sun } from "@lib/components";
import { useTranslation } from "@lib/context";

import type { SunData } from "./use-sun-data";

interface SunTimesProps {
	date: Date;
	state: SunData
}

const SUN_SIZE = 30;

export function SunTimes(props: SunTimesProps) {
	const { t } = useTranslation();

	return (
		<section class={"card"} data-label="sun">
			<header>
				<h2>{t().TITLE.SUN_TIMES}</h2>
			</header>
			<GaugeTime
				date={props.date}
				timeEnd={props.state.sunset}
				timeStart={props.state.sunrise}
			>
				<Sun
					height={SUN_SIZE}
					width={SUN_SIZE}
					x={-SUN_SIZE / 2}
					y={-SUN_SIZE / 2}
				/>
			</GaugeTime>
		</section>
	);
}
