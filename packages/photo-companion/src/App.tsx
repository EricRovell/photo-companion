import { MetaProvider } from "@solidjs/meta";
import { Suspense } from "solid-js";

import { ModalSuggestUpdate } from "@lib/components";
import { SettingsProvider } from "@lib/context/settings";
import { TranslationProvider } from "@lib/context/translation";

import { Routes } from "./routes";
import { ServiceWorkerProvider } from "./services/service-worker";

import "./styles/globals.css";
import "./styles/main.css";
import "./styles/utils.css";
import "ui/styles/tokens.css";

export const App = () => (
	<ServiceWorkerProvider>
		<MetaProvider>
			<SettingsProvider>
				<Suspense>
					<TranslationProvider>
						<Routes />
						<ModalSuggestUpdate />
					</TranslationProvider>
				</Suspense>
			</SettingsProvider>
		</MetaProvider>
	</ServiceWorkerProvider>
);
