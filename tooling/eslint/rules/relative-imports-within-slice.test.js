// @ts-check

import { resolve } from "node:path";

import { RuleTester } from "eslint";
import { describe, it } from "vitest";

import relativeImportsWithinSlice from "./relative-imports-within-slice.js";

RuleTester.describe = describe;
RuleTester.it = it;

const sliceRoot = resolve("packages/photo-companion/src/features/settings");
const filename = resolve(sliceRoot, "model/settings-form.js");
const options = [{
	alias: "~/features/settings",
	sliceRoot
}];

const ruleTester = new RuleTester({
	languageOptions: {
		ecmaVersion: "latest",
		sourceType: "module"
	}
});

ruleTester.run("relative-imports-within-slice", relativeImportsWithinSlice, {
	invalid: [
		{
			code: "import { value } from \"~/features/settings/consts/model\";",
			errors: [{ messageId: "useRelative" }],
			filename,
			options,
			output: "import { value } from \"../consts/model\";"
		},
		{
			code: "export { value } from '~/features/settings/lib/value';",
			errors: [{ messageId: "useRelative" }],
			filename,
			options,
			output: "export { value } from '../lib/value';"
		},
		{
			code: "const module = import(\"~/features/settings/model/lazy\");",
			errors: [{ messageId: "useRelative" }],
			filename,
			options,
			output: "const module = import(\"./lazy\");"
		},
		{
			code: "import { value } from \"~/features/settings\";",
			errors: [{ messageId: "avoidPublicApi" }],
			filename,
			options,
			output: null
		}
	],
	valid: [
		{
			code: "import { value } from \"../consts/model\";",
			filename,
			options
		},
		{
			code: "import { value } from \"~/shared/lib/value\";",
			filename,
			options
		},
		{
			code: "import { value } from \"~/features/settings-extra\";",
			filename,
			options
		}
	]
});
