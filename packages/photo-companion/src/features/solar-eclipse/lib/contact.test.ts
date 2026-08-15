import { describe, expect, test } from "vitest";

import { getSolarEclipseContactLinkTime } from "./contact";

describe("Solar eclipse contact links", () => {
	test.each([
		{
			description: "rounds C1 into the eclipse",
			input: { position: "begin" as const, timestamp: 1_000_000_123 },
			output: 1_000_001_000
		},
		{
			description: "keeps an exact-second C1 unchanged",
			input: { position: "begin" as const, timestamp: 1_000_000_000 },
			output: 1_000_000_000
		},
		{
			description: "rounds maximum down without crossing a contact",
			input: { position: "peak" as const, timestamp: 1_000_000_987 },
			output: 1_000_000_000
		},
		{
			description: "rounds C4 into the eclipse",
			input: { position: "end" as const, timestamp: 1_000_000_987 },
			output: 1_000_000_000
		}
	])("$description", ({ input, output }) => {
		const result = getSolarEclipseContactLinkTime(
			new Date(input.timestamp),
			input.position
		);

		expect(result.getTime()).toBe(output);
	});
});
