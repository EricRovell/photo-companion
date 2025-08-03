import { BridgesInfo } from "~/components/bridges-info/bridges-info";
import { useTranslation } from "~/features/translation";
import { BridgesProvider } from "~/services/bridges-spb";

export function NowBridges() {
	const { t } = useTranslation();

	return (
		<BridgesProvider>
			<BridgesInfo title={t().TITLE.BRIDGES_FULL} />
		</BridgesProvider>
	);
}

export default NowBridges;
