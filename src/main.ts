import App from "./App.svelte";
import "./styles/tokens.css";
import "./styles/globals.css";
import "./styles/utils.css";
import "./styles/main.css";

const app = new App({
	target: document.getElementById("app") as HTMLElement
});

const registerServiceWorker = async () => {
	if ("serviceWorker" in navigator) {
		try {
			await navigator.serviceWorker.register("/service-worker.js", {
				scope: "/"
			});
		} catch (error) {
			console.error(`Service worker registration failed with ${error}`);
		}
	}
};

if (import.meta.env.PROD) {
	void registerServiceWorker();
}

export default app;
