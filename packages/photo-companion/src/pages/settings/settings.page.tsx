import { GeolocationProvider } from "~/services/geolocation";

import { SettingsFormProvider } from "./settings.context";
import { SettingsForm } from "./settings.form";

export const PageSettings = () => (
	<GeolocationProvider>
		<SettingsFormProvider>
			<SettingsForm />
		</SettingsFormProvider>
	</GeolocationProvider>
);

export default PageSettings;
