import { getBridgesState } from "bridge-schedule";
import { createMemo, For, Show } from "solid-js";
import { objectEntries } from "utils";

import { CardEntry } from "~/components";
import { useDatetime } from "~/hooks";
import { useTranslation } from "~/services/translation";

import { BridgesStateAll } from "./bridge-state-all";

import styles from "./bridges-info.module.css";

interface BridgeListProps {
	bridges: string[];
}

const BridgeNameList = (props: BridgeListProps) => (
	<ul class={styles.list}>
		<For each={props.bridges}>
			{bridgeName => <li>{bridgeName}</li>}
		</For>
	</ul>
);

/**
 * Renders lifted up/down bridge list.
 */
export function BridgeStateList() {
	const { t } = useTranslation();
	const { getTimestamp } = useDatetime();

	const bridgesState = () => getBridgesState(getTimestamp());

	const bridgeList = createMemo(() => {
		const liftedDown: string[]= [];
		const liftedUp: string[] = [];

		for (const [ name, state ] of objectEntries(bridgesState())) {
			const label = t().BRIDGE_NAME_SPB[name];

			if (state) {
				liftedUp.push(label);
			} else {
				liftedDown.push(label);
			}
		}

		return {
			down: liftedDown,
			up: liftedUp
		};
	});

	const isSomeLiftedUp = () => bridgeList().down.length !== 0;

	return (
		<Show fallback={<BridgesStateAll />} when={isSomeLiftedUp()}>
			<CardEntry class={styles["entry-list"]} property={t().LABEL.BRIDGES_LIFTED_UP}>
				<BridgeNameList bridges={bridgeList().up} />
			</CardEntry>
			<CardEntry class={styles["entry-list"]} property={t().LABEL.BRIDGES_LIFTED_DOWN}>
				<BridgeNameList bridges={bridgeList().down} />
			</CardEntry>
		</Show>
	);
}
