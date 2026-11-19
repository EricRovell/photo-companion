import type { Meta, StoryObj } from "storybook-solidjs-vite";

import { Notifications } from "../index";
import { NotificationDemo, NotificationVariantDemo, ReactiveNotificationDemo, StaticNotificationDemo } from "./stories";

import type { NotificationsProps } from "../index";

const meta = {
	component: Notifications,
	globals: { language: "en" },
	parameters: {
		docs: {
			description: {
				component: "An isolated notification channel with a framework-independent DOM renderer. Create a channel with createNotifications(), mount one Notifications viewport, then call show(), update(), dismiss(), or clear(). Inside a Solid component, createNotification(options) accepts a plain object, including reactive property getters, or createNotification(() => options) tracks a reactive source. Return null, undefined, or false to dismiss it. Both forms clean up automatically on unmount. Each example has its own channel; the helper defaults to the shared application channel."
			}
		}
	},
	title: "Shared UI/Notifications"
} satisfies Meta<typeof Notifications>;

export default meta;
type Story = StoryObj<Omit<NotificationsProps, "center">>;

export const Stacked: Story = {
	render: () => <NotificationDemo mode="stack" />
};

export const AnimatedStack: Story = {
	parameters: {
		docs: {
			description: {
				story: "Starts empty to show the first arrival. Add individual notifications or a staggered burst to watch new cards slide in and existing cards settle into the stack."
			}
		}
	},
	render: () => <NotificationDemo mode="animation" />
};

export const Expanded: Story = {
	render: () => <NotificationDemo mode="expanded" />
};

export const PersistentAction: Story = {
	render: () => <NotificationDemo mode="persistent" />
};

export const Static: Story = {
	parameters: {
		docs: { description: { story: "createNotification({ title, variant, ... }, { center? }) shows a notification from plain options and removes it when its component unmounts. Use property getters when individual options need to track reactive values." } }
	},
	render: () => <StaticNotificationDemo />
};

export const Reactive: Story = {
	parameters: {
		docs: { description: { story: "createNotification(() => options, { center? }) owns one notification for the current component. Its accessor tracks reactive values, updates the same card, and dismisses it when the accessor returns null or the component unmounts. Pass center for an isolated channel; omit it to use the application channel." } }
	},
	render: () => <ReactiveNotificationDemo />
};

export const Timed: Story = {
	parameters: {
		docs: { description: { story: "Timed notifications show a shrinking line along the bottom edge. Only the front card counts down in a collapsed stack; covered cards resume their remaining time when revealed. An expanded viewport counts down all readable cards. Hover, focus, dragging, and hidden tabs pause countdowns. Persistent notifications have no countdown line." } }
	},
	render: () => <NotificationDemo mode="timers" />
};

export const CustomContent: Story = {
	render: () => <NotificationDemo mode="custom" />
};

export const TopRight: Story = {
	render: () => <NotificationDemo mode="stack" position="top-right" />
};

export const Variants: Story = {
	parameters: {
		docs: { description: { story: "Use variant to choose neutral, info, success, warning, or error. Error notifications use an urgent announcement; other types use polite announcements." } }
	},
	render: () => <NotificationVariantDemo />
};

export const Neutral: Story = {
	render: () => <NotificationVariantDemo variant="neutral" />
};

export const Info: Story = {
	render: () => <NotificationVariantDemo variant="info" />
};

export const Success: Story = {
	render: () => <NotificationVariantDemo variant="success" />
};

export const Warning: Story = {
	render: () => <NotificationVariantDemo variant="warning" />
};

export const Error: Story = {
	render: () => <NotificationVariantDemo variant="error" />
};
