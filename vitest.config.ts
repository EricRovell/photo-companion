import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		coverage: {
			provider: "v8",
			reporter: [ "json", "html" ]
		},
		environmentMatchGlobs: [
			[ "**/test/**", "node" ],
			[ "**/versioned-local-storage/test/*.test.ts", "happy-dom" ]
		]
	}
});
