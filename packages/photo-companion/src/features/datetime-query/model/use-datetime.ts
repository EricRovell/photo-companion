import { useSearchParams } from "@solidjs/router";
import { createMemo, createSignal } from "solid-js";
import { isNonEmptyString, isNullable } from "utils/validators";

import { createQueryDate, parseQueryDate } from "~/shared/lib/query-date";

export function useDatetime() {
	const [ searchParams, setSearchParams ] = useSearchParams<{ datetime: string }>();
	const [ getFallbackDatetimeQuery, setFallbackDatetimeQuery ] = createSignal(createQueryDate());

	const getDatetimeQuery = createMemo(() => {
		if (isNullable(searchParams.datetime)) {
			return getFallbackDatetimeQuery();
		}

		return searchParams.datetime;
	});

	const getDatetime = () => parseQueryDate(getDatetimeQuery());
	const getTimestamp = () => getDatetime().getTime();

	const setDatetimeQuery = (input?: DateLike | string): void => {
		if (isNullable(input)) {
			setFallbackDatetimeQuery(createQueryDate());
			setSearchParams({ datetime: null });
			return;
		}

		const datetime = isNonEmptyString(input)
			? createQueryDate(parseQueryDate(input))
			: createQueryDate(input);

		setSearchParams({ datetime });
	};

	return {
		getDatetime,
		getDatetimeQuery,
		getTimestamp,
		setDatetimeQuery
	};
}
