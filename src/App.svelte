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
