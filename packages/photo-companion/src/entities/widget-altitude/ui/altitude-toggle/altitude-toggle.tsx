import { Text } from "~/shared/ui";

import { useAltitudeContext } from "../../model/altitude-context";

import type { AltitudeEntity } from "../../types";

import styles from "./altitude-toggle.module.css";

export function AltitudeToggle(props: { entity: AltitudeEntity }) {
	const { isSelected, isSelectionLocked, toggleEntity } = useAltitudeContext();

	return (
		<label class={styles.toggle}>
			<input
				checked={isSelected(props.entity.id)}
				class={styles.input}
				disabled={isSelectionLocked(props.entity.id)}
				onChange={() => toggleEntity(props.entity.id)}
				type="checkbox"
			/>
			<span aria-hidden="true" class={styles.symbol} />
			<Text class={styles.label} color="primary" variant="heading-s">
				{props.entity.label}
			</Text>
		</label>
	);
}
