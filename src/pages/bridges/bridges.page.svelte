<script lang="ts">
	import { BRIDGE_NAME_SET, isBridgeException } from "@services/bridges";
	import { CardBridge } from "@lib/components";
	import styles from "./bridges.module.css";
</script>

<div class="{styles.page}">
	{#each BRIDGE_NAME_SET as name}
		<CardBridge
			{name}
			exception="{isBridgeException(name)}"
		/>
	{/each}
</div>
