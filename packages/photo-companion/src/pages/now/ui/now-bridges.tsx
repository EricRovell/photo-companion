import { BridgesInfo, BridgesProvider } from "~/features/bridges-spb";
import { useTranslation } from "~/features/translation";

function NowBridges() {
	const { t } = useTranslation();

	return (
		<BridgesProvider>
			<BridgesInfo title={t().TITLE.BRIDGES_FULL} />
		</BridgesProvider>
	);
}

export default NowBridges;
