<script lang="ts">
	import { classnames } from "utils";

	import styles from "./datetime.module.css";

	export let className: Undefinable<string> = undefined;
	export let value: string;
</script>

<time class="{classnames(styles.datetime, className)}">
	{value}
</time>
