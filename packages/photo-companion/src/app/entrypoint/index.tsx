import { render } from "solid-js/web";

import { App } from "./app";

const root = document.querySelector<HTMLDivElement>("#app");

if (!root) {
	throw new Error(`The root #app element is not found: ${root}`);
}

render(() => <App />, root);
