import { findSunAzimuthCrossings } from "moon-sun-calc";
import { For } from "solid-js";
import { convertDegreesIntoDecimal } from "utils/math";

import { useTranslation } from "~/features/translation";

import type { Model} from "../../height-by-shadow.context";

import styles from "./output.module.css";

interface Props {
	candidates: ReturnType<typeof calcOutput>;
}

export function calcOutput(model: Model) {
	const latitude = (model.latitude_direction === "N" ? 1 : -1) * convertDegreesIntoDecimal(model.latitude);
	const longitude = (model.longitude_direction === "E" ? 1 : -1) * convertDegreesIntoDecimal(model.longitude);

	const year = model.date.getUTCFullYear();
	const month = model.date.getUTCMonth();
	const day = model.date.getUTCDate();
	const start = new Date(year, month, day).getTime();
	const end = new Date(year, month, day + 1).getTime();

	const crossings = findSunAzimuthCrossings({
		azimuth: model.solar_azimuth_angle,
		interval: { end, start },
		observer: { latitude, longitude }
	});

	const diff = (model.level_shadow ?? 0) - (model.level_object ?? 0);

	return crossings
		.filter(crossing => crossing.apparentAltitude > 0)
		.map(crossing => ({
			altitude: crossing.apparentAltitude,
			height: model.length_shadow * Math.tan(crossing.apparentAltitude * Math.PI / 180) + diff,
			time: crossing.time
		}));
}

export function Output(props: Props) {
	const { format, t } = useTranslation();

	return (
		<output class={styles.output}>
			<For each={props.candidates}>
				{candidate => (
					<p>
						{t().LABEL.TIME}: {format().timeShort(candidate.time)} · {t().LABEL.ALTITUDE}: {format().degrees(candidate.altitude)} · {t().LABEL.HEIGHT}: <span class={styles.value}>{format().meters(candidate.height)}</span>
					</p>
				)}
			</For>
		</output>
	);
}
