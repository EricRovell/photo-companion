import { useLocation } from "@solidjs/router";
import { createMemo, splitProps } from "solid-js";

import { Link, type LinkProps } from "~/shared/ui";

/**
 * Wrapper over the `<Link />` that sync the query params.
 */
export function LinkQuery(allProps: LinkProps) {
	const [ props, rest ] = splitProps(allProps, [ "children", "query" ]);
	const location = useLocation();
	const search = createMemo(() => location.search);

	const query = () => {
		if (!props.query) {
			return search();
		}

		const searchParams = new URLSearchParams(search());

		for (const [ key, value ] of props.query) {
			searchParams.set(key, value);
		}

		return searchParams;
	};

	return (
		<Link query={query()} {...rest}>
			{props.children}
		</Link>
	);
}
