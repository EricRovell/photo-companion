import { createMemo, For } from "solid-js";

import type { RiseSetInterval } from "moon-sun-calc";

import { Moon } from "~/entities/moon";
import { Sun } from "~/entities/sun";
import { LinkQuery } from "~/features/navigation";
import { createQueryDate } from "~/shared/lib/query-date";
import { selectRiseSetContext, selectRiseSetInterval } from "~/shared/lib/rise-set";
import { StoryTranslations } from "~/stories/story-language";

import { RiseSetWidget } from "../rise-set-widget";
import { at } from "./fixtures";

import type { RiseSetWidgetProps } from "../../../types";
import type { RiseSetScenario, RiseSetSelectionScenario } from "./fixtures";

export interface StoryArgs {
	aboveHorizon: boolean;
	entity: RiseSetWidgetProps["entity"];
	hour: number;
	missingEvents: "both" | "none" | "rise" | "set";
	riseHour: number;
	setHour: number;
	width: number;
}

interface GalleryProps {
	entity: RiseSetWidgetProps["entity"];
	scenarios: readonly RiseSetScenario[];
	width: number;
}

interface PreviewProps extends RiseSetWidgetProps {
	intervals?: readonly RiseSetInterval[];
	phase?: number;
}

function RiseSetPreview(props: PreviewProps) {
	const context = createMemo(() => selectRiseSetContext(props.date, props.intervals ?? [], {
		rise: props.rise ?? null,
		set: props.set ?? null
	}));

	return (
		<RiseSetWidget
			aboveHorizon={props.aboveHorizon}
			belowHorizonInterval={context().belowHorizonInterval}
			date={props.date}
			entity={props.entity}
			nextRise={context().nextRise}
			renderTime={(date, children, label) => (
				<LinkQuery
					aria-label={label}
					href={`/${props.entity}`}
					noScroll
					query={new URLSearchParams({ datetime: createQueryDate(date) })}
				>
					{children}
				</LinkQuery>
			)}
			rise={props.rise}
			set={props.set}
		>
			{props.entity === "moon"
				? (
					<Moon
						height={72}
						phase={props.phase ?? 0.35}
						rotation={-25}
						size={72}
						width={72}
					/>
				)
				: <Sun height={64} width={64} />}
		</RiseSetWidget>
	);
}

export function RiseSetPlayground(props: StoryArgs) {
	const date = (hour: number) => at(21, Math.floor(hour), (hour % 1) * 60);

	return (
		<StoryTranslations>
			<div
				style={{
					"max-width": "100%",
					"text-align": "center",
					"width": `${props.width}px`
				}}
			>
				<RiseSetPreview
					aboveHorizon={props.aboveHorizon}
					date={date(props.hour)}
					entity={props.entity}
					intervals={[ -1, 0, 1 ].map(offset => ({
						rise: props.missingEvents === "both" || props.missingEvents === "rise" ? null : date(props.riseHour + offset * 24),
						set: props.missingEvents === "both" || props.missingEvents === "set" ? null : date(props.setHour + offset * 24)
					}))}
					rise={props.missingEvents === "both" || props.missingEvents === "rise" ? null : date(props.riseHour)}
					set={props.missingEvents === "both" || props.missingEvents === "set" ? null : date(props.setHour)}
				/>
			</div>
		</StoryTranslations>
	);
}

const scenarioDateFormatter = new Intl.DateTimeFormat("en-GB", {
	day: "2-digit",
	hour: "2-digit",
	hourCycle: "h23",
	minute: "2-digit",
	month: "short"
});

export function ScenarioGallery(props: GalleryProps) {
	return (
		<StoryTranslations>
			<div
				style={{
					"display": "grid",
					"gap": "var(--space-5)",
					"grid-template-columns": `repeat(auto-fit, minmax(min(100%, ${props.width}px), 1fr))`,
					"max-width": "100%",
					"width": "calc(100vw - 2rem)"
				}}
			>
				<For each={props.scenarios}>
					{scenario => (
						<section
							style={{
								"display": "grid",
								"gap": "var(--space-3)",
								"grid-template-rows": "auto auto 1fr",
								"min-width": "0"
							}}
						>
							<div>
								<h3
									style={{
										"font-size": "var(--font-size-3)",
										"margin": "0 0 var(--space-2)"
									}}
								>
									{scenario.title}
								</h3>
								<p
									style={{
										"color": "var(--color-text-secondary)",
										"font-size": "var(--font-size-1)",
										"margin": "0"
									}}
								>
									Selected: <time dateTime={scenario.date.toISOString()}>
										{scenarioDateFormatter.format(scenario.date)}
									</time>
								</p>
							</div>
							<RiseSetPreview {...scenario} entity={props.entity} />
							<p
								style={{
									"color": "var(--color-text-secondary)",
									"font-size": "var(--font-size-1)",
									"line-height": "1.5",
									"margin": "0"
								}}
							>
								{scenario.description}
							</p>
						</section>
					)}
				</For>
			</div>
		</StoryTranslations>
	);
}

export function IntervalSelectionGallery(props: { scenarios: readonly RiseSetSelectionScenario[] } & Omit<GalleryProps, "scenarios">) {
	return (
		<ScenarioGallery
			entity={props.entity}
			scenarios={props.scenarios.map(scenario => ({
				...scenario,
				...selectRiseSetInterval(scenario.date, scenario.intervals)
			}))}
			width={props.width}
		/>
	);
}
