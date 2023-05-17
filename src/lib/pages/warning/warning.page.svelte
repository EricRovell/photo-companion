<script lang="ts">
	import { ACTUAL_DATA } from "../../constants";
	import styles from "./warning.module.css";
</script>

{#if !ACTUAL_DATA}
	<section id="warning" class="card {styles.page}">
		<header>
			<h2>
				Предупреждение
			</h2>
		</header>
		<p>К сожалению, данные веб-приложения устарели.</p>
		<p>Часто, расписание не сильно отличается от прошлогоднего, можно продолжать пользоваться, однако возможны расхождения.</p>
	</section>
{/if}
