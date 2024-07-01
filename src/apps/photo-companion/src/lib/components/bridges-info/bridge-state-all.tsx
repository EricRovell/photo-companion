import { useTranslation } from "@lib/context";

import { CardEntry } from "../card-info";

interface Props {
	allLiftedDown?: boolean;
}

/**
 * Card entry to render information when
 * **all the drawbridges** are lifted down/up at the same moment.
 */
export function BridgesStateAll(props: Props) {
	const { t } = useTranslation();

	const getLabel = () => props.allLiftedDown
		? t().LABEL.ALL_BRIDGES_LIFTED_DOWN
		: t().LABEL.ALL_BRIDGES_LIFTED_UP;

	return (
		<CardEntry property={t().LABEL.STATE}>
			{getLabel()}
		</CardEntry>
	);
};
