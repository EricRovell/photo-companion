import { BridgesInfo } from "@lib/components";
import { useTranslation } from "@lib/context";

export function NowBridges() {
	const { t } = useTranslation();

	return (
		<BridgesInfo title={t().TITLE.BRIDGES_FULL} />
	);
}
