import { MoonData } from "~/routes/moon/components/moon-data";
import { MoonProvider } from "~/services/moon";
import { useTranslation } from "~/services/translation";

export function NowMoon() {
	const { t } = useTranslation();

	return (
		<MoonProvider>
			<MoonData title={t().TITLE.MOON} />
		</MoonProvider>
	);
}
