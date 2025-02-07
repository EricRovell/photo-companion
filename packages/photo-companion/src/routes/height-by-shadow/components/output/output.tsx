import { getSunPosition, getSunTimeByAzimuth } from "moon-sun-calc";
import { createMemo, Match, Show, Switch } from "solid-js";
import { isNullable } from "utils/validators";

import { useTranslation } from "@lib/context/translation";

import { useForm } from "../../height-by-shadow.context";

import styles from "./output.module.css";

function useOutput() {
	const { hasError, store } = useForm();

	const getSolarAltitude = createMemo(() => {
		if (hasError() || isNullable(store.date) || Number.isNaN(store.solar_azimuth_angle)) {
			return null;
		}

		const datetime = getSunTimeByAzimuth(store.date, store.latitude, store.longitude, store.solar_azimuth_angle, true);
		const position = getSunPosition(datetime, store.latitude, store.longitude);

		return position.altitude;
	});

	const getHeight = createMemo(() => {
		const altitude = getSolarAltitude();

		if (isNullable(altitude)) {
			return null;
		}

		const diff = (store.level_shadow ?? 0) - (store.level_object ?? 0);
		return store.length_shadow * Math.tan(altitude) + diff;
	});

	const isSunBelowHorizon = createMemo(() => {
		const altitude = getSolarAltitude();
		return !isNullable(altitude) && altitude < 0;
	});

	const isInvalidInput = createMemo(() => {
		const height = getHeight();
		return !isNullable(height) && height < 0;
	});

	return {
		getHeight,
		getSolarAltitude,
		isInvalidInput,
		isSunBelowHorizon
	};
}

export function Output() {
	const { hasError } = useForm();
	const { formatters, t } = useTranslation();
	const { getHeight, isInvalidInput, isSunBelowHorizon } = useOutput();

	const Height = () => (
		<p>
			{t().LABEL.HEIGHT}: <span class={styles.value}>{formatters().formatMeters(getHeight() ?? 0)}</span>
		</p>
	);

	return (
		<Show when={!hasError()}>
			<output class={styles.output}>
				<Switch fallback={<Height />}>
					<Match when={isSunBelowHorizon()}>
						<p data-error>
							{t().ERRORS.SUN_IS_BELOW}
						</p>
					</Match>
					<Match when={isInvalidInput()}>
						<p data-error>
							{t().ERRORS.NEGATIVE_HEIGHT}
						</p>
					</Match>
				</Switch>
			</output>
		</Show>
	);
}
