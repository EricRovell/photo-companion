import { Button, Input, InputLocation } from "ui";

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

		if (event.target.name === "date" || event.target.name === "time") {
			handleChange(event.target.name as FormKey, event.target.valueAsDate);
		} else {
			handleChange(event.target.name as FormKey, event.target.valueAsNumber);
		}

		//event.target.form?.submit();
	};

	return (
		<form class={styles.form} onSubmit={e => e.preventDefault()}>
			<fieldset class={styles.datetime}>
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
				<Input
					error={getValidity().time}
					name={FORM_NAME.TIME}
					onInput={handleInput}
					required
					type="time"
					value={store.date?.toISOString().slice(11, 16)}
				>
					{t().LABEL.TIME}
				</Input>
				<Input
					disabled
					error={getValidity().timezone}
					max={12}
					min={-12}
					name={FORM_NAME.TIMEZONE}
					onInput={handleInput}
					required
					step={1}
					type="number"
					value={store.timezone}
				>
					{t().LABEL.TIMEZONE}
				</Input>
			</fieldset>
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
			<Button type="submit">
				{t().LABEL.CALCULATE}
			</Button>
			{props.children}
		</form>
	);
}
