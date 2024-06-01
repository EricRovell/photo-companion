import { InputNumber } from "ui-solid";

import type { SetStoreFunction, Store } from "solid-js/store";

import { type SettingsStore, useTranslation } from "@lib/context";

import { GeolocationButton } from "./geolocation-button";

interface Props {
	setStore: SetStoreFunction<SettingsStore>;
	store: Store<SettingsStore>;
}

export function InputGeolocation(props: Props) {
	const { t } = useTranslation();

	return (
		<>
			<InputNumber
				inputmode="numeric"
				max={90}
				min={-90}
				name="latitude"
				step={0.000000000001}
				value={props.store.latitude}
			>
				{t().LABEL.LATITUDE}
			</InputNumber>
			<InputNumber
				inputmode="numeric"
				max={180}
				min={-180}
				name="longitude"
				step={0.000000000001}
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
