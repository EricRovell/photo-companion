import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import { resolve } from "node:path";

export default defineConfig({
	plugins: [
		solid()
	],
	resolve: {
		alias: {
			"@lib": resolve(__dirname, "./src/lib"),
			"@stores": resolve(__dirname, "./src/lib/stores")
		}
	}
});
