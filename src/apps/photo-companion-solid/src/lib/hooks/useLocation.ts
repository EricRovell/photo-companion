import { settings } from "@lib/stores/settings";

export function useLocation() {
	const latitude = () => settings().latitude;
	const longitude = () => settings().longitude;

	return {
		latitude,
		longitude
	};
}
