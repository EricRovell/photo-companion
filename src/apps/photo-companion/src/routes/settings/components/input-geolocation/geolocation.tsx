import { useSearchParams } from "@solidjs/router";
import { InputNumber } from "ui";

import { useTranslation } from "@lib/context";

import { FORM_INPUT_NAME } from "../../settings.const";
import { useSettingsPage } from "../../settings.context";
import { GeolocationButton } from "./geolocation-button";

export function InputGeolocation() {
	const { t } = useTranslation();
	const { setSettingsStore, settingsStore } = useSettingsPage();

	// TODO make a hook or move into one place
	const [ , setParams ] = useSearchParams();

	return (
		<>
			<InputNumber
				inputmode="numeric"
				max={90}
				min={-90}
				name={FORM_INPUT_NAME.LATITUDE}
				step={0.000000000001}
				value={settingsStore.latitude}
			>
				{t().LABEL.LATITUDE}
			</InputNumber>
			<InputNumber
				inputmode="numeric"
				max={180}
				min={-180}
				name={FORM_INPUT_NAME.LONGITUDE}
				step={0.000000000001}
				value={settingsStore.longitude}
			>
				{t().LABEL.LONGITUDE}
			</InputNumber>
			<GeolocationButton
				handleLocation={(latitude, longitude) => {
					setSettingsStore({ latitude, longitude });
					setParams({ latitude, longitude });
				}}
			/>
		</>
	);
}
