/* eslint-disable no-constant-binary-expression */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */

import { describe, expect, it } from "vitest";

import { classnames } from "../src";

describe("Common utils: classnames", () => {
	it("Takes in a string arguments", () => {
		expect(classnames("hello")).toBe("hello");
		expect(classnames("hello", "world")).toBe("hello world");
		expect(classnames("hello", false && "world", "heavens")).toBe("hello heavens");
	});
	it("Takes in an object argument", () => {
		expect(classnames({ hello: true })).toBe("hello");
		expect(classnames({ hello: true, world: true })).toBe("hello world");
		expect(classnames({ hello: true, world: false })).toBe("hello");
		expect(classnames({ heavens: true, hello: true, world: false })).toBe("heavens hello");
	});
	it("Takes in an array argument", () => {
		expect(classnames([ "hello" ])).toBe("hello");
		expect(classnames([ "hello", "world" ])).toBe("hello world");
		expect(classnames([ "hello", false && "world", "heavens" ])).toBe("hello heavens");
	});
	it("Takes a mixed types arguments", () => {
		expect(classnames([ "hello" ], "world", { here: "!", what: false })).toBe("hello world here");
		expect(classnames([ "hello" ], null, { here: "!", what: false })).toBe("hello here");
		expect(classnames([ "", "hello", "" ], "", { here: "!", what: false })).toBe("hello here");
	});
});
