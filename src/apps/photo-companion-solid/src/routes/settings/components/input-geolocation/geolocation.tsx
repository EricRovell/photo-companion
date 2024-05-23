import type { SetStoreFunction, Store } from "solid-js/store";
import { InputNumber } from "ui-solid";

import { useTranslation, type SettingsStore } from "@lib/context";
import { GeolocationButton } from "./geolocation-button";

interface Props {
	store: Store<SettingsStore>;
	setStore: SetStoreFunction<SettingsStore>;
}

export function InputGeolocation(props: Props) {
	const { t } = useTranslation();

	return (
		<>
			<InputNumber
				min={-90}
				max={90}
				name="latitude"
				step={0.000000000001}
				inputmode="numeric"
				value={props.store.latitude}
			>
				{t().LABEL.LATITUDE}
			</InputNumber>
			<InputNumber
				min={-180}
				max={180}
				name="longitude"
				step={0.000000000001}
				inputmode="numeric"
				value={props.store.longitude}
			>
				{t().LABEL.LONGITUDE}
			</InputNumber>
			<GeolocationButton
				handleLocation={(latitude, longitude) => {
					props.setStore({ latitude, longitude });
				}}
			/>
		</>
	);
}
