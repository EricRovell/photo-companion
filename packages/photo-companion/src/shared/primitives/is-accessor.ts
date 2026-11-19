import type { Accessor } from "solid-js";

export const isAccessor = <T>(value: Accessor<T> | T): value is Accessor<T> => typeof value === "function";
