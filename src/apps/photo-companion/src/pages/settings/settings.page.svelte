<script lang="ts">
	import {
		Button,
		Form,
		Fieldset,
		InputNumber,
		InputRadio,
		type Option
	} from "@lib/components";
	import GeolocationButton from "./geolocation-button.svelte";
	import { settingsStore } from "@lib/settings-store";
	import { dict } from "@lib/dict";
	import { lightsCityList } from "@lib/constants";

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

	const LIGHTS_CITY_OPTIONS: Option[] = [
		{ label: dict["off"], value: "" },
		...lightsCityList.map(item => ({ label: dict[item], value: item }))
	];

	const handleChange = (event: Event) => {
		const target = event.target as HTMLInputElement;
		const { name, value } = target;

		switch (name) {
			case "latitude": {
				settings.lat = Number(value);
				break;
			}
			case "longitude": {
				settings.lon = Number(value);
				break;
			}
			case "lights-city": {
				if (value) {
					settings["lights-city"] = value as LightsCity;
				} else {
					settings["lights-city"] = null;
				}
			}
		}
	};
</script>

<div class="{styles.page}">
	<h2>{dict["settings"]}</h2>
	<Form on:submit="{handlePersist}" on:change={handleChange}>
		<Fieldset legend="{dict["geoposition"]}">
			<InputNumber
				min={-90}
				max={90}
				name="latitude"
				step="{0.000001}"
				inputmode="numeric"
				value="{settings.lat}"
			>
				{dict["latitude"]}
			</InputNumber>
			<InputNumber
				min={-180}
				max={180}
				name="longitude"
				step="{0.000001}"
				inputmode="numeric"
				value="{settings.lon}"
			>
				{dict["longitude"]}
			</InputNumber>
			<GeolocationButton
				handleLocation={(lat, lon) => {
					settings.lat = lat;
					settings.lon = lon;
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
