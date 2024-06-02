import type { Store } from "solid-js/store";

import { type SettingsStore, useTranslation } from "@lib/context";

import { BRIDGES_EVENTS_OPTIONS } from "../../settings.const";
import { type ChangeHandler, InputCheckboxGroup } from "./input-checkbox-group";
import { LIGHTS_EVENT_NAMES, MOON_EVENT_NAMES, SUN_EVENT_NAMES } from "./input-event-filters.consts";

interface Props {
	onChange?: ChangeHandler;
	store: Store<SettingsStore>
}

export const InputEventFilters = (props: Props) => {
	const { t } = useTranslation();

	return (
		<>
			<InputCheckboxGroup
				groupLabel={t().LABEL.BRIDGES_SPB}
				groupValue="bridges"
				name="events_bridges_spb"
				onChange={props.onChange}
				options={BRIDGES_EVENTS_OPTIONS(t())}
				value={props.store.events_bridges_spb}
			/>
			<InputCheckboxGroup
				groupLabel={t().LABEL.LIGHTS_CITY}
				groupValue="lights"
				name="events_lights"
				onChange={props.onChange}
				options={LIGHTS_EVENT_NAMES.map(value => ({
					label: t().LIGHTS_EVENTS[value],
					value
				}))}
				value={props.store.events_lights}
			/>
			<InputCheckboxGroup
				groupLabel={t().TITLE.SUN}
				groupValue="sun"
				name="events_sun"
				onChange={props.onChange}
				options={SUN_EVENT_NAMES.map(value => ({
					label: t().SUN_TIMES[value],
					value
				}))}
				value={props.store.events_sun}
			/>
			<InputCheckboxGroup
				groupLabel={t().TITLE.MOON}
				groupValue="moon"
				name="events_moon"
				onChange={props.onChange}
				options={MOON_EVENT_NAMES.map(value => ({
					label: t().MOON_TIMES[value],
					value
				}))}
				value={props.store.events_moon}
			/>
		</>
	);
};
