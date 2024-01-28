<script lang="ts">
	import { Button, Form, Fieldset, InputNumber, InputRadio, InputSelect } from "@lib/components";
	import GeolocationButton from "./geolocation-button.svelte";
	import { settingsStore } from "@lib/settings-store";
	import { dict } from "@lib/dict";
	import { LIGHTS_CITY_OPTIONS, STARTING_PAGE_OPTIONS } from "./settings.const";

	import styles from "./settings.module.css";
	import type { LightsCity } from "@shared/types";

	let settings = settingsStore.get();

	const handlePersist = () => {
		settingsStore.set(settings);
	};

	const handleReset = () => {
		settingsStore.reset();
		settings = settingsStore.get();
	};

	const handleChange = (event: Event) => {
		const target = event.target as HTMLInputElement;
		const { name, value } = target;

		switch (name) {
			case "latitude": {
				settings.latitude = Number(value);
				break;
			}
			case "longitude": {
				settings.longitude = Number(value);
				break;
			}
			case "lights-city": {
				if (value) {
					settings["lights-city"] = value as LightsCity;
				} else {
					settings["lights-city"] = null;
				}

				break;
			}
			case "starting-page": {
				settings["starting-page"] = value;
			}
		}
	};
</script>

<div class="{styles.page}">
	<h2>{dict["settings"]}</h2>
	<Form on:submit="{handlePersist}" on:change={handleChange}>
		<Fieldset legend="{dict["preferences"]}">
			<InputSelect
				name="starting-page"
				options="{STARTING_PAGE_OPTIONS.map(item => {
					if (!settings["lights-city"] && item.value === "/lights") {
						return { ...item, disabled: true };
					}

					return item;
				})}"
				value="{settings["starting-page"]}"
			>
				{dict["starting-page"]}
			</InputSelect>
		</Fieldset>
		<Fieldset legend="{dict["geoposition"]}">
			<InputNumber
				min={-90}
				max={90}
				name="latitude"
				step="{0.000001}"
				inputmode="numeric"
				value="{settings.latitude}"
			>
				{dict["latitude"]}
			</InputNumber>
			<InputNumber
				min={-180}
				max={180}
				name="longitude"
				step="{0.000001}"
				inputmode="numeric"
				value="{settings.longitude}"
			>
				{dict["longitude"]}
			</InputNumber>
			<GeolocationButton
				handleLocation={(latitude, longitude) => {
					settings.latitude = latitude;
					settings.longitude = longitude;
				}}
			/>
		</Fieldset>
		<Fieldset legend="Городское освещение">
			<InputRadio
				name="lights-city"
				options={LIGHTS_CITY_OPTIONS}
				value="{settings["lights-city"] ?? ""}"
			/>
		</Fieldset>
		<Fieldset className="{styles.submit}">
			<Button
				appearance="outline"
				type="submit"
				color="success"
			>
				{dict["save"]}
			</Button>
			<Button
				appearance="outline"
				on:click="{handleReset}"
				type="button"
			>
				{dict["reset"]}
			</Button>
		</Fieldset>
	</Form>
</div>
