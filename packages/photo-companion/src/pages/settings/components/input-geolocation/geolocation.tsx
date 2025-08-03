import { useTranslation } from "~/features/translation";
import { Input } from "~/shared/ui";

import { FORM_INPUT_NAME } from "../../settings.const";
import { useSettingsForm } from "../../settings.context";
import { GeolocationButton } from "./geolocation-button";

export function InputGeolocation() {
	const { t } = useTranslation();
	const { settingsStore } = useSettingsForm();

	return (
		<>
			<Input
				inputmode="numeric"
				max={90}
				min={-90}
				name={FORM_INPUT_NAME.LATITUDE}
				step="any"
				type="number"
				value={settingsStore.latitude}
			>
				{t().LABEL.LATITUDE}
			</Input>
			<Input
				inputmode="numeric"
				max={180}
				min={-180}
				name={FORM_INPUT_NAME.LONGITUDE}
				step="any"
				type="number"
				value={settingsStore.longitude}
			>
				{t().LABEL.LONGITUDE}
			</Input>
			<GeolocationButton />
		</>
	);
}
