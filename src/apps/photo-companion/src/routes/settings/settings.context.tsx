import { createContext, type ParentProps, useContext } from "solid-js";
import { createStore, type SetStoreFunction, type Store, unwrap } from "solid-js/store";
import { isNullable } from "utils/validators";

import { SETTINGS_DEFAULT, type SettingsStore, useSettings } from "@lib/context";

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
		setSettingsStore(SETTINGS_DEFAULT);
		resetSettings();
	};

	const handleSubmit = () => {
		setSettings({ ...unwrap(settingsStore) });
	};

	/**
	 * Used for native controls change within the form.
	 */
	const handleFormChange = (event: Event) => {
		const target = event.target as HTMLInputElement;
		const { name, value } = target;

		switch (name) {
			case FORM_INPUT_NAME.LANGUAGE:
			case FORM_INPUT_NAME.LIGHTS_CITY: {
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
