import { Bulb } from "~/entities/city-lights";
import { useTranslation } from "~/features/translation";

import { getCityLightsLabelEdge } from "../../lib";

import styles from "./city-lights-graph-selection.module.css";

interface Props {
	date: Date;
	lights: boolean;
	position: number;
}

export function CityLightsGraphSelection(props: Props) {
	const { format } = useTranslation();

	return (
		<div
			class={styles.selected}
			data-edge={getCityLightsLabelEdge(props.position)}
			style={{ left: `${props.position}%` }}
		>
			<Bulb
				aria-hidden="true"
				class={styles.bulb}
				glow={props.lights}
				height="24"
				width="24"
			/>
			<span>{format().timeShort(props.date)}</span>
		</div>
	);
}
