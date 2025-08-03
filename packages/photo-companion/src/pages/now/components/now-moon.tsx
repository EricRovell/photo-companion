import { useTranslation } from "~/features/translation";
import { MoonData } from "~/pages/moon/components/moon-data";
import { MoonProvider } from "~/services/moon";

export function NowMoon() {
	const { t } = useTranslation();

	return (
		<MoonProvider>
			<MoonData title={t().TITLE.MOON} />
		</MoonProvider>
	);
}
