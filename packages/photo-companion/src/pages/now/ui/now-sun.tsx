import { SunProvider } from "~/features/sun";
import { useTranslation } from "~/features/translation";
import { SunData } from "~/pages/sun/ui/sun-data";

export function NowSun() {
	const { t } = useTranslation();

	return (
		<SunProvider>
			<SunData title={t().TITLE.SUN} />
		</SunProvider>
	);
}
