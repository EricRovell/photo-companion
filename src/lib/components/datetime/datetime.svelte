<script lang="ts">
	import styles from "./datetime.module.css";

	export let date = new Date();
	export let options: Intl.DateTimeFormatOptions = {};
	export let locale = "ru-RU";

	let rendered = new Intl.DateTimeFormat(locale, options).format(date);
</script>

<time
	class="{styles.datetime}"
	datetime="{rendered}"
>
	{rendered}
</time>
