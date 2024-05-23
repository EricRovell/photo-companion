import { useTranslation } from "@lib/context";
import { GaugeTime, Sun } from "@lib/components";
import type { SunData } from "./use-sun-data";

interface SunTimesProps {
	date: Date;
	state: SunData
}

const SUN_SIZE = 30;

export function SunTimes(props: SunTimesProps) {
	const { t } = useTranslation();

	return (
		<section data-label="sun" class={"card"}>
			<header>
				<h2>{t().TITLE.SUN_TIMES}</h2>
			</header>
			<GaugeTime
				date={props.date}
				timeStart={props.state.sunrise}
				timeEnd={props.state.sunset}
			>
				<Sun
					x={-SUN_SIZE / 2}
					y={-SUN_SIZE / 2}
					width={SUN_SIZE}
					height={SUN_SIZE}
				/>
			</GaugeTime>
		</section>
	);
}
