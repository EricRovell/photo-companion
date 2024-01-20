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

	let settings = settingsStore.get();

	const handlePersist = () => {
		settingsStore.persist(settings);
	};

	const handleReset = () => {
		settingsStore.reset();
		settings = settingsStore.get();
	};

	const LIGHTS_CITY_OPTIONS: Option[] = [
		{ label: "Отключить", value: dict["off"] },
		...lightsCityList.map(item => ({ label: dict[item], value: item }))
	];
</script>

<div class="{styles.page}">
	<h2>{dict["settings"]}</h2>
	<Form on:submit="{handlePersist}">
		<Fieldset legend="{dict["geoposition"]}">
			<InputNumber
				bind:value="{settings.lat}"
				min={-90}
				max={90}
				step="{0.000001}"
				inputmode="numeric"
			>
				{dict["latitude"]}
			</InputNumber>
			<InputNumber
				bind:value="{settings.lon}"
				min={-180}
				max={180}
				step="{0.000001}"
				inputmode="numeric"
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
				bind:value="{settings["lights-city"]}"
				name="lights-city"
				options={LIGHTS_CITY_OPTIONS}
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
