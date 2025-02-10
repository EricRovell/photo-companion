import { Button, Input, InputLocation, InputRadio } from "ui";

import type { JSX, ParentProps} from "solid-js";

import { useTranslation } from "~/lib/context/translation";

import { useForm } from "../../height-by-shadow.context";

import type { FormKey } from "../../height-by-shadow.context";

import styles from "./form.module.css";

export function Form(props: ParentProps) {
	const { FORM_NAME, getValidity, store, update } = useForm();
	const { t } = useTranslation();

	const handleChange: JSX.ChangeEventHandlerUnion<HTMLInputElement, Event> = (event) => {
		if (!(event.target instanceof HTMLInputElement)) {
			return;
		}

		switch (event.target.name) {
			case FORM_NAME.DATE:
				update(event.target.name as FormKey, event.target.valueAsDate);
				break;
			case FORM_NAME.LATITUDE_DIRECTION:
			case FORM_NAME.LONGITUDE_DIRECTION:
				update(event.target.name, event.target.value as "E" | "N" | "S" | "W");
				break;
			default:
				update(event.target.name as FormKey, event.target.valueAsNumber);
		}
	};

	return (
		<form class={styles.form} onSubmit={e => e.preventDefault()}>
			<Input
				error={getValidity().date}
				name={FORM_NAME.DATE}
				onChange={handleChange}
				required
				type="date"
				value={store.date?.toISOString().slice(0, 10)}
			>
				{t().LABEL.DATE}
			</Input>
			<InputLocation
				abs
				error={getValidity().latitude}
				labels={{
					degrees: t().LABEL.DEGREES,
					minutes: t().LABEL.MINUTES,
					seconds: t().LABEL.SECONDS
				}}
				legend={t().LABEL.LATITUDE}
				name="latitude"
				onChange={value => update("latitude", value)}
				required
				value={store.latitude}
			/>
			<fieldset class={styles.radio}>
				<InputRadio
					classes={{
						label: styles["radio-label"]
					}}
					name={FORM_NAME.LATITUDE_DIRECTION}
					onChange={handleChange}
					options={[
						{ label: t().LABEL.LATITUDE_NORTH, value: "N" },
						{ label: t().LABEL.LATITUDE_SOUTH, value: "S" }
					]}
					value={store.latitude_direction}
				/>
			</fieldset>
			<InputLocation
				abs
				error={getValidity().longitude}
				labels={{
					degrees: t().LABEL.DEGREES,
					minutes: t().LABEL.MINUTES,
					seconds: t().LABEL.SECONDS
				}}
				legend={t().LABEL.LONGITUDE}
				name="longitude"
				onChange={value => update("longitude", value)}
				required
				value={store.longitude}
			/>
			<fieldset class={styles.radio}>
				<InputRadio
					classes={{
						label: styles["radio-label"]
					}}
					name={FORM_NAME.LONGITUDE_DIRECTION}
					onChange={handleChange}
					options={[
						{ label: t().LABEL.LONGITUDE_EAST, value: "E" },
						{ label: t().LABEL.LONGITUDE_WEST, value: "W" }
					]}
					value={store.longitude_direction}
				/>
			</fieldset>
			<Input
				error={getValidity().solar_azimuth_angle}
				max={359}
				min={0}
				name={FORM_NAME.SOLAR_AZIMUTH_ANGLE}
				onChange={handleChange}
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
				onChange={handleChange}
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
					onChange={handleChange}
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
					onChange={handleChange}
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
