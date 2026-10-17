import { GeolocationProvider } from "~/features/geolocation";
import { SettingsForm } from "~/features/settings";

const PageSettings = () => (
	<GeolocationProvider>
		<SettingsForm />
	</GeolocationProvider>
);

export default PageSettings;
