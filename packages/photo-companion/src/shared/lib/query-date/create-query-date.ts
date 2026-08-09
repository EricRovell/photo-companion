export function createQueryDate(d: DateLike = new Date()): string {
	if (typeof d === "number") {
		d = new Date(d);
	}

	const year = d.getFullYear().toString().padStart(4, "0");
	const [ month, day, hours, minutes, seconds ] = [
		d.getMonth() + 1,
		d.getDate(),
		d.getHours(),
		d.getMinutes(),
		d.getSeconds()
	].map(value => value.toString().padStart(2, "0"));

	return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}
