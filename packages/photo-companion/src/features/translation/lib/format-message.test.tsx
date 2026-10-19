import { render } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";

import { formatMessage } from "./format-message";

function asRuntimeTemplate(template: string): string {
	return template;
}

describe("translation message formatting", () => {
	it("formats named primitive values", () => {
		expect(formatMessage("Hello, {name}. You have {count} photos.", {
			count: 3,
			name: "Alex"
		})).toBe("Hello, Alex. You have 3 photos.");
	});

	it("fails visibly when a runtime value is missing", () => {
		const message = asRuntimeTemplate("Hello, {name}.");

		expect(() => formatMessage(message, {}))
			.toThrow("Missing translation template value: name");
	});

	it("inserts JSX values without parsing HTML", () => {
		const view = render(() => (
			<p>
				{formatMessage("Status: {status}", {
					status: <strong>Ready</strong>
				})}
			</p>
		));

		expect(view.getByText("Ready").tagName).toBe("STRONG");
		expect(view.container).toHaveTextContent("Status: Ready");
	});

	it("renders nested rich-text tags with localized children", () => {
		const view = render(() => (
			<p>
				{formatMessage("Read <link>the <important>{subject}</important> guide</link>.", {
					important: children => <strong>{children}</strong>,
					link: children => <a href="/guide">{children}</a>,
					subject: "lighting"
				})}
			</p>
		));

		const link = view.getByRole("link");

		expect(link).toHaveAttribute("href", "/guide");
		expect(link).toHaveTextContent("the lighting guide");
		expect(view.getByText("lighting").tagName).toBe("STRONG");
	});

	it("rejects mismatched rich-text tags", () => {
		const message = asRuntimeTemplate("<link>Guide</strong>");

		expect(() => formatMessage(message, {
			link: children => <a href="/guide">{children}</a>,
			strong: children => <strong>{children}</strong>
		})).toThrow("Mismatched translation template tag: strong");
	});
});
