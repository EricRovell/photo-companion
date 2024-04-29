import type { Store } from "solid-js/store";

import { InputCheckboxGroup, type ChangeHandler } from "./input-checkbox-group";
import type { SettingsStore } from "@lib/stores/settings";
import { LIGHTS_EVENT_NAMES, SUN_EVENT_NAMES, MOON_EVENT_NAMES } from "@lib/constants";
import { BRIDGES_EVENTS_OPTIONS } from "../../settings.const";
import { t } from "@lib/stores/lang";

interface Props {
	store: Store<SettingsStore>
	onChange?: ChangeHandler;
}

export const InputEventFilters = (props: Props) => (
	<>
		<InputCheckboxGroup
			value={props.store.events_bridges_spb}
			name="events_bridges_spb"
			groupLabel={t().LABEL.BRIDGES_SPB}
			groupValue="bridges"
			options={BRIDGES_EVENTS_OPTIONS(t())}
			onChange={props.onChange}
		/>
		<InputCheckboxGroup
			value={props.store.events_lights}
			name="events_lights"
			groupLabel={t().LABEL.LIGHTS_CITY}
			groupValue="lights"
			options={LIGHTS_EVENT_NAMES.map(value => ({
				label: t().LIGHTS_EVENTS[value],
				value
			}))}
			onChange={props.onChange}
		/>
		<InputCheckboxGroup
			value={props.store.events_sun}
			name="events_sun"
			groupLabel={t().TITLE.SUN}
			groupValue="sun"
			options={SUN_EVENT_NAMES.map(value => ({
				label: t().SUN_TIMES[value],
				value
			}))}
			onChange={props.onChange}
		/>
		<InputCheckboxGroup
			value={props.store.events_moon}
			name="events_moon"
			groupLabel={t().TITLE.MOON}
			groupValue="moon"
			options={MOON_EVENT_NAMES.map(value => ({
				label: t().MOON_TIMES[value],
				value
			}))}
			onChange={props.onChange}
		/>
	</>
);
