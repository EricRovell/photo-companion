<script lang="ts">
	import { Icon } from "ui";
	import { iconAnchor } from "ui/icons";
	import { getNavigationState } from "bridge-schedule";
	import { dict, template } from "@lib/dict";
	import styles from "./bridges.module.css";

	const { navigation, days } = getNavigationState(new Date());
</script>

<article
	class="card {styles["navigation-info"]}"
	data-closed="{navigation ? undefined : ""}"
>
	<header>
		{navigation
			? dict.TITLE.NAVIGATION_OPENED
			: dict.TITLE.NAVIGATION_CLOSED
		}
	</header>
	<p>{dict.MESSAGE.NAVIGATION_IN}</p>
	<p><output>{days}</output> {template["days"](days)}</p>
	<Icon path="{iconAnchor}" />
</article>
