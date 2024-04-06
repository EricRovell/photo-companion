import { render } from "solid-js/web";

import { App } from "./App";

const root = document.querySelector("#app") as HTMLDivElement;

render(() => <App />, root);
