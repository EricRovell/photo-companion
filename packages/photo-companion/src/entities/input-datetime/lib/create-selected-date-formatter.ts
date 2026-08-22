export function createSelectedDateFormatter(locale: string): Intl.DateTimeFormat {
	return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "medium" });
}
