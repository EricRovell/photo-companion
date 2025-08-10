import { MetaProvider } from "@solidjs/meta";
import { Suspense } from "solid-js";
import { Toaster } from "solid-sonner";

import { ToastSuggestUpdate } from "~/components";
import { NavigationServiceProvider } from "~/features/navigation";
import { SettingsProvider } from "~/features/settings";
import { TranslationProvider } from "~/features/translation";
import { ServiceWorkerProvider } from "~/services/service-worker";

import { Routes } from "../routes";

import "../styles/globals.css";
import "../styles/main.css";
import "../styles/utils.css";
import "../styles/tokens.css";

export const App = () => (
	<ServiceWorkerProvider>
		<MetaProvider>
			<SettingsProvider>
				<NavigationServiceProvider>
					<Suspense>
						<TranslationProvider>
							<Routes />
							<ToastSuggestUpdate />
							<Toaster position="bottom-center" richColors theme="dark" />
						</TranslationProvider>
					</Suspense>
				</NavigationServiceProvider>
			</SettingsProvider>
		</MetaProvider>
	</ServiceWorkerProvider>
);
