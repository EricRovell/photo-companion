import { MoonProvider } from "~/features/moon";
import { useTranslation } from "~/features/translation";
import { MoonData } from "~/pages/moon/components/moon-data";

export function NowMoon() {
	const { t } = useTranslation();

	return (
		<MoonProvider>
			<MoonData title={t().TITLE.MOON} />
		</MoonProvider>
	);
}
