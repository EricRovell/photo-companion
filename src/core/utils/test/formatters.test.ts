import { describe, expect, it } from "vitest";
import { template } from "../src/formatters";

describe("Project's core utilities", () => {
	describe("template", () => {
		it("Format the string", () => {
			expect(template("Hello, {name}!", {
				name: "Peter"
			})).toBe("Hello, Peter!");
			expect(template("My name is {name}. I am {age} years old", {
				name: "Peter",age: 5
			})).toBe("My name is Peter. I am 5 years old");
			expect(template("My name is {name}. I am {age} years old and I am {name} too!", {
				name: "Peter",age: 5
			})).toBe("My name is Peter. I am 5 years old and I am Peter too!");
		});
		it("Leaves the capture in place if no value is provided to replace", () => {
			expect(template("Hello, {name}!", {})).toBe("Hello, name!");
			expect(template("Hello, {name}! Take an {fruit}", {
				fruit: "apple"
			})).toBe("Hello, name! Take an apple");
		});
		it("Allows to change the capturing schema", () => {
			expect(template("Hello, [name]!", {
				name: "Peter"
			}, /\[(.*?)\]/g)).toBe("Hello, Peter!");
			expect(template("Hello, {{name}}!", {
				name: "Peter"
			}, /\{\{(.*?)\}\}/g)).toBe("Hello, Peter!");
		});
	});
});
