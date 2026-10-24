import type { Meta, StoryObj } from "storybook-solidjs-vite";

import { CITY_OPTIONS } from "~/shared/consts";

import { LightsEdgeCases, LightsPlayground } from "./stories/city-lights-preview";
import { defaults } from "./stories/fixtures";

import type { StoryArgs } from "./stories/fixtures";

const meta = {
	args: defaults,
	argTypes: {
		city: { control: "select", options: CITY_OPTIONS },
		hour: {
			control: { max: 36, min: 12, step: 0.05, type: "range" },
			description: "Selected hour; hours above 23 are on the following morning."
		},
		offHour: { control: { max: 12, min: 0, step: 0.05, type: "number" } },
		onHour: { control: { max: 24, min: 12, step: 0.05, type: "number" } },
		source: { control: "select", options: [ "SCHEDULE", "SOLAR_ESTIMATE" ] },
		status: { control: "select", options: [ "SCHEDULED", "CONTINUOUS_DAYLIGHT", "CONTINUOUS_DARKNESS", "UNAVAILABLE" ] },
		uncertaintyMinutes: { control: "select", options: [ 0, 30, 60 ] },
		width: { control: { max: 960, min: 280, type: "number" } }
	},
	parameters: {
		docs: {
			description: {
				component: "City lights widget with explicit schedules and selected times, independent of location, storage, or live solar calculations."
			}
		}
	},
	render: args => <LightsPlayground {...args} />,
	title: "Widgets/City lights"
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OfficialSchedule: Story = {};
export const SaintPetersburg: Story = { args: { city: "SAINT_PETERSBURG", width: 340 } };
export const SolarEstimate: Story = { args: { city: "OTHER", source: "SOLAR_ESTIMATE" } };
export const WiderEstimate: Story = { args: { city: "OTHER", source: "SOLAR_ESTIMATE", uncertaintyMinutes: 60 } };
export const Narrow: Story = { args: { city: "OTHER", source: "SOLAR_ESTIMATE", width: 280 } };

export const EdgeCases: Story = {
	args: { width: 340 },
	parameters: {
		controls: { include: [ "width" ] },
		docs: {
			description: {
				story: "Fixed states covering exact switches, midnight and noon, short and long nights, changing schedules, uncertainty overlap and clipping, missing next events, polar conditions, and unavailable data."
			}
		}
	},
	render: args => <LightsEdgeCases width={args.width} />
};
