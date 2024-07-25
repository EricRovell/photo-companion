import { useNavigate } from "@solidjs/router";
import { isBridgeException, SUPPORTED_BRIDGES_NAME_SET } from "bridge-schedule";
import { For, onMount } from "solid-js";

import { BridgesInfo, SupportsBridges } from "@lib/components";
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
	const navigate = useNavigate();

	onMount(() => {
		if (!supports()) {
			navigate("/404", { replace: true });
		}
	});

	return (
		<SupportsBridges>
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
		</SupportsBridges>
	);
}

export default PageBridges;
