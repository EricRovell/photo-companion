import { MetaProvider } from "@solidjs/meta";
import { Suspense } from "solid-js";
import { Toaster } from "solid-sonner";

import { NavigationServiceProvider } from "~/features/navigation";
import { ServiceWorkerProvider, ToastUpdate } from "~/features/service-worker";
import { SettingsProvider } from "~/features/settings";
import { TranslationProvider } from "~/features/translation";

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
							<ToastUpdate />
							<Toaster position="bottom-center" richColors theme="dark" />
						</TranslationProvider>
					</Suspense>
				</NavigationServiceProvider>
			</SettingsProvider>
		</MetaProvider>
	</ServiceWorkerProvider>
);
