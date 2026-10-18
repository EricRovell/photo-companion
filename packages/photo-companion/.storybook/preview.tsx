import { themes } from "storybook/theming";

import type { Preview } from "storybook-solidjs-vite";

import "../src/app/styles/globals.css";
import "../src/app/styles/main.css";
import "../src/app/styles/utils.css";
import "../src/app/styles/tokens.css";
import "./preview.css";

const preview: Preview = {
	parameters: {
		a11y: {
			test: "todo"
		},
		controls: {
			expanded: true,
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i
			}
		},
		docs: {
			theme: themes.dark
		},
		layout: "padded"
	},
	tags: [ "autodocs" ]
};

export default preview;
