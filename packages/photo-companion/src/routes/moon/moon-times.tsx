import { classnames } from "utils";

import { GaugeTime, Moon } from "~/lib/components";
import { useTranslation } from "~/lib/context/translation";

import type { MoonData } from "./use-moon-data";

import styles from "./moon.module.css";

interface MoonTimesProps {
	date: Date;
	state: MoonData
}

const MOON_SIZE = 48;

export function MoonTimes(props: MoonTimesProps) {
	const { t } = useTranslation();

	return (
		<section class={classnames("card", styles.root)} data-label="moon">
			<header>
				<h2>{t().TITLE.MOON_TIMES}</h2>
			</header>
			<GaugeTime
				date={props.date}
				timeEnd={props.state.moonset}
				timeStart={props.state.moonrise}
			>
				<foreignObject
					height={MOON_SIZE}
					width={MOON_SIZE}
					x={-MOON_SIZE / 2}
					y={-MOON_SIZE / 2}
				>
					<Moon
						phase={props.state.phaseValue}
						rotation={props.state.rotation}
						size={MOON_SIZE}
					/>
				</foreignObject>
			</GaugeTime>
		</section>
	);
}
