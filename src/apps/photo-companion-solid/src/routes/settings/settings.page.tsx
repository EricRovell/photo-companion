import { createStore, unwrap } from "solid-js/store";
import { Button, Fieldset, Form, InputCheckbox, InputRadio } from "ui-solid";

import { t } from "@lib/stores/lang";
import { LANGUAGE_OPTIONS } from "./settings.const";
import styles from "./settings.module.css";
import { resetSettings, setSettings, settings } from "@lib/stores/settings";
import { SETTINGS_DEFAULT } from "@lib/stores/settings/settings.const";
import { InputGeolocation, InputEventFilters, InputTabsSelect } from "./components";

export function PageSettings() {
	const [ store, setStore ] = createStore(settings());

	const handleChange = (event: Event) => {
		const target = event.target as HTMLInputElement;
		const { name, value } = target;

		switch (name) {
			case "language":
			case "lights-city": {
				setStore({ [name]: value });
				break;
			}
			case "latitude":
			case "longitude": {
				setStore({ [name]: Number(value) });
				break;
			}
			case "bridges-spb-navigation": {
				setStore({ bridges_spb_navigation: target.checked });
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
						store={store}
						setStore={setStore}
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
				<Fieldset legend={t().LABEL.BRIDGES_SPB}>
					<aside>
						{t().MESSAGE.NAVIGATION_MODE}
					</aside>
					<InputCheckbox
						checked={store.bridges_spb_navigation}
						disabled={!store.tabs.includes("BRIDGES")}
						label={t().LABEL.NAVIGATION_ONLY}
						name="bridges-spb-navigation"
					/>
				</Fieldset>
				<Fieldset legend={t().LABEL.EVENT_ALLOW_LIST}>
					<InputEventFilters
						store={store}
						onChange={(name, value) => setStore({ [name]: value })}
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
