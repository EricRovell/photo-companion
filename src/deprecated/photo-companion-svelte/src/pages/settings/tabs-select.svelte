<script lang="ts">
	import { Button, Icon, InputCheckbox } from "ui"; 
	import { iconArrowDown, iconArrowUp } from "ui/icons";

	import { t } from "@stores/lang";
	import { NAVIGATION_TABS } from "@lib/stores/navigation";
	import type { NavigationTabName } from "@lib/types";
	import styles from "./tabs-select.module.css";

	// there are only selected (active) tabs
	export let value: NavigationTabName[] = [];

	let inactiveTabs: NavigationTabName[] = NAVIGATION_TABS.filter(item => !value.includes(item));

	const handleMove = (event: Event) => {
		const target = event.target as HTMLButtonElement;
		const parent = target.parentElement as HTMLLIElement;
		const tab = parent.dataset.tab as NavigationTabName;
		const index = Number(parent.dataset.index);
		const step = Number(target.dataset.step);

		if (step > 0 && index <= 0) {
			return;
		}

		if (step < 0 && index >= value.length - 1) {
			return;
		}

		const temp = value[index - step];
		value[index - step] = tab;
		value[index] = temp;

		// toggle reactivity
		value = value;
	};

	const handleSelect = (event: Event) => {
		const target = event.target as HTMLInputElement;
		const parent = target.parentElement?.parentElement as HTMLLIElement;
		const tab = parent.dataset.tab as NavigationTabName;

		if (!target.checked) {
			value = [ ...value.filter(i => i !== tab) ];
			inactiveTabs = [ ...inactiveTabs, tab ];
		} else {
			value = [ ...value, tab ];
			inactiveTabs = [ ...inactiveTabs.filter(i => i !== tab) ];
		}
	};

	$: inactiveTabs = NAVIGATION_TABS.filter(item => !value.includes(item));
</script>

<article class="{styles["tabs-select"]}">
	<ol class="{styles.entries}">
		{#each [ ...value, ...inactiveTabs ] as tab, index (tab)}
			{@const checked = value.includes(tab)}
			<li class="{styles.entry}"
				data-tab="{tab}"
				data-index="{index}"
			>
				<InputCheckbox
					{checked}
					disabled="{(checked && value.length <= 2) || (!checked && value.length >= 5)}"
					on:change="{handleSelect}"
					label="{$t.TITLE[tab]}"
				/>
				<Button
					appearance="ghost"
					data-step="{-1}"
					disabled="{index >= value.length - 1}"
					on:click="{handleMove}"
				>
					<Icon path="{iconArrowDown}" />
				</Button>
				<Button
					appearance="ghost"
					data-step="{1}"
					disabled="{index === 0 || index > value.length - 1}"
					on:click="{handleMove}"
				>
					<Icon path="{iconArrowUp}" />
				</Button>
			</li>
		{/each}
	</ol>
</article>
