import { parseQueryDate } from "@lib/helpers";
import { useSearchParams } from "@solidjs/router";
import { createEffect, createSignal } from "solid-js";

export function useDatetime() {
	const [ query ] = useSearchParams();
	// @ts-expect-error TODO: update types
	const initialValue = new Date(parseQueryDate(query.date));
	const [ date, setDate ] = createSignal<Date>(initialValue);

	createEffect(() => {
		// @ts-expect-error TODO: update types
		setDate(new Date(parseQueryDate(query.date)));
	});

	return {
		date
	};
}
