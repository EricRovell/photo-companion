/**
 * Utility type to describe classes object to pass class names into
 * component parts:
 *
 * ```
 * Classes<"input" | "label"> -> { input?: string, label?: string };
 * ```
 */
export type Classes<T extends string> = Partial<Record<T, string>>;
