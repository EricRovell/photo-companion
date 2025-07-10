import { DEG2RAD } from "../../consts";
import { getCoefficients } from "./consts";

import type { Degree, JulianCentury } from "../../types";

export function getReducedValue (T: JulianCentury, D: Degree, M: Degree, Mprime: Degree, F: Degree, omega: Degree, sinOrCos: "cos" | "sin"): number {

	const coeffs = getCoefficients() as {
		coscoeff1: number
		coscoeff2: number
		D: number
		F: number
		M: number
		Mprime: number
		omega: number
		sincoeff1: number
		sincoeff2: number
	}[];

	const func = sinOrCos === "sin" ? Math.sin : Math.cos;

	return coeffs.reduce((sum, val) => {
		const argument = val.D * D
			+ val.M * M
			+ val.Mprime * Mprime
			+ val.F * F
			+ val.omega * omega;

		const mod1 = sinOrCos === "sin" ? val.sincoeff1 : val.coscoeff1;
		const mod2 = sinOrCos === "sin" ? val.sincoeff2 : val.coscoeff2;

		return sum + ((mod1 + (mod2 * T)) * (func(argument * DEG2RAD) * 0.0001));
	}, 0);
}
