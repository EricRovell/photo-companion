import { createUniqueId, Show } from "solid-js";

import type { LightsScheduleSource } from "types";

import { useTranslation } from "~/features/translation";
import { InputRadio, Text } from "~/shared/ui";

import styles from "./city-lights-source.module.css";

interface Props {
	id: string;
	officialAvailable: boolean;
	onChange: (source: LightsScheduleSource) => void;
	reservedUncertainty: null | string;
	selected: LightsScheduleSource;
	uncertainty: null | string;
}

export function CityLightsSource(props: Props) {
	const { t } = useTranslation();
	const name = createUniqueId();

	return (
		<div class={styles.source} id={props.id}>
			<div class={styles.options}>
				<InputRadio
					classes={{
						indicator: styles.indicator,
						input: styles.input,
						root: styles.option
					}}
					name={name}
					onChange={event => props.onChange(event.currentTarget.value === "SCHEDULE" ? "SCHEDULE" : "SOLAR_ESTIMATE")}
					options={[
						{
							disabled: !props.officialAvailable,
							label: t().LABEL.OFFICIAL_SCHEDULE,
							value: "SCHEDULE"
						},
						{
							label: t().LIGHTS_SOURCE.SOLAR_ESTIMATE,
							value: "SOLAR_ESTIMATE"
						}
					]}
					value={props.selected}
				/>
			</div>
			<Show when={props.uncertainty ?? props.reservedUncertainty}>
				<Text
					aria-hidden={!props.uncertainty}
					class={styles.uncertainty}
					color="secondary"
					variant="text-xs"
				>
					{props.uncertainty ?? props.reservedUncertainty}
				</Text>
			</Show>
		</div>
	);
}
