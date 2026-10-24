import { useTranslation } from "~/features/translation";

import { getCityLightsLabelEdge } from "../../lib";

import styles from "./city-lights-graph-selection.module.css";

interface Props {
	date: Date;
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
			<span>{format().timeShort(props.date)}</span>
		</div>
	);
}
