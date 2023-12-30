<script lang="ts">
	import {
		BRIDGE_NAME_SET,
		isBridgeException,
	} from "@services/bridges";
	import { CardBridge, Icon, Button } from "@lib/components";
	import NextBridgeEvent from "./next-bridge-event.svelte";
	import NavigationEvent from "./navigation-event.svelte";
	import { iconChevronDown } from "@lib/icons";
	import { dict } from "@lib/dict";
	import styles from "./bridges.module.css";
</script>

<div class="{styles.page}">
	<div>
		<h2 id="bridge-schedule">
			{dict["bridge-schedule-spb"]}
		</h2>
		<ul>
			{#each BRIDGE_NAME_SET as name}
				<li>
					<CardBridge
						{name}
						exception="{isBridgeException(name)}"
					/>
				</li>
			{/each}
		</ul>
	</div>
	<aside>
		<NextBridgeEvent />
		<NavigationEvent />
			<Button
				appearance="ghost"
				on:click="{() => {
					document.querySelector("#bridge-schedule")
						?.scrollIntoView({
							behavior: "smooth"
						});
				}}"
			>
				<Icon path="{iconChevronDown}" />
			</Button>
	</aside>
</div>
