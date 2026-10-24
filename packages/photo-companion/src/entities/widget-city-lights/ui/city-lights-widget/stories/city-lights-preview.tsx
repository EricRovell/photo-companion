import { For } from "solid-js";

import { LinkQuery } from "~/features/navigation";
import { ROUTES } from "~/shared/consts";
import { createQueryDate } from "~/shared/lib/query-date";
import { withStoryProviders } from "~/stories/story-providers";

import { CityLightsWidget } from "../city-lights-widget";
import { createScenario, edgeScenarios } from "./fixtures";

import type { CityLightsWidgetProps } from "../../../types";
import type { StoryArgs } from "./fixtures";

import styles from "./city-lights-preview.module.css";

function CityLightsPreview(props: CityLightsWidgetProps) {
	return (
		<CityLightsWidget
			{...props}
			renderTime={(date, children, label) => (
				<LinkQuery
					aria-label={label}
					href={ROUTES.LIGHTS}
					noScroll
					query={new URLSearchParams({ datetime: createQueryDate(date) })}
				>
					{children}
				</LinkQuery>
			)}
		/>
	);
}

export function LightsPlayground(props: StoryArgs) {
	return withStoryProviders(() => (
		<div
			class={styles.preview}
			style={{ "--lights-story-width": `${props.width}px` }}
		>
			<CityLightsPreview {...createScenario(props)} />
		</div>
	));
}

export function LightsEdgeCases(props: { width: number }) {
	return withStoryProviders(() => (
		<div
			class={styles.gallery}
			style={{ "--lights-story-width": `${props.width}px` }}
		>
			<For each={edgeScenarios}>
				{scenario => (
					<section class={styles.scenario}>
						<h3 class={styles.heading}>{scenario.title}</h3>
						<CityLightsPreview {...createScenario(scenario.options)} />
						<p class={styles.description}>{scenario.description}</p>
					</section>
				)}
			</For>
		</div>
	));
}
