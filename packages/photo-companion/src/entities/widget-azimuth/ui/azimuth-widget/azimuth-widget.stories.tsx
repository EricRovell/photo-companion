import { createEffect, createSignal, untrack } from "solid-js";

import type { Meta, StoryObj } from "storybook-solidjs-vite";

import { useTranslation } from "~/features/translation";
import { StoryTranslations } from "~/stories/story-language";

import { AzimuthWidgetView } from "./azimuth-widget";

import type { AzimuthWidgetEntity, AzimuthWidgetLabels } from "../../types";

interface StoryArgs {
	aligned: boolean;
	heading: number;
	pending: boolean;
	supported: boolean;
	width: number;
}

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

function AzimuthPreview(args: StoryArgs) {
	const [ aligned, setAligned ] = createSignal(untrack(() => args.aligned));
	const { format, t } = useTranslation();

	const labels = (): AzimuthWidgetLabels => ({
		align: t().LABEL.ALIGN_COMPASS,
		alignBlocked: t().ERRORS.DEVICE_HEADING_BLOCKED,
		alignDenied: t().ERRORS.DEVICE_HEADING_PERMISSION_DENIED,
		aligned: t().LABEL.COMPASS_ALIGNED,
		alignTimeout: t().ERRORS.DEVICE_HEADING_TIMEOUT,
		alignUnavailable: t().ERRORS.DEVICE_HEADING_UNAVAILABLE,
		altitude: t().LABEL.ALTITUDE,
		azimuth: t().LABEL.AZIMUTH,
		celestialBody: t().LABEL.CELESTIAL_BODY,
		east: t().LABEL.LONGITUDE_EAST,
		north: t().LABEL.LATITUDE_NORTH,
		south: t().LABEL.LATITUDE_SOUTH,
		west: t().LABEL.LONGITUDE_WEST
	});

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
				entities={entities.map(entity => ({
					...entity,
					label: entity.id === "sun"
						? t().TITLE.SUN
						: t().TITLE.MOON
				}))}
				formatters={{
					ariaEntity: (label, azimuth) => format().message(t().AZIMUTH.ARIA_ENTITY, {
						azimuth: format().degrees(azimuth), label
					}),
					list: values => format().list(values)
				}}
				labels={labels()}
				title={format().message(t().AZIMUTH.TITLE_SUN_MOON, {
					azimuth: t().LABEL.AZIMUTH,
					moon: t().TITLE.MOON, sun: t().TITLE.SUN
				})}
			/>
		</div>
	);
}

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
	render: args => <StoryTranslations><AzimuthPreview {...args} /></StoryTranslations>,
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
