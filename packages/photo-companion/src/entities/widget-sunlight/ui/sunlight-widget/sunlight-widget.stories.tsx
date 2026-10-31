import type { Meta, StoryObj } from "storybook-solidjs-vite";

import { StoryTranslations } from "~/stories/story-language";

import { SunlightWidget } from "./sunlight-widget";

interface StoryArgs {
	day: number;
	hour: number;
	latitude: number;
	longitude: number;
	month: number;
	width: number;
}

function Preview(props: StoryArgs) {
	const date = () => new Date(Date.UTC(2026, props.month - 1, props.day, Math.floor(props.hour), Math.round(props.hour % 1 * 60)));

	return (
		<div
			style={{
				"max-width": "100%",
				width: `${props.width}px`
			}}
		>
			<SunlightWidget
				date={date()}
				latitude={props.latitude}
				longitude={props.longitude}
			/>
		</div>
	);
}

const meta = {
	args: {
		day: 21,
		hour: 17.75,
		latitude: 51.5,
		longitude: 0,
		month: 9,
		width: 560
	},
	argTypes: {
		day: {
			control: {
				max: 31,
				min: 1,
				type: "number"
			}
		},
		hour: {
			control: {
				max: 23.99,
				min: 0,
				step: 0.05,
				type: "range"
			},
			description: "Selected UTC hour. Displayed times use the browser's local time zone, as in the application."
		},
		latitude: {
			control: {
				max: 90,
				min: -90,
				type: "number"
			}
		},
		longitude: {
			control: {
				max: 180,
				min: -180,
				type: "number"
			}
		},
		month: {
			control: {
				max: 12,
				min: 1,
				type: "number"
			}
		},
		width: {
			control: {
				max: 960,
				min: 280,
				type: "number"
			}
		}
	},
	render: args => <StoryTranslations><Preview {...args} /></StoryTranslations>,
	title: "Widgets/Sunlight"
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const GoldenHour: Story = {};
export const Daylight: Story = { args: { hour: 12 } };
export const BlueHour: Story = { args: { hour: 18.5 } };
export const CivilTwilight: Story = { args: { hour: 18.2 } };
export const NauticalTwilight: Story = { args: { hour: 19 } };
export const AstronomicalTwilight: Story = { args: { hour: 19.5 } };
export const Night: Story = { args: { hour: 23 } };
export const Mobile: Story = { args: { width: 320 } };
export const WhiteNight: Story = {
	args: {
		hour: 23,
		latitude: 59.94,
		longitude: 30.31,
		month: 6
	}
};
export const PolarDay: Story = {
	args: {
		latitude: 90,
		month: 6
	}
};
export const PolarNight: Story = {
	args: {
		latitude: 90,
		month: 12
	}
};
