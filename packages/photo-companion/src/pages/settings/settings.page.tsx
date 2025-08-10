import { GeolocationProvider } from "~/features/geolocation";

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
