import App from "./App.svelte";
import "./styles/tokens.css";
import "./styles/globals.css";
import "./styles/utils.css";
import "./styles/main.css";

const app = new App({
	target: document.getElementById("app") as HTMLElement
});

export default app;
