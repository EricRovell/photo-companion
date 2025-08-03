import { Navigate } from "@solidjs/router";
import { For, Show } from "solid-js";

import { BridgesInfo } from "~/components/bridges-info/bridges-info";
import { ROUTES } from "~/consts/routes";
import { useTranslation } from "~/features/translation";
import { BridgesProvider, useBridges } from "~/services/bridges-spb";

import { CardBridge } from "./components";

import styles from "./bridges.module.css";

function BridgeList() {
	const { isBridgeException, SUPPORTED_BRIDGES_NAME_SET } = useBridges();

	return (
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
}

export function PageBridges() {
	const { t } = useTranslation();
	const { isSupportsBridges } = useBridges();

	return (
		<Show when={isSupportsBridges()} fallback={<Navigate href={ROUTES.NOT_FOUND} />}>
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

export default () => (
	<BridgesProvider>
		<PageBridges />
	</BridgesProvider>
);
