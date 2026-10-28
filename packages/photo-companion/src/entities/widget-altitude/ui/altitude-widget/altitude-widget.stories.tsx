import { getMoonPosition, getSunPosition } from "moon-sun-calc";

import type { Meta, StoryObj } from "storybook-solidjs-vite";

import { useTranslation } from "~/features/translation";
import { StoryTranslations } from "~/stories/story-language";

import { AltitudeWidget } from "../../index";

interface StoryArgs {
	day: number;
	hour: number;
	latitude: number;
	longitude: number;
	month: number;
	moon: boolean;
	width: number;
}

function Preview(props: StoryArgs) {
	const { t } = useTranslation();
	const date = () => new Date(2026, props.month - 1, props.day, Math.floor(props.hour), Math.round(props.hour % 1 * 60));

	return (
		<div
			style={{
				"max-width": "100%",
				width: `${props.width}px`
			}}
		>
			<AltitudeWidget
				date={date()}
				entities={[
					{
						getPosition: getSunPosition,
						id: "sun",
						label: t().TITLE.SUN
					},
					...(props.moon ? [ {
						getPosition: getMoonPosition,
						id: "moon" as const,
						label: t().TITLE.MOON
					} ] : [])
				]}
				latitude={props.latitude}
				longitude={props.longitude}
				title={props.moon ? t().TITLE.ELEVATION_MOON : t().TITLE.ELEVATION_SUN}
			>
				<AltitudeWidget.Header />
				<AltitudeWidget.Content>
					<AltitudeWidget.Chart>
						<AltitudeWidget.Grid />
						<AltitudeWidget.Path />
						<AltitudeWidget.Cursor />
					</AltitudeWidget.Chart>
					<AltitudeWidget.Legend />
				</AltitudeWidget.Content>
			</AltitudeWidget>
		</div>
	);
}

const meta = {
	args: {
		day: 21,
		hour: 14,
		latitude: 59.94,
		longitude: 30.31,
		month: 10,
		moon: false,
		width: 560
	},
	argTypes: {
		day: {
			control: {
				max: 31,
				min: 1,
				step: 1,
				type: "range"
			}
		},
		hour: {
			control: {
				max: 23.99,
				min: 0,
				step: 0.25,
				type: "range"
			}
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
		moon: { control: "boolean" },
		width: {
			control: {
				max: 960,
				min: 280,
				type: "number"
			}
		}
	},
	render: args => <StoryTranslations><Preview {...args} /></StoryTranslations>,
	title: "Widgets/Altitude"
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sun: Story = {};
export const SunAndMoon: Story = { args: { moon: true } };
export const Mobile: Story = {
	args: {
		moon: true,
		width: 320
	}
};
export const Midnight: Story = {
	args: {
		hour: 0,
		moon: true
	}
};
export const EndOfDay: Story = {
	args: {
		hour: 23.99,
		moon: true
	}
};
export const PolarDay: Story = {
	args: {
		latitude: 78,
		month: 6
	}
};
export const PolarNight: Story = {
	args: {
		latitude: 78,
		month: 12
	}
};
