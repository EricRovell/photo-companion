<script>
	import { Gauge } from "../../components";
	import { calcEphemeridesData, calcMoonIllumination } from "../../services/suncalc.service";
	import { LAT, LON } from "../../constants";
	import styles from "./ephemeris.module.css";

	const data = calcEphemeridesData(new Date(), LAT, LON);
</script>

<section id="ephemeris" class="card {styles.root}">
	<header>
		<h2>Эфемериды</h2>
	</header>
	<div>
		<Gauge
		angleStart={data.sunrise.angle}
			labelStart="{data.sunrise.time}"
			angleEnd={data.sunset.angle}
			labelEnd="{data.sunset.time}"
		>
			Sun
		</Gauge>
		<Gauge
			angleStart={data.moonrise.angle}
			labelStart="{data.moonrise.time}"
			angleEnd={data.moonset.angle}
			labelEnd="{data.moonset.time}"
		>
			Moon, {calcMoonIllumination()}%
		</Gauge>
	</div>
</section>
