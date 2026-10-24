import type { Meta, StoryObj } from "storybook-solidjs-vite";

import {
	IconArrowDown,
	IconArrowUp,
	IconBook,
	IconBridge,
	IconCalendar,
	IconChevronDown,
	IconChevronLeft,
	IconChevronRight,
	IconClose,
	IconCube,
	IconLights,
	IconMenu,
	IconMoon,
	IconPullRequest,
	IconSettings,
	IconShadow,
	IconSun,
	IconTimeline,
	IconWarning
} from "../icons";
import { Icon } from "./icon";

const meta = {
	component: Icon,
	globals: { language: "en" },
	title: "Shared UI/Icons"
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Custom: Story = {
	args: {
		height: 48,
		title: "Camera aperture",
		width: 48
	},
	render: args => (
		<Icon {...args}>
			<circle
				cx="128"
				cy="128"
				fill="none"
				r="88"
				stroke="currentColor"
				stroke-width="16"
			/>
			<circle cx="128" cy="128" r="32" />
		</Icon>
	)
};

export const Gallery: Story = {
	render: () => (
		<div class="storybook-row">
			<IconArrowDown height="32" title="Arrow down" width="32" />
			<IconArrowUp height="32" title="Arrow up" width="32" />
			<IconBook height="32" title="Book" width="32" />
			<IconBridge height="32" title="Bridge" width="32" />
			<IconCalendar height="32" title="Calendar" width="32" />
			<IconChevronDown height="32" title="Chevron down" width="32" />
			<IconChevronLeft height="32" title="Chevron left" width="32" />
			<IconChevronRight height="32" title="Chevron right" width="32" />
			<IconClose height="32" title="Close" width="32" />
			<IconCube height="32" title="Cube" width="32" />
			<IconLights height="32" title="Lights" width="32" />
			<IconMenu height="32" title="Menu" width="32" />
			<IconMoon height="32" title="Moon" width="32" />
			<IconPullRequest height="32" title="Pull request" width="32" />
			<IconSettings height="32" title="Settings" width="32" />
			<IconShadow height="32" title="Shadow" width="32" />
			<IconSun height="32" title="Sun" width="32" />
			<IconTimeline height="32" title="Timeline" width="32" />
			<IconWarning height="32" title="Warning" width="32" />
		</div>
	)
};
