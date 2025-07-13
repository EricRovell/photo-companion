import { BridgesInfo } from "~/components/bridges-info/bridges-info";
import { BridgesProvider } from "~/services/bridges-spb";
import { useTranslation } from "~/services/translation";

export function NowBridges() {
	const { t } = useTranslation();

	return (
		<BridgesProvider>
			<BridgesInfo title={t().TITLE.BRIDGES_FULL} />
		</BridgesProvider>
	);
}

export default NowBridges;
