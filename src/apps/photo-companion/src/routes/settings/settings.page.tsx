import { createStore, unwrap } from "solid-js/store";
import { Button, Fieldset, Form, InputRadio } from "ui";

import { SETTINGS_DEFAULT, useSettings, useTranslation } from "@lib/context";

import { InputEventFilters, InputGeolocation, InputTabsSelect } from "./components";
import { LANGUAGE_OPTIONS, LIGHTS_CITY_OPTIONS } from "./settings.const";

import styles from "./settings.module.css";

export function PageSettings() {
	const { t } = useTranslation();
	const { getSettings, resetSettings, setSettings } = useSettings();
	const [ store, setStore ] = createStore(getSettings());

	const handleChange = (event: Event) => {
		const target = event.target as HTMLInputElement;
		const { name, value } = target;

		switch (name) {
			case "language":
			case "lights_city": {
				setStore({ [name]: value });
				break;
			}
			case "latitude":
			case "longitude": {
				setStore({ [name]: Number(value) });
				break;
			}
		}
	};

	const handleSubmit = () => {
		setSettings({ ...unwrap(store) });
	};

	const handleReset = () => {
		setStore(SETTINGS_DEFAULT);
		resetSettings();
	};

	return (
		<div class={styles.page}>
			<h2>{t().TITLE.SETTINGS}</h2>
			<Form onChange={handleChange}>
				<Fieldset legend={t().LABEL.LANGUAGE}>
					<InputRadio
						name="language"
						options={LANGUAGE_OPTIONS}
						value={store.language}
					/>
				</Fieldset>
				<Fieldset legend={t().LABEL.GEOLOCATION}>
					<InputGeolocation
						setStore={setStore}
						store={store}
					/>
				</Fieldset>
				<Fieldset legend={t().LABEL.TABS}>
					<aside>
						{t().MESSAGE.TAB_LIMITS}
					</aside>
					<InputTabsSelect
						initialTabs={store.tabs}
						name="tabs"
						onChange={(name, value) => setStore({ [name]: value })}
					/>
				</Fieldset>
				<Fieldset legend={t().LABEL.LIGHTS_CITY}>
					<InputRadio
						name="lights_city"
						options={LIGHTS_CITY_OPTIONS(t())}
						value={store.lights_city}
					/>
				</Fieldset>
				<Fieldset legend={t().LABEL.EVENT_ALLOW_LIST}>
					<InputEventFilters
						onChange={(name, value) => setStore({ [name]: value })}
						store={store}
					/>
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
