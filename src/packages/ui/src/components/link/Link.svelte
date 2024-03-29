<script lang="ts">
	import { classnames } from "utils";

	import styles from "./link.module.css";

	export let block = false;
	export let className: string | undefined = undefined;
	export let current: Undefinable<"page" | "step" | "location" | "date" | "time"> = undefined;
	export let download: undefined | string = undefined;
	export let href: string;
	export let label: Undefinable<string> = undefined;
	export let targetBlank = false;
	export let nofollow = false;
	export let title: Undefinable<string> = undefined;

	let ref: Nullish<HTMLAnchorElement> = null;

	// if no `href` is provided -> link will be disabled
	$: external = href.indexOf("://") !== -1;
	$: target = (targetBlank || external) ? "_blank" : undefined;
	$: rel = `${external ? "noopener noreferrer" : ""}` + `${nofollow ? "nofollow" : ""}`;
</script>

<a
	bind:this="{ref}"
	class="{classnames(styles.link, className)}"
	class:block
	aria-current="{current}"
	aria-label="{label}"
	{download}
	{href}
	on:click
	{rel}
	{target}
	{title}
	{...$$restProps}
>
	<slot />
</a>
