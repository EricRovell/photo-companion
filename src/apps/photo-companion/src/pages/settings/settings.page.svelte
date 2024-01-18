<script lang="ts">
	import { Button, Form, Fieldset, InputNumber } from "@lib/components";
	import GeolocationButton from "./geolocation-button.svelte";
	import { settingsStore } from "@lib/settings-store";
	import { dict } from "@lib/dict";

	import styles from "./settings.module.css";

	let settings = settingsStore.get();

	const handlePersist = () => {
		settingsStore.persist(settings);
	};

	const handleReset = () => {
		settingsStore.reset();
		settings = settingsStore.get();
	};
</script>

<div class="{styles.page}">
	<h2>
		{dict["settings"]}
	</h2>
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
