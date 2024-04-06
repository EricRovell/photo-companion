import { parseQueryDate } from "@lib/helpers";
import { useSearchParams } from "@solidjs/router";
import { createEffect, createSignal } from "solid-js";

export function useDatetime() {
	const [ query ] = useSearchParams();
	const initialValue = new Date(parseQueryDate(query.date));
	const [ date, setDate ] = createSignal<Date>(initialValue);

	createEffect(() => {
		setDate(new Date(parseQueryDate(query.date)));
	});

	return {
		date
	};
}
