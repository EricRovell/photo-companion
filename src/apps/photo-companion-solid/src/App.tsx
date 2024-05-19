import { DEV, Show } from "solid-js";

import { Routes } from "./routes";
import { UpdateService } from "./sw-update-service";

import "ui-solid/styles/tokens.css";

import "./styles/globals.css";
import "./styles/main.css";
import "./styles/utils.css";

export function App() {

	return (
		<>
			<Show when={!DEV}>
				<UpdateService />
			</Show>
			<Routes />
		</>
	);
}
