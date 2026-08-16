import { useSearchParams } from "@solidjs/router";
import { createMemo } from "solid-js";

export type SearchParamValue = string | string[] | undefined;

type SearchParamParsers<Params> = {
	readonly [Key in keyof Params]: (value: SearchParamValue) => Params[Key];
};

export function useParsedSearchParams<Params extends Record<string, unknown>>(
	parsers: SearchParamParsers<Params>
) {
	type Key = Extract<keyof Params, string>;
	type RawParams = Record<Key, string | string[]>;

	const [ rawSearchParams, setSearchParams ] = useSearchParams<RawParams>();
	const searchParams = {} as Readonly<Params>;

	for (const key of Object.keys(parsers) as Key[]) {
		const getValue = createMemo<Params[Key]>(() => parsers[key](rawSearchParams[key]));

		// Expose the memo as a property getter to preserve reactive, router-style access.
		Object.defineProperty(searchParams, key, {
			enumerable: true,
			get: getValue
		});
	}

	return { searchParams, setSearchParams };
}
