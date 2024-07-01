import type { Accessor } from "solid-js";

export type MaybeAccessor<T> = Accessor<T> | T;
