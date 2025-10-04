import { MoonInfo, MoonProvider } from "~/features/moon";
import { useTranslation } from "~/features/translation";

export function NowMoon() {
	const { t } = useTranslation();

	return (
		<MoonProvider>
			<MoonInfo title={t().TITLE.MOON} />
		</MoonProvider>
	);
}
