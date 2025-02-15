import { GeolocationProvider } from "~/services/geolocation";

import { SettingsPageProvider } from "./settings.context";
import { SettingsForm } from "./settings.form";

export const PageSettings = () => (
	<GeolocationProvider>
		<SettingsPageProvider>
			<SettingsForm />
		</SettingsPageProvider>
	</GeolocationProvider>
);

export default PageSettings;
