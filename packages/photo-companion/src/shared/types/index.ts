import type { JSX } from "@solidjs/web";

/** Maps component parts to native class values: strings, arrays, or objects. */
export type Classes<T extends string> = Partial<Record<T, JSX.HTMLAttributes<HTMLElement>["class"]>>;
