import { describe, expect, it } from "vitest";

import { hoursMinutesFormatter, listFormatter } from "../src/formatters";

describe("Project's core utilities", () => {
	describe("hoursMinutesFormatter", () => {
		it.each([
			[ 0, "0 min" ],
			[ 2, "2 min" ],
			[ 60, "1 hr" ],
			[ 135, "2 hr 15 min" ],
			[ 2192, "36 hr 32 min" ]
		])("formats %i minutes as %s", (minutes, expected) => {
			expect(hoursMinutesFormatter("en")(minutes)).toBe(expected);
		});

		it("supports compact units and the selected locale", () => {
			expect(hoursMinutesFormatter("en", "narrow")(692)).toBe("11h 32m");
			expect(hoursMinutesFormatter("ru")(692)).toBe("11 ч 32 мин");
		});
	});

	describe("listFormatter", () => {
		it("formats conjunctions for the selected locale", () => {
			expect(listFormatter("en")([ "Sun", "Moon" ])).toBe("Sun and Moon");
			expect(listFormatter("ru")([ "Солнце", "Луна" ])).toBe("Солнце и Луна");
		});
	});
});
