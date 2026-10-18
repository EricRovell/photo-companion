import type { StorybookConfig } from "storybook-solidjs-vite";

const config = {
	addons: [
		"@storybook/addon-docs",
		"@storybook/addon-a11y"
	],
	core: {
		disableTelemetry: true
	},
	framework: {
		name: "storybook-solidjs-vite",
		options: {}
	},
	staticDirs: [ "../public" ],
	stories: [ "../src/**/*.stories.@(ts|tsx)" ]
} satisfies StorybookConfig;

export default config;
