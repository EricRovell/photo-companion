import { For, Show } from "solid-js";

import { CardInfo } from "~/entities/card-info";
import { useBridges } from "~/features/bridges-spb";
import { useTranslation } from "~/features/translation";

import { BridgesStateAll } from "./bridge-state-all";

import styles from "./bridges-info.module.css";

/**
 * Renders lifted up/down bridge list.
 */
export function BridgeStateList() {
	const { t } = useTranslation();
	const { getBridgesState, isSomeBridgeLiftedUp } = useBridges();

	return (
		<Show fallback={<BridgesStateAll />} when={isSomeBridgeLiftedUp()}>
			<CardInfo.Entry class={styles["entry-list"]} property={t().LABEL.BRIDGES_LIFTED_UP}>
				<ul class={styles.list}>
					<For each={getBridgesState()}>
						{item => (
							<Show when={item.open}>
								<li>{t().BRIDGE_NAME_SPB[item.name]}</li>
							</Show>
						)}
					</For>
				</ul>
			</CardInfo.Entry>
			<CardInfo.Entry class={styles["entry-list"]} property={t().LABEL.BRIDGES_LIFTED_DOWN}>
				<ul class={styles.list}>
					<For each={getBridgesState()}>
						{item => (
							<Show when={!item.open}>
								<li>{t().BRIDGE_NAME_SPB[item.name]}</li>
							</Show>
						)}
					</For>
				</ul>
			</CardInfo.Entry>
		</Show>
	);
}
