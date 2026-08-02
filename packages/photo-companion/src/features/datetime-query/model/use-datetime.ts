import { useSearchParams } from "@solidjs/router";
import { createMemo } from "solid-js";
import { isNonEmptyString, isNullable } from "utils/validators";

import { createQueryDate, parseQueryDate } from "~/shared/lib/query-date";

export function useDatetime() {
	const [ searchParams, setSearchParams ] = useSearchParams<{ datetime: string }>();
	const initialDatetimeQuery = createQueryDate();

	const getDatetimeQuery = createMemo(() => {
		if (isNullable(searchParams.datetime)) {
			return initialDatetimeQuery;
		}

		return searchParams.datetime;
	});

	const getDatetime = () => parseQueryDate(getDatetimeQuery());
	const getTimestamp = () => getDatetime().getTime();

	const setDatetimeQuery = (input?: DateLike | string): void => {
		if (isNullable(input)) {
			setSearchParams({ datetime: undefined });
			return;
		}

		const datetime = isNonEmptyString(input)
			? input
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
