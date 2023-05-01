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
		justify-items: center;
		gap: 1rem;
		width: min(100%, 45ch);
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
	}

	main > :global(section > *) {
		padding-inline: 1rem;
	}

	h1 {
		display: flex;
		flex-direction: column;
	}
</style>
