import { BridgesInfo } from "~/components/bridges-info/bridges-info";
import { useTranslation } from "~/services/translation";

export function NowBridges() {
	const { t } = useTranslation();

	return (
		<BridgesInfo title={t().TITLE.BRIDGES_FULL} />
	);
}

export default NowBridges;
