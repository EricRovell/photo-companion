<script lang="ts">
	import { query } from "svelte-pathfinder";
	import { Button, Form, Fieldset, InputNumber, InputRadio, InputCheckbox } from "ui";
	import type { LightsCity } from "types";

	import { InputCheckboxGroup } from "@lib/components";
	import GeolocationButton from "./geolocation-button.svelte";
	import TabsSelect from "./tabs-select.svelte";
	import { settingsStore } from "@lib/stores";
	import { t } from "@stores/lang";
	import { LIGHTS_CITY_OPTIONS, BRIDGES_EVENTS_OPTIONS, LANGUAGE_OPTIONS } from "./settings.const";
	import { SUN_EVENT_NAMES, MOON_EVENT_NAMES, LIGHTS_EVENT_NAMES } from "@lib/constants";

	import styles from "./settings.module.css";
	import type { UserLang } from "@lib/types";

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
			case "language": {
				settings.language = value as UserLang;
				break;
			}
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
				settings.lights_city = value as LightsCity;
				break;
			}
			case "bridges-spb-navigation": {
				settings.bridges_spb_navigation = target.checked;
				break;
			}
		}
	};

	settingsStore.subscribe(({ latitude, longitude }) => {
		$query.latitude = latitude;
		$query.longitude = longitude;
	});
</script>

<div class="{styles.page}">
	<h2>{$t.TITLE.SETTINGS}</h2>
	<Form on:submit="{handlePersist}" on:change={handleChange}>
		<Fieldset legend="{$t.LABEL.LIGHTS_CITY}" id="lang">
			<InputRadio
				name="language"
				options={LANGUAGE_OPTIONS}
				value="{settings.language}"
			/>
		</Fieldset>
		<Fieldset legend="{$t.LABEL.GEOLOCATION}" id="geoposition">
			<InputNumber
				min={-90}
				max={90}
				name="latitude"
				step="{0.000000000001}"
				inputmode="numeric"
				value="{settings.latitude}"
			>
				{$t.LABEL.LATITUDE}
			</InputNumber>
			<InputNumber
				min={-180}
				max={180}
				name="longitude"
				step="{0.000000000001}"
				inputmode="numeric"
				value="{settings.longitude}"
			>
				{$t.LABEL.LONGITUDE}
			</InputNumber>
			<GeolocationButton
				handleLocation={(latitude, longitude) => {
					settings.latitude = latitude;
					settings.longitude = longitude;
				}}
			/>
		</Fieldset>
		<Fieldset legend="{$t.LABEL.TABS}" id="starting-page">
			<aside>
				{$t.MESSAGE.TAB_LIMITS}
			</aside>
			<TabsSelect
				bind:value="{settings.tabs}"
			/>
		</Fieldset>
		<Fieldset legend="{$t.LABEL.BRIDGES_SPB}" id="city-lights">
			<aside>
				{$t.MESSAGE.NAVIGATION_MODE}
			</aside>
			<InputCheckbox
				bind:checked="{settings.bridges_spb_navigation}"
				disabled="{!settings.tabs.includes("BRIDGES")}"
				label="{$t.LABEL.NAVIGATION_ONLY}"
				name="bridges-spb-navigation"
			/>
		</Fieldset>
		<Fieldset legend="{$t.LABEL.LIGHTS_CITY}" id="city-lights">
			<InputRadio
				name="lights-city"
				options={LIGHTS_CITY_OPTIONS($t)}
				value="{settings.lights_city ?? ""}"
			/>
		</Fieldset>
		<Fieldset legend="{$t.LABEL.EVENT_ALLOW_LIST}" id="event-blacklist">
			<InputCheckboxGroup
				bind:value="{settings.events_bridges_spb}"
				name="timeline-events-map"
				groupLabel="{$t.LABEL.BRIDGES_SPB}"
				groupValue="bridges"
				options="{BRIDGES_EVENTS_OPTIONS($t)}"
			/>
			<InputCheckboxGroup
				bind:value="{settings.events_lights}"
				name="timeline-events-map"
				groupLabel="{$t.LABEL.LIGHTS_CITY}"
				groupValue="lights"
				options="{LIGHTS_EVENT_NAMES.map(value => ({
					label: $t.LIGHTS_EVENTS[value],
					value
				}))}"
			/>
			<InputCheckboxGroup
				bind:value="{settings.events_sun}"
				name="timeline-events-map"
				groupLabel="{$t.TITLE.SUN}"
				groupValue="sun"
				options="{SUN_EVENT_NAMES.map(value => ({
					label: $t.SUN_TIMES[value],
					value
				}))}"
			/>
			<InputCheckboxGroup
				bind:value="{settings.events_moon}"
				name="timeline-events-map"
				groupLabel="{$t.TITLE.MOON}"
				groupValue="moon"
				options="{MOON_EVENT_NAMES.map(value => ({
					label: $t.MOON_TIMES[value],
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
				{$t.LABEL.SAVE}
			</Button>
			<Button
				appearance="outline"
				on:click="{handleReset}"
			>
				{$t.LABEL.RESET}
			</Button>
		</Fieldset>
	</Form>
</div>
