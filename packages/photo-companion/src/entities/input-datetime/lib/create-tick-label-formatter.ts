import type { DateTimeStep } from "../types";

type TickLabelFormatter = (date: Date, step: DateTimeStep) => string;

export function createTickLabelFormatter(locale: string): TickLabelFormatter {
	const monthFormatter = new Intl.DateTimeFormat(locale, { month: "short" });

	return (date, step) => {
		if (step === "minute") {
			return date.getMinutes().toString().padStart(2, "0");
		}

		if (step === "hour") {
			return date.getHours().toString().padStart(2, "0");
		}

		if (step === "day") {
			return date.getDate().toString().padStart(2, "0");
		}

		if (step === "month") {
			return monthFormatter.format(date);
		}

		return date.getFullYear().toString().padStart(4, "0");
	};
}
