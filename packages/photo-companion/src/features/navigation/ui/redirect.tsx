import { useNavigate } from "@solidjs/router";
import { createEffect, onFlush } from "solid-js";

export function Redirect(props: { href: string }) {
	const navigate = useNavigate();

	createEffect(() => props.href, (href) => {
		let active = true;

		// Settings updates in this flush may make the current route valid.
		onFlush(() => {
			if (active) {
				navigate(href, { replace: true });
			}
		});

		return () => {
			active = false;
		};
	});

	return null;
}
