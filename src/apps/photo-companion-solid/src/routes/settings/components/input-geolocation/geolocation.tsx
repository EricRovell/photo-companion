import { InputNumber } from "ui-solid";

import { GeolocationButton } from "./geolocation-button";
import type { SetStoreFunction, Store } from "solid-js/store";
import type { SettingsStore } from "@lib/stores/settings";
import { t } from "@lib/stores/lang";

interface Props {
	store: Store<SettingsStore>;
	setStore: SetStoreFunction<SettingsStore>;
}

export const InputGeolocation = (props: Props) => (
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
