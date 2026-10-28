import { For } from "solid-js";

import type { JSX } from "solid-js";

import { useTranslation } from "~/features/translation";
import { Text } from "~/shared/ui";

import { useAltitudeContext } from "../../model/altitude-context";
import { AltitudeToggle } from "../altitude-toggle/altitude-toggle";

import styles from "./altitude-legend.module.css";

const handleRowClick: JSX.EventHandler<HTMLTableRowElement, MouseEvent> = event => {
	if (event.target.closest("label")) {
		return;
	}

	const checkbox = event.currentTarget.querySelector("input");

	if (checkbox === null || checkbox.disabled) {
		return;
	}

	checkbox.focus();
	checkbox.click();
};

export function Legend() {
	const { format, t } = useTranslation();
	const { getAltitude, isSelected, isSelectionLocked, series } = useAltitudeContext();

	return (
		<table class={styles.legend}>
			<thead>
				<tr>
					<Text
						align="start"
						as="th"
						color="secondary"
						scope="col"
						variant="text-xs"
					>
						{t().LABEL.CELESTIAL_BODY}
					</Text>
					<Text
						align="end"
						as="th"
						color="secondary"
						scope="col"
						variant="text-xs"
					>
						{t().ALTITUDE.SELECTED_TIME}
					</Text>
					<Text
						align="end"
						as="th"
						color="secondary"
						scope="col"
						variant="text-xs"
					>
						{t().ALTITUDE.DAILY_PEAK}
					</Text>
				</tr>
			</thead>
			<tbody>
				<For each={series()}>
					{entity => {
						const altitude = () => getAltitude(entity.id);

						return (
							<tr
								class={styles.entity}
								data-entity={entity.id}
								data-selected={isSelected(entity.id)}
								onClick={handleRowClick}
								title={isSelectionLocked(entity.id) ? t().ALTITUDE.KEEP_ONE_SELECTED : undefined}
							>
								<th scope="row"><AltitudeToggle entity={entity} /></th>
								<td>
									<Text class={styles.value} numeric variant="heading-s">
										{format().degrees(altitude())}
									</Text>
									<Text class={styles.detail} color="secondary" variant="text-s">
										{altitude() >= 0 ? t().RISE_SET.ABOVE_HORIZON : t().RISE_SET.BELOW_HORIZON}
									</Text>
								</td>
								<td>
									<Text class={styles.value} numeric variant="heading-s">
										{format().degrees(entity.peak.altitude)}
									</Text>
									<Text
										as="time"
										class={styles.detail}
										color="secondary"
										datetime={new Date(entity.peak.timestamp).toISOString()}
										numeric
										variant="text-s"
									>
										{format().timeShort(entity.peak.timestamp)}
									</Text>
								</td>
							</tr>
						);
					}}
				</For>
			</tbody>
		</table>
	);
}
