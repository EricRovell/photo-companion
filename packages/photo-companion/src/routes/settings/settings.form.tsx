import { Button, Fieldset, Form, InputRadio } from "ui";

import { SETTINGS_CITY_PRESETS } from "~/lib/context/settings";
import { useTranslation } from "~/lib/context/translation";

import { InputEventFilters, InputGeolocation, InputTabsSelect } from "./components";
import { CITY_OPTIONS, FORM_INPUT_NAME, LANGUAGE_OPTIONS } from "./settings.const";
import { useSettingsPage } from "./settings.context";

import styles from "./settings.module.css";

export function SettingsForm() {
	const { t } = useTranslation();
	
	const { handleFormChange, handleReset, handleSubmit, settingsStore } = useSettingsPage();

	return (
		<div class={styles.page}>
			<h2 class={styles.title}>
				{t().TITLE.SETTINGS}
			</h2>
			<Form onChange={handleFormChange}>
				<Fieldset legend={t().LABEL.LANGUAGE}>
					<InputRadio
						name={FORM_INPUT_NAME.LANGUAGE}
						options={LANGUAGE_OPTIONS}
						value={settingsStore.language}
					/>
				</Fieldset>
				<Fieldset legend={t().LABEL.CITY}>
					<InputRadio
						name={FORM_INPUT_NAME.CITY}
						options={CITY_OPTIONS(t())}
						value={settingsStore.city}
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
						tabs={SETTINGS_CITY_PRESETS[settingsStore.city].tabs}
					/>
				</Fieldset>
				<Fieldset legend={t().LABEL.EVENT_ALLOW_LIST}>
					<InputEventFilters />
				</Fieldset>
				<Fieldset classes={{
					content: styles["submit-content"],
					fieldset: styles.submit
				}}>
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
