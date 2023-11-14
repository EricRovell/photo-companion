<script lang="ts">
	import { dict } from "@lib/dict";
	import styles from "./event.module.css";
</script>

<li class="{styles.event} {styles.empty}">
	<div class="{styles.icon}">
		<svg viewBox="0 0 256 256" fill="currentcolor">
			<rect width="256" height="256" fill="none"/>
			<circle cx="128" cy="128" r="12"/>
			<circle cx="196" cy="128" r="12"/>
			<circle cx="60" cy="128" r="12"/>
		</svg>
	</div>
	<article>
		<p>{dict["no-events"]}</p>
	</article>
</li>
