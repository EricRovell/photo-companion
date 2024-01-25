<script lang="ts">
	import { Icon } from "@lib/components";
	import { getNavigationState } from "bridge-schedule";
	import { iconAnchor } from "@lib/icons";
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
			? dict["navigation-opened"]
			: dict["navigation-closed"]
		}
	</header>
	<p>{dict["till-navigation"]}</p>
	<p><output>{days}</output> {template["days"](days)}</p>
	<Icon path="{iconAnchor}" />
</article>
