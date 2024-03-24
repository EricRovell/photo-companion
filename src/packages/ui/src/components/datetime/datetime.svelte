<script lang="ts">
	import styles from "./datetime.module.css";

	export let value: string;
</script>

<time class="{styles.datetime}">
	{value}
</time>
