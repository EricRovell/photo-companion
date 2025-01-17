import { Navigate } from "@solidjs/router";
import { isBridgeException, SUPPORTED_BRIDGES_NAME_SET } from "bridge-schedule";
import { For, Show } from "solid-js";

import { BridgesInfo } from "@lib/components/bridges-info/bridges-info";
import { ROUTE_404 } from "@lib/consts/routes";
import { useTranslation } from "@lib/context/translation";
import { useSupportsBridges } from "@lib/hooks";

import { CardBridge } from "./components";

import styles from "./bridges.module.css";

const BridgeList = () => (
	<ul class={styles["bridge-list"]}>
		<For each={Array.from(SUPPORTED_BRIDGES_NAME_SET)}>
			{name => (
				<li>
					<CardBridge
						exception={isBridgeException(name)}
						name={name}
					/>
				</li>
			)}
		</For>
	</ul>
);

export function PageBridges() {
	const { t } = useTranslation();
	const supports = useSupportsBridges();

	return (
		<Show when={supports()} fallback={<Navigate href={ROUTE_404} />}>
			<div class={styles.page}>
				<div class={styles.wrapper}>
					<h2 class={styles.title} id="bridge-schedule">
						{t().TITLE.BRIDGES_SCHEDULE_SPB}
					</h2>
					<BridgeList />
				</div>
				<aside class={styles.info}>
					<BridgesInfo />
				</aside>
			</div>
		</Show>
	);
}

export default PageBridges;
