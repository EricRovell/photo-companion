import type { Meta, StoryObj } from "storybook-solidjs-vite";

import { Text } from "../text/text";
import { Card } from "./index";

const meta = {
	component: Card,
	globals: { language: "en" },
	title: "Shared UI/Card"
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<div class="storybook-stack">
			<Card style={{ padding: "var(--space-5)" }}>
				<Text as="p">Card content</Text>
			</Card>
		</div>
	)
};

export const WithHeader: Story = {
	render: () => (
		<div class="storybook-stack">
			<Card>
				<Card.Header>
					<Text as="h2" variant="heading-l">Sun information</Text>
				</Card.Header>
				<Text as="p" style={{ padding: "var(--space-5)" }}>
					Golden hour begins at 20:42.
				</Text>
			</Card>
		</div>
	)
};
