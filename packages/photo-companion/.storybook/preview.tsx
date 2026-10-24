import { createJSXDecorator } from "storybook-solidjs-vite";
import { themes } from "storybook/theming";

import type { Preview } from "storybook-solidjs-vite";

import { StoryLanguageProvider } from "../src/stories/story-language";

import "../src/app/styles/globals.css";
import "../src/app/styles/main.css";
import "../src/app/styles/utils.css";
import "../src/app/styles/tokens.css";
import "./preview.css";

const preview: Preview = {
	decorators: [
		createJSXDecorator((Story, context) => (
			<StoryLanguageProvider
				language={context.globals.language === "ru" ? "ru" : "en"}
			>
				<Story />
			</StoryLanguageProvider>
		))
	],
	globalTypes: {
		language: {
			description: "Preview language",
			toolbar: {
				dynamicTitle: true,
				icon: "globe",
				items: [ { title: "English", value: "en" }, { title: "Русский", value: "ru" } ],
				title: "Language"
			}
		}
	},
	initialGlobals: {
		language: "en"
	},
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
