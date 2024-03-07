<script lang="ts">
	import styles from "./link.module.css";

	export let block = false;
	export let className = "";
	export let current: "page" | undefined = undefined;
	export let download: undefined | string = undefined;
	export let href: string;
	export let label: string | undefined = undefined;
	export let targetBlank = false;
	export let nofollow = false;
	export let title: string | undefined = undefined;
	export let scrollIntoView = false;

	let ref: HTMLAnchorElement | null = null;

	// if no `href` is provided -> link will be disabled
	$: external = href.indexOf("://") !== -1;
	$: target = (targetBlank || external) ? "_blank" : undefined;
	$: rel = `${external ? "noopener noreferrer" : ""}` + `${nofollow ? "nofollow" : ""}`;

	$: if (current === "page" && scrollIntoView) {
		ref?.scrollIntoView();
	}
</script>

<a
	bind:this="{ref}"
	class="{styles.link} {className}"
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
