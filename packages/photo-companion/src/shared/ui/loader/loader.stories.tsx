import type { Meta, StoryObj } from "storybook-solidjs-vite";

import { Loader } from "./loader";

const meta = {
	component: Loader,
	title: "Shared UI/Loader"
} satisfies Meta<typeof Loader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Large: Story = {
	args: {
		style: { "--loader-size": "4rem" }
	}
};
