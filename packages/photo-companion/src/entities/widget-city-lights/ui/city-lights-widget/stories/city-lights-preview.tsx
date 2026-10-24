import { For } from "solid-js";

import { StoryTranslations } from "~/stories/story-language";

import { CityLightsWidget } from "../city-lights-widget";
import { createScenario, edgeScenarios } from "./fixtures";

import type { StoryArgs } from "./fixtures";

import styles from "./city-lights-preview.module.css";

export function LightsPlayground(props: StoryArgs) {
	return (
		<StoryTranslations>
			<div class={styles.preview} style={{ "--lights-story-width": `${props.width}px` }}>
				<CityLightsWidget {...createScenario(props)} />
			</div>
		</StoryTranslations>
	);
}

export function LightsEdgeCases(props: { width: number }) {
	return (
		<StoryTranslations>
			<div class={styles.gallery} style={{ "--lights-story-width": `${props.width}px` }}>
				<For each={edgeScenarios}>
					{scenario => (
						<section class={styles.scenario}>
							<h3 class={styles.heading}>{scenario.title}</h3>
							<CityLightsWidget {...createScenario(scenario.options)} />
							<p class={styles.description}>{scenario.description}</p>
						</section>
					)}
				</For>
			</div>
		</StoryTranslations>
	);
}
