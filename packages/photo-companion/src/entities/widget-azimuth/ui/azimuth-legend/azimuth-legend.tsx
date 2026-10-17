import { For } from "solid-js";

import { getCardinalDirection } from "../../lib";

import type { AzimuthEntity, AzimuthWidgetEntity, AzimuthWidgetLabels, CardinalLabels } from "../../types";

import styles from "./azimuth-legend.module.css";

interface Props {
	cardinalLabels: CardinalLabels;
	entities: AzimuthWidgetEntity[];
	getAzimuth: (entity: AzimuthEntity) => number;
	labels: Pick<AzimuthWidgetLabels, "altitude" | "azimuth" | "celestialBody">;
}

export function AzimuthLegend(props: Props) {
	const getRoundedAzimuth = (entity: AzimuthEntity) => Math.round(props.getAzimuth(entity)) % 360;

	return (
		<table class={styles.table}>
			<thead>
				<tr>
					<th scope="col">{props.labels.celestialBody}</th>
					<th scope="col">{props.labels.azimuth}</th>
					<th scope="col">{props.labels.altitude}</th>
				</tr>
			</thead>
			<tbody>
				<For each={props.entities}>
					{entity => (
						<tr data-entity={entity.id}>
							<th scope="row"><span aria-hidden="true" class={styles.dot} />{entity.label}</th>
							<td>
								<span class={styles["azimuth-value"]}>
									<span>{getRoundedAzimuth(entity.id)}°</span>
									<small>{getCardinalDirection(props.getAzimuth(entity.id), props.cardinalLabels)}</small>
								</span>
							</td>
							<td>{Math.round(entity.altitude)}°</td>
						</tr>
					)}
				</For>
			</tbody>
		</table>
	);
}
