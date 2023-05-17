<script lang="ts">
	import { urlScheduleSource, urlSheduleDocument } from "../../paths";
	import { currentYear } from "../../constants";
	import styles from "./about.module.css";
</script>

<section id="about" class="card {styles.root}">
	<header>
		<h2>
			Общая информация
		</h2>
	</header>
	<p>
		Веб-приложение использует данные о <a target="_blank" href="{urlScheduleSource}">графике наружного освещения в Санкт-Петербурге</a> на <a target="_blank" href="{urlSheduleDocument}">{currentYear} год</a>.
	</p>
	<p>
		Данный график составлен с учётом фактических атмосферных условий Санкт-Петербурга.
	</p>
	<p>
		Включение и отключение наружного освещения разрешается с отклонением от графика на плюс-минус 30 минут.
	</p>
</section>
