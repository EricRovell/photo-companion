import { createContext, createSignal, useContext } from "solid-js";
import { createStore, unwrap } from "solid-js/store";
import { isNullable } from "utils/validators";

import type { ParentProps} from "solid-js";

import { useSettings } from "~/services/settings";

import { validate } from "./form-validator";

export interface Model {
	date: Date | null;
	latitude: number;
	latitude_direction: "N" | "S",
	length_shadow: number;
	level_object?: number;
	level_shadow?: number;
	longitude: number;
	longitude_direction: "E" | "W"
	solar_azimuth_angle: number;
}

export type FormKey = keyof Model;

const FORM_NAME = {
	DATE: "date",
	LATITUDE: "latitude",
	LATITUDE_DIRECTION: "latitude_direction",
	LENGTH_SHADOW: "length_shadow",
	LEVEL_OBJECT: "level_object",
	LEVEL_SHADOW: "level_shadow",
	LONGITUDE: "longitude",
	LONGITUDE_DIRECTION: "longitude_direction",
	SOLAR_AZIMUTH_ANGLE: "solar_azimuth_angle"
} as const;

function createFormState() {
	const { settings } = useSettings();
	const { latitude, longitude } = unwrap(settings);

	const [ store, setStore ] = createStore<Model>({
		date: new Date(),
		latitude,
		latitude_direction: "N",
		length_shadow: 5,
		level_object: 0,
		level_shadow: 0,
		longitude,
		longitude_direction: "E",
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

	const update = <T extends FormKey>(name: T, value: Model[T]) => {
		setStore(name, value);
		setValidity(validate(unwrap(store)));
	};

	return {
		FORM_NAME,
		getInvalidFields,
		getValidity,
		hasError,
		setStore,
		store,
		update
	};
}

const FormContext = createContext<ReturnType<typeof createFormState>>();

export function FormProvider(props: ParentProps) {
	const state = createFormState();

	return (
		<FormContext.Provider value={state}>
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
