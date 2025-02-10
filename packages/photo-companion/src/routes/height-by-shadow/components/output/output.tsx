import { getSunPosition, getSunTimeByAzimuth } from "moon-sun-calc";

import { useTranslation } from "~/services/translation";

import type { Model} from "../../height-by-shadow.context";

import styles from "./output.module.css";

interface Props {
	altitude?: null | number;
	height?: null | number;
}

export function calcOutput(model: Model) {
	const latitude = model.latitude_direction === "N" ? model.latitude : -model.latitude;
	const longitude = model.longitude_direction === "E" ? model.longitude : -model.longitude;
	const datetime = getSunTimeByAzimuth(model.date, latitude, longitude, model.solar_azimuth_angle, true);
	const altitude = getSunPosition(datetime, latitude, longitude).altitude;

	const diff = (model.level_shadow ?? 0) - (model.level_object ?? 0);
	const height = model.length_shadow * Math.tan(altitude) + diff;

	return {
		altitude,
		height
	};
}

export function Output(props: Props) {
	const { formatters, t } = useTranslation();

	return (
		<output class={styles.output}>
			{t().LABEL.HEIGHT}: <span class={styles.value}>{formatters().formatMeters(props.height ?? 0)}</span>
		</output>
	);
}
