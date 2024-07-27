import { type Accessor } from "solid-js";

export function isAccessor<T>(val?: unknown): val is Accessor<T> {
	return typeof val === "function";
}
