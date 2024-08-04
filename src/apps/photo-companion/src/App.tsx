import { MetaProvider } from "@solidjs/meta";
import { DEV, Show } from "solid-js";

import { SettingsProvider } from "@lib/context/settings";
import { TranslationProvider } from "@lib/context/translation";

import { Routes } from "./routes";
import { UpdateService } from "./sw-update-service";

import "./styles/globals.css";
import "./styles/main.css";
import "./styles/utils.css";
import "ui/styles/tokens.css";

export const App = () => (
	<>
		<MetaProvider>
			<SettingsProvider>
				<TranslationProvider>
					<Show when={!DEV}>
						<UpdateService />
					</Show>
					<Routes />
				</TranslationProvider>
			</SettingsProvider>
		</MetaProvider>
	</>
);
