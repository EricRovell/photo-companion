<script lang="ts">
	import { getTimeline } from "../../services/timeline";
	import { incrementDateByDay } from "../../helpers";
	import { data } from "./timeline.data";
	import styles from "./timeline.module.css";

	let daysAhead = 1;

	interface Timeline {
		date: Date;
		items: ReturnType<typeof getTimeline>;
	}

	const timeline: Timeline[] = [];

	for (let i = 0; i < 3; i++) {
		const date = i > 0
			? incrementDateByDay(new Date(), daysAhead)
			: new Date();

		timeline.push({
			date: new Date(),
			items: getTimeline(date)
		});
	}
</script>

<div class="{styles.wrapper}">
	{#each timeline as { date, items }}
		<article class="{styles["timeline"]}">
			<time datetime="">
				{new Intl.DateTimeFormat("ru-RU", {
					year: "numeric",
					month: "long",
					day: "numeric"
				}).format(new Date(date))}
			</time>
			<ol class="{styles["timeline-entries"]}">
				{#each items as { name, timestamp }}
					<li class="{styles["timeline-entry"]}">
						<time>
							{new Intl.DateTimeFormat("ru-RU", {
								hour12: false,
								hour: "2-digit",
								minute: "2-digit"
							}).format(new Date(timestamp))}
						</time>
						<div class="{styles.icon}">
							<svg viewBox="0 0 256 256" fill="{data[name].fill}">
								<path d="{data[name].icon}" />
							</svg>
						</div>
						<p>{data[name].label}</p>
					</li>
				{:else}
					<li class="{styles["timeline-entry"]} {styles.empty}">
						<article>
							<div class="{styles.icon}">
								<svg viewBox="0 0 256 256" fill="currentcolor">
									<rect width="256" height="256" fill="none"/>
									<circle cx="128" cy="128" r="12"/>
									<circle cx="196" cy="128" r="12"/>
									<circle cx="60" cy="128" r="12"/>
								</svg>
							</div>
						</article>
					</li>
				{/each}
			</ol>
		</article>
	{/each}
</div>

