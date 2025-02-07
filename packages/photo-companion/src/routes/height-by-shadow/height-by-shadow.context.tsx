import { createContext, createSignal, useContext } from "solid-js";
import { createStore, unwrap } from "solid-js/store";
import { isNullable } from "utils/validators";

import type { ParentProps} from "solid-js";

import { useSettings } from "@lib/context/settings";

import { validate } from "./form-validator";

export interface FormState {
	date: Date | null;
	latitude: number;
	length_shadow: number;
	level_object?: number;
	level_shadow?: number;
	longitude: number;
	solar_azimuth_angle: number;
}

export type FormKey = keyof FormState;

const FORM_NAME = {
	DATE: "date",
	LATITUDE: "latitude",
	LENGTH_SHADOW: "length_shadow",
	LEVEL_OBJECT: "level_object",
	LEVEL_SHADOW: "level_shadow",
	LONGITUDE: "longitude",
	SOLAR_AZIMUTH_ANGLE: "solar_azimuth_angle"
} as const;

function createFormState() {
	const { settings } = useSettings();
	const { latitude, longitude } = unwrap(settings);

	const [ store, setStore ] = createStore<FormState>({
		date: new Date(),
		latitude,
		length_shadow: 5,
		level_object: 0,
		level_shadow: 0,
		longitude,
		solar_azimuth_angle: 0
	});

	const [ getValidity, setValidity ] = createSignal<Partial<Record<FormKey, boolean>>>(validate(store));

	const getInvalidFields = () => {
		const fields: FormKey[] = [];

		for (const [ field, status ] of Object.entries(getValidity())) {
			if (status) {
				fields.push(field as FormKey);
			}
		}

		return fields;
	};

	const hasError = () => getInvalidFields().length > 0;

	const handleChange = (name: FormKey, value: FormState[FormKey]) => {
		setStore(name, value);
		setValidity(validate(unwrap(store)));
	};

	return {
		FORM_NAME,
		getInvalidFields,
		getValidity,
		handleChange,
		hasError,
		setStore,
		store
	};
}

const FormContext = createContext<ReturnType<typeof createFormState>>();

export function FormProvider(props: ParentProps) {
	const formState = createFormState();

	return (
		<FormContext.Provider value={formState}>
			{props.children}
		</FormContext.Provider>
	);
}

export function useForm() {
	const value = useContext(FormContext);

	if (isNullable(value)) {
		throw new Error("useForm must be used with a FormContext.Provider");
	}

	return value;
}
