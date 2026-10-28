import type { Meta, StoryObj } from "storybook-solidjs-vite";

import { Text } from "./text";

const meta = {
	args: {
		children: "The blue hour begins before sunrise.",
		variant: "text-m"
	},
	component: Text,
	globals: { language: "en" },
	title: "Shared UI/Text"
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TypographyScale: Story = {
	render: () => (
		<div class="storybook-stack">
			<Text as="h1" variant="heading-4xl">Heading 4XL</Text>
			<Text as="h2" variant="heading-2xl">Heading 2XL</Text>
			<Text as="h3" variant="heading-l">Heading L</Text>
			<Text as="p" variant="text-xl">Body XL</Text>
			<Text as="p" variant="text-m">Body M</Text>
			<Text as="p" variant="text-xs">Body XS</Text>
		</div>
	)
};

export const Colors: Story = {
	render: () => (
		<div class="storybook-row">
			<Text color="primary">Primary</Text>
			<Text color="secondary">Secondary</Text>
			<Text color="success">Success</Text>
			<Text color="danger">Danger</Text>
		</div>
	)
};

export const Svg: Story = {
	render: () => (
		<svg viewBox="0 0 320 80">
			<Text
				align="center"
				as="text"
				color="primary"
				variant="heading-l"
				x={160}
				y={30}
			>
				Altitude
			</Text>
			<Text
				align="center"
				as="text"
				color="secondary"
				numeric
				variant="text-s"
				x={160}
				y={60}
			>
				45° above the horizon
			</Text>
		</svg>
	)
};
