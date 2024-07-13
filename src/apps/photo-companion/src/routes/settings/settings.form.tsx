import { Button, Fieldset, Form, InputRadio } from "ui";

import { useTranslation } from "@lib/context";

import { InputEventFilters, InputGeolocation, InputTabsSelect } from "./components";
import { FORM_INPUT_NAME, LANGUAGE_OPTIONS, LIGHTS_CITY_OPTIONS } from "./settings.const";
import { useSettingsPage } from "./settings.context";

import styles from "./settings.module.css";

export function SettingsForm() {
	const { t } = useTranslation();
	
	const { handleFormChange, handleReset, handleSubmit, settingsStore } = useSettingsPage();

	return (
		<div class={styles.page}>
			<h2>{t().TITLE.SETTINGS}</h2>
			<Form onChange={handleFormChange}>
				<Fieldset legend={t().LABEL.LANGUAGE}>
					<InputRadio
						name={FORM_INPUT_NAME.LANGUAGE}
						options={LANGUAGE_OPTIONS}
						value={settingsStore.language}
					/>
				</Fieldset>
				<Fieldset legend={t().LABEL.GEOLOCATION}>
					<InputGeolocation />
				</Fieldset>
				<Fieldset legend={t().LABEL.TABS}>
					<aside>
						{t().MESSAGE.TAB_LIMITS}
					</aside>
					<InputTabsSelect
						initialTabs={settingsStore.tabs}
					/>
				</Fieldset>
				<Fieldset legend={t().LABEL.LIGHTS_CITY}>
					<InputRadio
						name={FORM_INPUT_NAME.LIGHTS_CITY}
						options={LIGHTS_CITY_OPTIONS(t())}
						value={settingsStore.lights_city}
					/>
				</Fieldset>
				<Fieldset legend={t().LABEL.EVENT_ALLOW_LIST}>
					<InputEventFilters />
				</Fieldset>
				<Fieldset class={styles.submit}>
					<Button
						appearance="outline"
						color="success"
						onClick={handleSubmit}
						variant="success"
					>
						{t().LABEL.SAVE}
					</Button>
					<Button
						appearance="outline"
						onClick={handleReset}
					>
						{t().LABEL.RESET}
					</Button>
				</Fieldset>
			</Form>
		</div>
	);
}
