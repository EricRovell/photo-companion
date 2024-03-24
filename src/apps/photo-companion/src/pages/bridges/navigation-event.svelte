<script lang="ts">
	import { Icon } from "ui";
	import { iconAnchor } from "ui/icons";
	import { getNavigationState } from "bridge-schedule";

	import { formatDays, t } from "@stores/lang";
	import styles from "./bridges.module.css";

	const { navigation, days } = getNavigationState(new Date());
</script>

<article
	class="card {styles["navigation-info"]}"
	data-closed="{navigation ? undefined : ""}"
>
	<header>
		{navigation
			? $t.TITLE.NAVIGATION_OPENED
			: $t.TITLE.NAVIGATION_CLOSED
		}
	</header>
	<p>{$t.MESSAGE.NAVIGATION_IN}</p>
	<p><output>{formatDays(days)}</output></p>
	<Icon path="{iconAnchor}" />
</article>
