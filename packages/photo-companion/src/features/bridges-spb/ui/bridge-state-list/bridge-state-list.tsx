import { For, Show } from "solid-js";

import { useTranslation } from "~/features/translation";
import { PropertyList } from "~/shared/ui";

import { useBridges } from "../../model";
import { BridgesStateAll } from "../bridge-state-all";

import styles from "./bridge-state-list.module.css";

/**
 * Renders lifted up/down bridge list.
 */
export function BridgeStateList() {
	const { t } = useTranslation();
	const { getBridgesState, isSomeBridgeLiftedUp } = useBridges();

	return (
		<Show fallback={<BridgesStateAll />} when={isSomeBridgeLiftedUp()}>
			<PropertyList.Item class={styles["entry-list"]}>
				<PropertyList.Label>
					{t().LABEL.BRIDGES_LIFTED_UP}
				</PropertyList.Label>
				<PropertyList.Value>
					<ul class={styles.list}>
						<For each={getBridgesState()}>
							{item => (
								<Show when={item.open}>
									<li>{t().BRIDGE_NAME_SPB[item.name]}</li>
								</Show>
							)}
						</For>
					</ul>
				</PropertyList.Value>
			</PropertyList.Item>
			<PropertyList.Item class={styles["entry-list"]}>
				<PropertyList.Label>
					{t().LABEL.BRIDGES_LIFTED_DOWN}
				</PropertyList.Label>
				<PropertyList.Value>
					<ul class={styles.list}>
						<For each={getBridgesState()}>
							{item => (
								<Show when={!item.open}>
									<li>{t().BRIDGE_NAME_SPB[item.name]}</li>
								</Show>
							)}
						</For>
					</ul>
				</PropertyList.Value>
			</PropertyList.Item>
		</Show>
	);
}
