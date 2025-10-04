import { SettingsFormProvider } from "../../model";
import { SettingsForm as Form } from "./settings.form";

export const SettingsForm = () => (
	<SettingsFormProvider>
		<Form />
	</SettingsFormProvider>
);
