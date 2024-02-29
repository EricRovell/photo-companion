<script lang="ts">
	import { Button, Form, Fieldset, InputNumber, InputCheckboxGroup, InputRadio, InputSelect } from "@lib/components";
	import { query } from "svelte-pathfinder";
	import GeolocationButton from "./geolocation-button.svelte";
	import { settingsStore } from "@lib/stores";
	import { dict } from "@lib/dict";
	import {
		BRIDGES_SPB_OPTIONS,
		LIGHTS_CITY_OPTIONS,
		GET_STARTING_PAGE_OPTIONS,
		BRIDGES_EVENTS_OPTIONS
	} from "./settings.const";
	import { SUN_EVENT_NAMES, MOON_EVENT_NAMES, LIGHTS_EVENT_NAMES } from "@lib/constants";
	import type { LightsCity } from "@shared/types";

	import styles from "./settings.module.css";

	let settings = settingsStore.read()!;

	const handlePersist = () => {
		settingsStore.set(settings);
	};

	const handleReset = () => {
		settingsStore.reset();
		settings = settingsStore.read()!;
	};

	const handleChange = (event: Event) => {
		const target = event.target as HTMLInputElement;
		const { name, value } = target;

		switch (name) {
			case "latitude": {
				const latitude = Number(value);
				settings.latitude = latitude;
				break;
			}
			case "longitude": {
				const longitude = Number(value);
				settings.longitude = longitude;
				break;
			}
			case "lights-city": {
				if (value) {
					settings.lights_city = value as LightsCity;
				} else {
					settings.lights_city = null;
					settings.events_lights = null;
				}

				break;
			}
			case "bridges-spb": {
				if (value) {
					settings.bridges_spb = value as ("navigation" | "always");
				} else {
					settings.bridges_spb = null;
					settings.events_bridges_spb = null;
				}

				break;
			}
			case "starting-page": {
				settings.starting_page = value;
			}
		}
	};

	settingsStore.subscribe(({ latitude, longitude }) => {
		$query.latitude = latitude;
		$query.longitude = longitude;
	});
</script>

<div class="{styles.page}">
	<h2>{dict.TITLE.SETTINGS}</h2>
	<Form on:submit="{handlePersist}" on:change={handleChange}>
		<Fieldset legend="{dict.LABEL.PREFERENCES}" id="starting-page">
			<InputSelect
				name="starting-page"
				options="{GET_STARTING_PAGE_OPTIONS(settings)}"
				value="{settings.starting_page}"
			>
				{dict.LABEL.STARTING_PAGE}
			</InputSelect>
		</Fieldset>
		<Fieldset legend="{dict.LABEL.GEOPOSITION}" id="geoposition">
			<InputNumber
				min={-90}
				max={90}
				name="latitude"
				step="{0.000000000001}"
				inputmode="numeric"
				value="{settings.latitude}"
			>
				{dict.LABEL.LATITUDE}
			</InputNumber>
			<InputNumber
				min={-180}
				max={180}
				name="longitude"
				step="{0.000000000001}"
				inputmode="numeric"
				value="{settings.longitude}"
			>
				{dict.LABEL.LONGITUDE}
			</InputNumber>
			<GeolocationButton
				handleLocation={(latitude, longitude) => {
					settings.latitude = latitude;
					settings.longitude = longitude;
				}}
			/>
		</Fieldset>
		<Fieldset legend="{dict.LABEL.LIGHTS_CITY}" id="city-lights">
			<InputRadio
				name="lights-city"
				options={LIGHTS_CITY_OPTIONS}
				value="{settings.lights_city ?? ""}"
			/>
		</Fieldset>
		<Fieldset legend="{dict.LABEL.BRIDGES_SPB}" id="city-lights">
			<InputRadio
				name="bridges-spb"
				options={BRIDGES_SPB_OPTIONS}
				value="{settings.bridges_spb ?? ""}"
			/>
		</Fieldset>
		<Fieldset legend="{dict.LABEL.EVENT_ALLOW_LIST}" id="event-blacklist">
			<InputCheckboxGroup
				bind:value="{settings.events_bridges_spb}"
				disabled="{!settings.bridges_spb}"
				name="timeline-events-map"
				groupLabel="{dict.LABEL.BRIDGES_SPB}"
				groupValue="bridges"
				options="{BRIDGES_EVENTS_OPTIONS}"
			/>
			<InputCheckboxGroup
				bind:value="{settings.events_lights}"
				disabled="{!settings.lights_city}"
				name="timeline-events-map"
				groupLabel="{dict.LABEL.LIGHTS_CITY}"
				groupValue="lights"
				options="{LIGHTS_EVENT_NAMES.map(value => ({
					label: dict.LIGHTS_EVENTS[value],
					value
				}))}"
			/>
			<InputCheckboxGroup
				bind:value="{settings.events_sun}"
				name="timeline-events-map"
				groupLabel="{dict.TITLE.SUN}"
				groupValue="sun"
				options="{SUN_EVENT_NAMES.map(value => ({
					label: dict.SUN_TIMES[value],
					value
				}))}"
			/>
			<InputCheckboxGroup
				bind:value="{settings.events_moon}"
				name="timeline-events-map"
				groupLabel="{dict.TITLE.MOON}"
				groupValue="moon"
				options="{MOON_EVENT_NAMES.map(value => ({
					label: dict.MOON_TIMES[value],
					value
				}))}"
			/>
		</Fieldset>
		<Fieldset className="{styles.submit}">
			<Button
				appearance="outline"
				type="submit"
				color="success"
			>
				{dict.LABEL.SAVE}
			</Button>
			<Button
				appearance="outline"
				on:click="{handleReset}"
				type="button"
			>
				{dict.LABEL.RESET}
			</Button>
		</Fieldset>
	</Form>
</div>
