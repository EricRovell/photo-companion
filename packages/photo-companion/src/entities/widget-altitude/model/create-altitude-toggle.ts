import { createMemo, createSignal } from "solid-js";

import type { Accessor } from "solid-js";

import type { AltitudeEntity } from "../types";

export function createAltitudeToggle(entities: Accessor<AltitudeEntity[]>) {
	const [ inactive, setInactive ] = createSignal<AltitudeEntity["id"][]>([]);

	const selected = createMemo(() => {
		const available = entities().map(entity => entity.id);
		const active = available.filter(id => !inactive().includes(id));
		return active.length > 0 ? active : available.slice(0, 1);
	});

	const isSelected = (id: AltitudeEntity["id"]) => selected().includes(id);

	const isSelectionLocked = (id: AltitudeEntity["id"]) => {
		return isSelected(id) && selected().length === 1;
	};

	const toggleEntity = (id: AltitudeEntity["id"]) => {
		if (isSelectionLocked(id)) {
			return;
		}

		const active = isSelected(id);

		setInactive(previous => (
			active
				? [ ...previous, id ]
				: previous.filter(value => value !== id)
		));
	};

	return {
		isSelected,
		isSelectionLocked,
		toggleEntity
	};
}
