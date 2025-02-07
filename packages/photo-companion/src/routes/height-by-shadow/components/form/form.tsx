import { Input, InputLocation } from "ui";

import type { ParentProps} from "solid-js";

import { useTranslation } from "@lib/context/translation";

import { useForm } from "../../height-by-shadow.context";

import type { FormKey } from "../../height-by-shadow.context";

import styles from "./form.module.css";

export function Form(props: ParentProps) {
	const { FORM_NAME, getValidity, handleChange, store } = useForm();
	const { t } = useTranslation();

	const handleInput = (event: InputEvent) => {
		if (!(event.target instanceof HTMLInputElement)) {
			return;
		}

		const value = event.target.name === "date"
			? event.target.valueAsDate
			: event.target.valueAsNumber;

		handleChange(event.target.name as FormKey, value);

		event.target.form?.requestSubmit();
	};

	return (
		<form class={styles.form} onSubmit={e => e.preventDefault()}>
			<Input
				error={getValidity().date}
				name={FORM_NAME.DATE}
				onInput={handleInput}
				required
				type="date"
				value={store.date?.toISOString().slice(0, 10)}
			>
				{t().LABEL.DATE}
			</Input>
			<InputLocation
				error={getValidity().latitude}
				labels={{
					degrees: t().LABEL.DEGREES,
					minutes: t().LABEL.MINUTES,
					seconds: t().LABEL.SECONDS
				}}
				name="latitude"
				onInput={value => handleChange("latitude", value)}
				required
				value={store.latitude}
			>
				{t().LABEL.LATITUDE}
			</InputLocation>
			<InputLocation
				error={getValidity().longitude}
				labels={{
					degrees: t().LABEL.DEGREES,
					minutes: t().LABEL.MINUTES,
					seconds: t().LABEL.SECONDS
				}}
				name="longitude"
				onInput={value => handleChange("longitude", value)}
				required
				value={store.longitude}
			>
				{t().LABEL.LONGITUDE}
			</InputLocation>
			<Input
				error={getValidity().solar_azimuth_angle}
				max={359}
				min={0}
				name={FORM_NAME.SOLAR_AZIMUTH_ANGLE}
				onInput={handleInput}
				required
				step={0.001}
				type="number"
				value={store.solar_azimuth_angle}
			>
				{t().LABEL.SOLAR_AZIMUTH_ANGLE}
			</Input>
			<Input
				error={getValidity().length_shadow}
				min={0}
				name={FORM_NAME.LENGTH_SHADOW}
				onInput={handleInput}
				required
				step={0.001}
				type="number"
				value={store.length_shadow}
			>
				{t().LABEL.SHADOW_LENGTH}
			</Input>
			<fieldset class={styles.level}>
				<Input
					error={getValidity().level_object}
					min={0}
					name={FORM_NAME.LEVEL_OBJECT}
					onInput={handleInput}
					step={0.001}
					type="number"
					value={store.level_object}
				>
					{t().LABEL.OBJECT_LEVEL}
				</Input>
				<Input
					error={getValidity().level_shadow}
					min={0}
					name={FORM_NAME.LEVEL_SHADOW}
					onInput={handleInput}
					step={0.001}
					type="number"
					value={store.level_shadow}
				>
					{t().LABEL.SHADOW_LEVEL}
				</Input>
			</fieldset>
			{props.children}
		</form>
	);
}
