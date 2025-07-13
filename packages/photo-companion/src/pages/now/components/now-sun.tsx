import { SunData } from "~/pages/sun/components/sun-data";
import { SunProvider } from "~/services/sun";
import { useTranslation } from "~/services/translation";

export function NowSun() {
	const { t } = useTranslation();

	return (
		<SunProvider>
			<SunData title={t().TITLE.SUN} />
		</SunProvider>
	);
}
