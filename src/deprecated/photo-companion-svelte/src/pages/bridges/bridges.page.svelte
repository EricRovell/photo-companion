<script lang="ts">
	import { Button, Icon } from "ui";
	import { iconChevronDown } from "ui/icons";
	import {SUPPORTED_BRIDGES_NAME_SET, isBridgeException } from "bridge-schedule";
	import { CardBridge } from "@lib/components";
	import NextBridgeEvent from "./next-bridge-event.svelte";
	import NavigationEvent from "./navigation-event.svelte";
	import { t } from "@stores/lang";
	import styles from "./bridges.module.css";
</script>

<div class="{styles.page}">
	<div>
		<h2 id="bridge-schedule">
			{$t.TITLE.BRIDGES_SCHEDULE_SPB}
		</h2>
		<ul>
			{#each SUPPORTED_BRIDGES_NAME_SET as name}
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
