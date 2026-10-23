import type { Meta, StoryObj } from "storybook-solidjs-vite";

import { ErrorMessage } from "./error-message";

const meta = {
	args: {
		message: "The selected location is outside the supported range."
	},
	component: ErrorMessage,
	globals: { language: "en" },
	title: "Shared UI/Error Message"
} satisfies Meta<typeof ErrorMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
	args: {
		message: ""
	}
};
