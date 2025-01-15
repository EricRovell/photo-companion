import { useSettings } from "@lib/context/settings";

export function useLocation() {
	const { settings } = useSettings();
	const getLatitude = () => settings.latitude;
	const getLongitude = () => settings.longitude;

	return {
		getLatitude,
		getLongitude
	};
}
