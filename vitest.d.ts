//import type { Assertion, AsymmetricMatchersContaining } from "vitest";

interface CustomMatchers<R = unknown> {
	toHaveDifference: (expected: number, precision: number) => R
}

declare module "vitest" {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	type Assertion<T = any> = CustomMatchers<T>
	type AsymmetricMatchersContaining = CustomMatchers
}
