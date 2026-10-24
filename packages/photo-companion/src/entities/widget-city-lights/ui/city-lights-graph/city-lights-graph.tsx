import { useTranslation } from "~/features/translation";

import { CityLightsGraphSelection } from "../city-lights-graph-selection/city-lights-graph-selection";
import { CityLightsGraphSwitches } from "../city-lights-graph-switches/city-lights-graph-switches";
import { CityLightsGraphTrack } from "../city-lights-graph-track/city-lights-graph-track";
import { CityLightsGraphWindows } from "../city-lights-graph-windows/city-lights-graph-windows";

import type { CityLightsNight } from "../../types";

import styles from "./city-lights-graph.module.css";

interface Props {
	date: Date;
	describedBy: string;
	night: CityLightsNight;
}

export function CityLightsGraph(props: Props) {
	const { format, t } = useTranslation();

	return (
		<div
			aria-describedby={props.describedBy}
			aria-label={t().LIGHTS_WIDGET.NIGHT_SCHEDULE}
			class={styles.schedule}
			role="img"
			tabIndex={0}
			title={`${t().LIGHTS_WIDGET.SELECTED_TIME}: ${format().datetime(props.date)}`}
		>
			<div
				aria-hidden="true"
				class={styles.plot}
			>
				<CityLightsGraphTrack
					intervals={props.night.intervals}
					ticks={props.night.ticks}
				/>
				<CityLightsGraphWindows windows={props.night.windows} />
				<CityLightsGraphSwitches events={props.night.events} />
				<CityLightsGraphSelection
					date={props.date}
					position={props.night.position}
				/>
			</div>
		</div>
	);
}
