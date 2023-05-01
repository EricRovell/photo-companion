<script lang="ts">
	import { YEAR } from "../../constants";

	const currentYear = new Date().getFullYear();
</script>

{#if currentYear !== YEAR}
	<section id="warning">
		<h2>
			Предупреждение
		</h2>
		К сожалению, данные веб-приложения устарели.
	</section>
{/if}
