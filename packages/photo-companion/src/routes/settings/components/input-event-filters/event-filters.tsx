import { isSupportedCity } from "lights-schedule";
import { Show } from "solid-js";

import { useTranslation } from "@lib/context/translation";

import { BRIDGES_EVENTS_OPTIONS } from "../../settings.const";
import { useSettingsPage } from "../../settings.context";
import { InputCheckboxGroup } from "./input-checkbox-group";
import { LIGHTS_EVENT_NAMES, MOON_EVENT_NAMES, SUN_EVENT_NAMES } from "./input-event-filters.consts";

export const InputEventFilters = () => {
	const { t } = useTranslation();
	const { setSettingsStore, settingsStore } = useSettingsPage();

	return (
		<>
			<Show when={settingsStore.city === "SAINT_PETERSBURG"}>
				<InputCheckboxGroup
					groupLabel={t().LABEL.BRIDGES_SPB}
					groupValue="bridges"
					name="events_bridges_spb"
					onChange={setSettingsStore}
					options={BRIDGES_EVENTS_OPTIONS(t())}
					value={settingsStore.events_bridges_spb}
				/>
			</Show>
			<Show when={isSupportedCity(settingsStore.city)}>
				<InputCheckboxGroup
					groupLabel={t().LABEL.LIGHTS_CITY}
					groupValue="lights"
					name="events_lights"
					onChange={setSettingsStore}
					options={LIGHTS_EVENT_NAMES.map(value => ({
						label: t().LIGHTS_EVENTS[value],
						value
					}))}
					value={settingsStore.events_lights}
				/>
			</Show>
			<InputCheckboxGroup
				groupLabel={t().TITLE.SUN}
				groupValue="sun"
				name="events_sun"
				onChange={setSettingsStore}
				options={SUN_EVENT_NAMES.map(value => ({
					label: t().SUN_TIMES[value],
					value
				}))}
				value={settingsStore.events_sun}
			/>
			<InputCheckboxGroup
				groupLabel={t().TITLE.MOON}
				groupValue="moon"
				name="events_moon"
				onChange={setSettingsStore}
				options={MOON_EVENT_NAMES.map(value => ({
					label: t().MOON_TIMES[value],
					value
				}))}
				value={settingsStore.events_moon}
			/>
		</>
	);
};
