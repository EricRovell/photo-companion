<script lang="ts">
	import {
		PageWarning,
		PageToday,
		PageInfoByDate,
		PageAbout
	} from "./lib/pages";
</script>

<main>
	<header>
		<h1>
			<span>Наружное освещение</span>
			<span>Санкт-Петербурга</span>
		</h1>
	</header>
	<PageWarning />
	<PageToday />
	<PageInfoByDate />
	<PageAbout />
</main>

<style>
	main {
		display: grid;
		grid-auto-rows: min-content;
		justify-items: center;
		gap: var(--space-5);
		width: min(100%, 60ch);
	}

	header {
		display: flex;
		padding: 0.25em 0.5em;
		padding-top: 1em;
	}

	main > :global(section) {
		width: 100%;
		border: 1.5px solid darkcyan;
		border-radius: 7.5px;
		overflow: hidden;
		padding-bottom: 1rem;
		height: min-content;
	}

	main > :global(section > *) {
		padding-inline: 1rem;
	}
</style>
