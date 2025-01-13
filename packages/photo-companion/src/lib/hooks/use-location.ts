import { useSettings } from "@lib/context/settings";

export function useLocation() {
	const { getSettings } = useSettings();
	const getLatitude = () => getSettings().latitude;
	const getLongitude = () => getSettings().longitude;

	return {
		getLatitude,
		getLongitude
	};
}
