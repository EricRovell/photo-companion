import { classnames } from "utils";

import { t } from "@lib/stores/lang";
import { GaugeTime, Moon } from "@lib/components";
import { getAngleFromTime } from "@lib/helpers";
import styles from "./moon.module.css";
import type { MoonData } from "../../services/moon";

interface MoonTimesProps {
	date: Date;
	state: MoonData
}

const MOON_SIZE = 48;

export const MoonTimes = (props: MoonTimesProps) => (
	<section data-label="moon" class={classnames("card", styles.root)}>
		<header>
			<h2>{t().TITLE.MOON_TIMES}</h2>
		</header>
		<GaugeTime
			date={props.date}
			timeStart={props.state.moonrise}
			timeEnd={props.state.moonset}
			pointerAngle={getAngleFromTime(props.date)}
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
