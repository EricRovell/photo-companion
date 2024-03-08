import { isNullable } from "../validators";

/**
 * Replaces the entries within the string in curly braces (can be specified via regex parameter)
 * with values in object.
 * 
 * template("Hello, {name}!", { name: "Peter" }) -> "Hello, Peter!"
 * 
 * In case no replacement is provided, the capture leaves as it is, just curly braces are removed.
 * 
 * template("Hello, {name}!", {}) -> "Hello, name!"
 */
export function template(input: string, dict: Record<string, string | number>, regex = /{(.*?)}/g) {
	const replacer = (match: string, capture: string) => {
		const trimmedCapture = capture.trim();
		const replaceValue = dict[trimmedCapture];
		
		if (isNullable(replaceValue)) {
			return trimmedCapture;
		}

		return dict[trimmedCapture].toString();
	};

	return input.replace(regex, replacer);
}
