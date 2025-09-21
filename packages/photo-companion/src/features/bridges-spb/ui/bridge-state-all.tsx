import { useTranslation } from "~/features/translation";
import { PropertyList } from "~/shared/ui";

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
		<PropertyList.Item>
			<PropertyList.Label>
				{t().LABEL.STATE}
			</PropertyList.Label>
			<PropertyList.Value>
				{getLabel()}
			</PropertyList.Value>
		</PropertyList.Item>
	);
};
