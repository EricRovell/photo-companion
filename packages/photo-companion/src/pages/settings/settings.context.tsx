import { createContext, type ParentProps, startTransition, useContext } from "solid-js";
import { createStore, reconcile, unwrap } from "solid-js/store";
import { isNullable } from "utils/validators";

import type { City } from "types";

import { SETTINGS_CITY_PRESETS, SETTINGS_DEFAULT, type SettingsStore, useSettings } from "~/features/settings";

import { FORM_INPUT_NAME } from "./settings.const";

function createSettingsFormState() {
	const { resetSettings, setSettings, settings } = useSettings();

	const [ settingsStore, setSettingsStore ] = createStore({ ...unwrap(settings) });

	const handleReset = () => {
		void startTransition(() => {
			setSettingsStore(SETTINGS_DEFAULT);
			resetSettings();
		});
	};

	const handleSubmit = () => {
		void startTransition(() => {
			setSettings(reconcile({ ...unwrap(settingsStore) }));
		});
	};

	const handleCityChange = (city: City) => {
		const preset = SETTINGS_CITY_PRESETS[city];
		setSettingsStore({ ...preset });
	};

	/**
	 * Used for native controls change within the form.
	 */
	const handleFormChange = (event: Event) => {
		const target = event.target as HTMLInputElement;
		const { name, value } = target;

		switch (name) {
			case FORM_INPUT_NAME.CITY: {
				handleCityChange(value as City);
				break;
			}
			case FORM_INPUT_NAME.LANGUAGE: {
				setSettingsStore({ [name]: value });
				break;
			}
			case FORM_INPUT_NAME.LATITUDE:
			case FORM_INPUT_NAME.LONGITUDE: {
				setSettingsStore({ [name]: Number(value) });
				break;
			}
		}
	};

	/**
	 * Used for custom controls within the form,
	 * because we can't catch event on `<form />` change event.
	 */
	const handleChange = <T extends keyof SettingsStore>(name: T, value: SettingsStore[T]) => {
		setSettingsStore(name, value);
	};

	return {
		handleChange,
		handleFormChange,
		handleReset,
		handleSubmit,
		setSettingsStore,
		settingsStore
	};
}

const SettingsFormContext = createContext<ReturnType<typeof createSettingsFormState>>();

export function SettingsFormProvider(props: ParentProps) {
	const state = createSettingsFormState();

	return (
		<SettingsFormContext.Provider value={state}>
			{props.children}
		</SettingsFormContext.Provider>
	);
}

export function useSettingsForm() {
	const value = useContext(SettingsFormContext);

	if (isNullable(value)) {
		throw new Error("useSettings must be used with a SettingsForm.Provider");
	}

	return value;
}
