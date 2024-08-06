import { createContext, type ParentProps, startTransition, useContext } from "solid-js";
import { createStore, type SetStoreFunction, type Store, unwrap } from "solid-js/store";
import { isNullable } from "utils/validators";

import type { City } from "types";

import { SETTINGS_DEFAULT, type SettingsStore, useSettings } from "@lib/context/settings";
import { SETTINGS_CITY_PRESETS } from "@lib/context/settings/settings.const";

import { FORM_INPUT_NAME } from "./settings.const";

export interface SettingsPageContextType {
	readonly handleChange: <T extends keyof SettingsStore>(name: T, value: SettingsStore[T]) => void;
	readonly handleFormChange: (event: Event) => void;
	readonly handleReset: VoidFn;
	readonly handleSubmit: VoidFn;
	readonly setSettingsStore: SetStoreFunction<SettingsStore>;
	readonly settingsStore: Store<SettingsStore>
}

const SettingsPageContext = createContext<SettingsPageContextType>();

export function SettingsPageProvider(props: ParentProps) {
	const { getSettings, resetSettings, setSettings } = useSettings();
	const [ settingsStore, setSettingsStore ] = createStore(getSettings());

	const handleReset = () => {
		void startTransition(() => {
			setSettingsStore(SETTINGS_DEFAULT);
			resetSettings();
		});
	};

	const handleSubmit = () => {
		void startTransition(() => {
			setSettings({ ...unwrap(settingsStore) });
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

	return (
		<SettingsPageContext.Provider value={{
			handleChange,
			handleFormChange,
			handleReset,
			handleSubmit,
			setSettingsStore,
			settingsStore
		}}>
			{props.children}
		</SettingsPageContext.Provider>
	);
}

export function useSettingsPage() {
	const value = useContext(SettingsPageContext);

	if (isNullable(value)) {
		throw new Error("useSettings must be used with a SettingsPage.Provider");
	}

	return value;
}
