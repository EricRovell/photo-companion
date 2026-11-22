import { cleanup } from "@solidjs/testing-library";
import { createEffect, createSignal } from "solid-js";
import { afterEach, expect, it } from "vitest";

import type { ParentProps } from "solid-js";

import { renderHook } from "./render-hook";

afterEach(cleanup);

function Wrapper(props: ParentProps) {
	const [ value, setValue ] = createSignal(0);

	createEffect(() => true, () => {
		setValue(1);
	});

	return (
		<>
			{props.children}
			<span>{value()}</span>
		</>
	);
}

it("flushes wrapper effects outside component execution", () => {
	renderHook(() => true, { wrapper: Wrapper });

	expect(document.body).toHaveTextContent("1");
});
