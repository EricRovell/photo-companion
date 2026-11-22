
import { Loading } from "solid-js";

import { ServiceWorkerProvider } from "~/features/service-worker";
import { SettingsProvider } from "~/features/settings";
import { TranslationProvider } from "~/features/translation";
import { Notifications, notifications } from "~/shared/ui/notifications";

import { Routes } from "../routes";

import "../styles/globals.css";
import "../styles/main.css";
import "../styles/utils.css";
import "../styles/tokens.css";

export const App = () => (
	<ServiceWorkerProvider>
		<SettingsProvider>
			<Loading>
				<TranslationProvider>
					<Routes />
					<Notifications center={notifications} position="bottom-center" />
				</TranslationProvider>
			</Loading>
		</SettingsProvider>
	</ServiceWorkerProvider>
);
