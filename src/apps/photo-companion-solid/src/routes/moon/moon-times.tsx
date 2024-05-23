import { classnames } from "utils";

import { useTranslation } from "@lib/context";
import { GaugeTime, Moon } from "@lib/components";
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
		<section data-label="moon" class={classnames("card", styles.root)}>
			<header>
				<h2>{t().TITLE.MOON_TIMES}</h2>
			</header>
			<GaugeTime
				date={props.date}
				timeStart={props.state.moonrise}
				timeEnd={props.state.moonset}
			>
				<foreignObject
					x={-MOON_SIZE / 2}
					y={-MOON_SIZE / 2}
					width={MOON_SIZE}
					height={MOON_SIZE}
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
