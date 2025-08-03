import { useSearchParams } from "@solidjs/router";
import { createEffect, createMemo } from "solid-js";
import { isNonEmptyString, isNullable } from "utils/validators";

import { createQueryDate, parseQueryDate } from "~/shared/lib/query-date";

export function useDatetime() {
	const [ searchParams, setSearchParams ] = useSearchParams<{ datetime: string }>();

	const getDatetimeQuery = createMemo(() => {
		if (isNullable(searchParams.datetime)) {
			return createQueryDate();
		}

		return searchParams.datetime;
	});

	const getDatetime = () => parseQueryDate(getDatetimeQuery());
	const getTimestamp = () => getDatetime().getTime();

	const setDatetimeQuery = (input?: DateLike | string): void => {
		const datetime = isNonEmptyString(input)
			? input
			: createQueryDate(input);

		setSearchParams({ datetime });
	};

	createEffect(() => {
		if (isNullable(searchParams.datetime)) {
			setDatetimeQuery();
		}
	});

	return {
		getDatetime,
		getDatetimeQuery,
		getTimestamp,
		setDatetimeQuery
	};
}
