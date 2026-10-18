import { describe, expect, it } from "vitest";

import { listFormatter } from "../src/formatters";

describe("Project's core utilities", () => {
	describe("listFormatter", () => {
		it("formats conjunctions for the selected locale", () => {
			expect(listFormatter("en")([ "Sun", "Moon" ])).toBe("Sun and Moon");
			expect(listFormatter("ru")([ "Солнце", "Луна" ])).toBe("Солнце и Луна");
		});
	});
});
