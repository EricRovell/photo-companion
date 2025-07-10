import { DEG2RAD } from "../../constants";
import { NUTATION_COEFFICIENTS } from "./coefficients";

import type { Degree, JulianCentury } from "../../types";

export function getReducedValue (T: JulianCentury, D: Degree, M: Degree, Mprime: Degree, F: Degree, omega: Degree, sinOrCos: "cos" | "sin"): number {
	const func = sinOrCos === "sin" ? Math.sin : Math.cos;

	return NUTATION_COEFFICIENTS.reduce((sum, coef) => {
		const argument = coef[0] * D + coef[1] * M + coef[2] * Mprime + coef[3] * F + coef[4] * omega;
		const mod1 = sinOrCos === "sin" ? coef[5] : coef[7];
		const mod2 = sinOrCos === "sin" ? coef[6] : coef[8];

		return sum + ((mod1 + (mod2 * T)) * (func(argument * DEG2RAD) * 0.0001));
	}, 0);
}
