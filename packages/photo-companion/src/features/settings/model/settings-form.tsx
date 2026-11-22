import { createContext, type ParentProps, useContext } from "solid-js";
import { createStore, reconcile, snapshot } from "solid-js";
import { isNullable } from "utils/validators";

import type { City } from "types";

import { SETTINGS_DEFAULT } from "../consts";
import { FORM_INPUT_NAME } from "../consts/form";
import { SETTINGS_CITY_PRESETS } from "../consts/model";
import { useSettings } from "./settings";

import type { SettingsStore } from "../types";

function createSettingsFormState() {
	const { resetSettings, setSettings, settings } = useSettings();

	const [ settingsStore, setSettingsStore ] = createStore({ ...snapshot(settings) });

	const handleReset = () => {
		setSettingsStore(reconcile(SETTINGS_DEFAULT));
		resetSettings();
	};

	const handleSubmit = () => {
		setSettings(reconcile(snapshot(settingsStore)));
	};

	const handleCityChange = (city: City) => {
		const preset = SETTINGS_CITY_PRESETS[city];
		setSettingsStore((draft) => {
			Object.assign(draft, preset);
		});
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
				setSettingsStore((draft) => {
					draft.language = value as SettingsStore["language"];
				});
				break;
			}
			case FORM_INPUT_NAME.LATITUDE:
			case FORM_INPUT_NAME.LONGITUDE: {
				setSettingsStore((draft) => {
					draft[name] = Number(value);
				});
				break;
			}
		}
	};

	/**
	 * Used for custom controls within the form,
	 * because we can't catch event on `<form />` change event.
	 */
	const handleChange = <T extends keyof SettingsStore>(name: T, value: SettingsStore[T]) => {
		setSettingsStore((draft) => {
			draft[name] = value;
		});
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
		<SettingsFormContext value={state}>
			{props.children}
		</SettingsFormContext>
	);
}

export function useSettingsForm() {
	const value = useContext(SettingsFormContext);

	if (isNullable(value)) {
		throw new Error("useSettings must be used with a SettingsForm.Provider");
	}

	return value;
}
