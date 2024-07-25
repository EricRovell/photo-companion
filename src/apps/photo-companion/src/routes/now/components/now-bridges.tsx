import { BridgesInfo } from "@lib/components/bridges-info/bridges-info";
import { useTranslation } from "@lib/context/translation";

export function NowBridges() {
	const { t } = useTranslation();

	return (
		<BridgesInfo title={t().TITLE.BRIDGES_FULL} />
	);
}

export default NowBridges;
