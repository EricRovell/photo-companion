import { Show } from "solid-js";

import { ErrorMessage } from "~/components";
import { useTranslation } from "~/features/translation";
import { useGeolocationService } from "~/services/geolocation";
import { Button } from "~/shared/ui";

import { useSettingsForm } from "../../settings.context";

export function GeolocationButton() {
	const { t } = useTranslation();
	const { geolocation, getGeolocation } = useGeolocationService();

	const { setSettingsStore } = useSettingsForm();

	const handleGeolocation = () => {
		getGeolocation(position => {
			setSettingsStore({
				latitude: position.coords.latitude,
				longitude: position.coords.longitude
			});
		});
	};

	const errorMessage = () => {
		const code = geolocation.error?.code;

		switch (code) {
			case 1: return t().ERRORS.GEOLOCATION_PERMISSION_DENIED;
			case 2: return t().ERRORS.GEOLOCATION_POSITION_UNAVAILABLE;
			case 3: return t().ERRORS.GEOLOCATION_TIMEOUT;
			default: return "";
		}
	};

	return (
		<>
			<Button
				appearance="outline"
				onClick={handleGeolocation}
				pending={geolocation.status === "pending"}
			>
				{t().LABEL.ASK_DEVICE_GEOLOCATION}
			</Button>
			<Show when={geolocation.status === "error"}>
				<ErrorMessage message={errorMessage()} />
			</Show>
		</>
	);
}
