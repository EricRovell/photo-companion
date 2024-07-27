import { DEV, Show } from "solid-js";

import { SettingsProvider } from "@lib/context/settings";
import { TranslationProvider } from "@lib/context/translation";

import { Routes } from "./routes";
import { UpdateService } from "./sw-update-service";

import "./styles/globals.css";
import "./styles/main.css";
import "./styles/utils.css";
import "ui/styles/tokens.css";

export function App() {

	return (
		<>
			<SettingsProvider>
				<TranslationProvider>
					<Show when={!DEV}>
						<UpdateService />
					</Show>
					<Routes />
				</TranslationProvider>
			</SettingsProvider>
		</>
	);
}
