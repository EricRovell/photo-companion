import { MemoryRouter, Route } from "@solidjs/router";
import { createJSXDecorator } from "storybook-solidjs-vite";

import type { Meta, StoryObj } from "storybook-solidjs-vite";

import { selectionScenarios, visualScenarios } from "./stories/fixtures";
import { IntervalSelectionGallery, RiseSetPlayground, ScenarioGallery } from "./stories/rise-set-preview";

import type { StoryArgs } from "./stories/rise-set-preview";

const meta = {
	args: {
		aboveHorizon: true,
		entity: "sun",
		hour: 12,
		missingEvents: "none",
		riseHour: 6,
		setHour: 18,
		width: 560
	},
	argTypes: {
		aboveHorizon: {
			control: "boolean",
			description: "Altitude controls brightness independently of event availability and progress."
		},
		entity: {
			control: "select",
			options: [ "sun", "moon" ]
		},
		hour: {
			control: { max: 24, min: 0, step: 0.25, type: "range" }
		},
		missingEvents: {
			control: "select",
			options: [ "none", "rise", "set", "both" ]
		},
		riseHour: {
			control: { max: 23, min: 0, type: "number" }
		},
		setHour: {
			control: { max: 47, min: 0, type: "number" },
			description: "Hours above 23 set on the following day."
		},
		width: {
			control: { max: 960, min: 280, type: "number" }
		}
	},
	// Async providers stay inside the previews so Story runs during the initial render.
	decorators: [
		createJSXDecorator(Story => (
			<MemoryRouter>
				<Route component={Story} path="*" />
			</MemoryRouter>
		))
	],
	render: args => <RiseSetPlayground {...args} />,
	title: "Widgets/Rise set"
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SunTimes: Story = {};
export const MoonTimes: Story = { args: { entity: "moon" } };

export const MoonEdgeCases: Story = {
	args: { width: 340 },
	parameters: {
		controls: { include: [ "width" ] },
		docs: {
			description: {
				story: "Fixed visual states with explicit event props, independent of cycle selection. Covers endpoints, midnight, missing events, and short and long intervals."
			}
		}
	},
	render: args => (
		<ScenarioGallery
			entity="moon"
			scenarios={visualScenarios}
			width={args.width}
		/>
	)
};

export const SunEdgeCases: Story = {
	args: { width: 340 },
	parameters: {
		controls: { include: [ "width" ] },
		docs: {
			description: {
				story: "The same visual states with the Sun. Altitude controls glow independently of event availability; the arc measures elapsed time between rise and set."
			}
		}
	},
	render: args => (
		<ScenarioGallery
			entity="sun"
			scenarios={visualScenarios}
			width={args.width}
		/>
	)
};

export const IntervalSelection: Story = {
	args: { entity: "sun", width: 340 },
	parameters: {
		controls: { include: [ "entity", "width" ] },
		docs: {
			description: {
				story: "Cycle-selection examples using the production selector: overnight cycles, days with only a rise or set, and two rises near polar day."
			}
		}
	},
	render: args => (
		<IntervalSelectionGallery
			entity={args.entity}
			scenarios={selectionScenarios}
			width={args.width}
		/>
	)
};
