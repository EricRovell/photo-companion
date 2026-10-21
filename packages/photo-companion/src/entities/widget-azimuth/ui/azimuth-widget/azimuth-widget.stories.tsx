import { createEffect, createSignal, untrack } from "solid-js";

import type { Meta, StoryObj } from "storybook-solidjs-vite";

import { AzimuthWidgetView } from "./azimuth-widget";

import type { AzimuthWidgetEntity, AzimuthWidgetLabels } from "../../types";

interface StoryArgs {
	aligned: boolean;
	heading: number;
	pending: boolean;
	supported: boolean;
	width: number;
}

const labels: AzimuthWidgetLabels = {
	align: "Align with device",
	alignBlocked: "Compass access is blocked in this browser context",
	alignDenied: "Compass permission was denied",
	aligned: "Aligned",
	alignTimeout: "No heading data was received. Try again",
	alignUnavailable: "Device heading is unavailable",
	altitude: "Altitude",
	azimuth: "Azimuth",
	celestialBody: "Celestial body",
	east: "East",
	north: "North",
	south: "South",
	west: "West"
};

const entities: AzimuthWidgetEntity[] = [
	{
		altitude: 38,
		azimuth: 135,
		id: "sun",
		label: "Sun",
		path: Array.from({ length: 73 }, (_, index) => ({
			altitude: -50 * Math.cos(index * Math.PI / 36),
			azimuth: index * 5
		}))
	},
	{
		altitude: 19,
		azimuth: 245,
		id: "moon",
		label: "Moon",
		path: Array.from({ length: 73 }, (_, index) => ({
			altitude: -35 * Math.cos((index * 5 - 60) * Math.PI / 180),
			azimuth: index * 5
		}))
	}
];

const meta = {
	args: {
		aligned: false,
		heading: 45,
		pending: false,
		supported: true,
		width: 560
	},
	argTypes: {
		aligned: {
			control: "boolean",
			description: "Start with device alignment enabled. Click the button to toggle."
		},
		heading: {
			control: {
				max: 359,
				min: 0,
				type: "range"
			},
			description: "Simulated device heading in degrees"
		},
		pending: {
			control: "boolean",
			description: "Waiting for device heading"
		},
		supported: {
			control: "boolean",
			description: "Device heading is available"
		},
		width: {
			control: {
				max: 960,
				min: 280,
				type: "number"
			}
		}
	},
	parameters: {
		docs: {
			description: {
				component: "Interactive azimuth widget with simulated device heading. These previews work on desktop without sensor permissions."
			}
		}
	},
	render: args => {
		const [ aligned, setAligned ] = createSignal(untrack(() => args.aligned));

		createEffect(() => setAligned(args.aligned));

		return (
			<div style={{ "max-width": "100%", "text-align": "center", width: `${args.width}px` }}>
				<AzimuthWidgetView
					deviceHeading={{
						canAlign: () => args.supported,
						error: () => null,
						heading: () => args.heading,
						requestHeading: () => {
							setAligned(true);
							return Promise.resolve();
						},
						status: () => args.pending ? "requesting" : aligned() ? "active" : "idle",
						stopHeading: () => { setAligned(false); }
					}}
					entities={entities}
					formatters={{
						ariaEntity: (label, azimuth) => `${label}: ${azimuth}°`,
						list: values => values.join(", ")
					}}
					labels={labels}
					title="Sun / Moon · Azimuth"
				/>
			</div>
		);
	},
	title: "Widgets/Azimuth"
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NotAligned: Story = {};

export const Aligned: Story = {
	args: { aligned: true }
};

export const Requesting: Story = {
	args: { pending: true }
};

export const HeadingUnavailable: Story = {
	args: { supported: false }
};

export const Mobile: Story = {
	args: { width: 320 }
};

export const MobileAligned: Story = {
	args: { aligned: true, width: 320 }
};
