import { useLocation } from "@solidjs/router";
import { splitProps } from "solid-js";
import { Link, type LinkProps } from "ui-solid";

/**
 * Wrapper over the `<Link />` that sync the query params.
 */
export function LinkQuery(allProps: LinkProps) {
	const [ props, rest ] = splitProps(allProps, [ "children", "href" ]);
	const location = useLocation();

	const href = () => `${props.href}${location.search}`;

	return (
		<Link href={href()} {...rest}>
			{props.children}
		</Link>
	);
}
