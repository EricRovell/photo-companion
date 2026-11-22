import "@testing-library/jest-dom/vitest";

// jsdom's VM Performance object lacks the entries API used by the browser router.
if (typeof performance.getEntriesByType !== "function") {
	Object.defineProperty(performance, "getEntriesByType", {
		configurable: true,
		value: () => []
	});
}
