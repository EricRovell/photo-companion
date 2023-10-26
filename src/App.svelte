<script lang="ts">
	import {
		PageWarning,
		PageToday,
		PageInfoByDate,
		PageAbout,
		PageEphemeris
	} from "./lib/pages";
	import { author, version } from "../package.json";
	import { urlAuthorGithub, urlGithub } from "./lib/paths";
	import { ACTUAL_DATA } from "./lib/constants";
</script>

<header>
	<h1>
		<span>Наружное освещение</span>
		<span>Санкт-Петербурга</span>
	</h1>
</header>
<main>
	<PageWarning />
	<PageToday />
	<PageInfoByDate />
	<PageEphemeris />
	<PageAbout />
</main>
<footer>
	<p>Данные расписания <span class:success={ACTUAL_DATA} class:danger={!ACTUAL_DATA}>{ACTUAL_DATA ? "актуальны" : "не актуальны"}</span></p>
	<p>
		Illumination Schedule SPB, v.{version}
	</p>
	<p>
		Made by <a target="_blank" href="{urlAuthorGithub}">{author}</a>
	</p>
	<a href="{urlGithub}" target="_blank" class="github">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
			<path fill="currentColor" d="m17.99.5C8.33.5.5,8.54.5,18.45c0,7.72,4.82,14.57,11.96,17.02.87.17,1.2-.39,1.2-.86,0-.43-.02-1.84-.02-3.34-4.87,1.09-5.9-2.12-5.9-2.12-.8-2.07-1.94-2.62-1.94-2.62-1.59-1.11.12-1.09.12-1.09,1.75.13,2.69,1.85,2.69,1.85,1.56,2.74,4.09,1.95,5.09,1.49.16-1.16.61-1.95,1.11-2.39-3.89-.45-7.97-1.99-7.97-8.86-.02-1.78.62-3.51,1.8-4.82-.18-.45-.78-2.28.17-4.75,0,0,1.47-.48,4.81,1.84,2.87-.8,5.89-.8,8.76,0,3.35-2.33,4.81-1.85,4.81-1.85.95,2.47.35,4.3.17,4.75,1.18,1.31,1.83,3.03,1.8,4.82,0,6.89-4.09,8.41-7.99,8.85.63.56,1.19,1.65,1.19,3.32,0,2.39-.02,4.33-.02,4.92,0,.48.32,1.04,1.2.86,9.17-3.14,14.12-13.3,11.06-22.7C32.21,5.44,25.52.5,17.99.5h0Z"/>
		</svg>
		<span>
			Github
		</span>
	</a>
</footer>
