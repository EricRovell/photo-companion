import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		coverage: {
			provider: "v8",
			reporter: [ "json", "html" ]
		},
		projects: [
			{
				test: {
					environment: "node",
					exclude: [
						"**/node_modules/**",
						"packages/photo-companion/**",
						"packages/versioned-local-storage/**"
					],
					include: [
						"packages/**/test/**/*.test.ts",
						"tooling/**/*.test.js"
					],
					name: "unit"
				}
			},
			{
				test: {
					environment: "happy-dom",
					include: [ "packages/versioned-local-storage/test/**/*.test.ts" ],
					name: "versioned-local-storage"
				}
			},
			"packages/photo-companion/vitest.config.ts"
		]
	}
});
