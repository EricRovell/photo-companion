import type { Meta, StoryObj } from "storybook-solidjs-vite";

import { InputLocation } from "./input-location";

const meta = {
	args: {
		labels: {
			degrees: "Degrees",
			minutes: "Minutes",
			seconds: "Seconds"
		},
		legend: "Latitude",
		name: "latitude",
		value: [ 59, 50, 40 ]
	},
	component: InputLocation,
	globals: { language: "en" },
	title: "Shared UI/Input Location"
} satisfies Meta<typeof InputLocation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AbsoluteWithError: Story = {
	args: {
		abs: true,
		error: true
	}
};
