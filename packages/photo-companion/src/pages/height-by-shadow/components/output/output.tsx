import { getSunPosition, getSunTimeByAzimuth } from "moon-sun-calc";
import { convertDegreesIntoDecimal } from "utils/math";

import { useTranslation } from "~/features/translation";

import type { Model} from "../../height-by-shadow.context";

import styles from "./output.module.css";

interface Props {
	altitude?: null | number;
	height?: null | number;
}

export function calcOutput(model: Model) {
	const latitude = (model.latitude_direction === "N" ? 1 : -1) * convertDegreesIntoDecimal(model.latitude);
	const longitude = (model.longitude_direction === "E" ? 1 : -1) * convertDegreesIntoDecimal(model.longitude);
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
	const { format, t } = useTranslation();

	return (
		<output class={styles.output}>
			{t().LABEL.HEIGHT}: <span class={styles.value}>{format().meters(props.height ?? 0)}</span>
		</output>
	);
}
