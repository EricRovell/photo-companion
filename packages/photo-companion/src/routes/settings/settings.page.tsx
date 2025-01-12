import { SettingsPageProvider } from "./settings.context";
import { SettingsForm } from "./settings.form";

export const PageSettings = () => (
	<SettingsPageProvider>
		<SettingsForm />
	</SettingsPageProvider>
);

export default PageSettings;
