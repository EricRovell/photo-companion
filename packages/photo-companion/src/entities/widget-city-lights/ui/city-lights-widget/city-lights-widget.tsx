import { isSupportedCity } from "lights-schedule";
import { createSignal, createUniqueId, mergeProps, Show, untrack } from "solid-js";

import type { LightsScheduleSource } from "types";

import { Card } from "~/shared/ui";

import { CITY_LIGHTS_WIDGET_CONFIG } from "../../config";
import { createCityLightsWidgetModel } from "../../model";
import { CityLightsGraph } from "../city-lights-graph/city-lights-graph";
import { CityLightsHeader } from "../city-lights-header/city-lights-header";
import { CityLightsHero } from "../city-lights-hero/city-lights-hero";
import { CityLightsLegend } from "../city-lights-legend/city-lights-legend";
import { CityLightsSource } from "../city-lights-source/city-lights-source";
import { CityLightsSummary } from "../city-lights-summary/city-lights-summary";

import type { CityLightsWidgetProps } from "../../types";

import styles from "./city-lights-widget.module.css";

export function CityLightsWidget(props: CityLightsWidgetProps) {
	const [ source, setSource ] = createSignal<LightsScheduleSource>(untrack(() => props.schedule.source));
	const officialAvailable = () => isSupportedCity(props.city);
	const selectedSource = () => officialAvailable() ? source() : "SOLAR_ESTIMATE";
	const officialModel = createCityLightsWidgetModel(props);
	const solarModel = createCityLightsWidgetModel(mergeProps(props, {
		get getScheduleForDate() { return props.solar.getScheduleForDate; },
		get schedule() { return props.solar.schedule; },
		get state() { return props.solar.state; }
	}));
	const model = () => selectedSource() === "SCHEDULE" ? officialModel : solarModel;
	const descriptionId = createUniqueId();
	const sourceId = createUniqueId();
	const selectionId = createUniqueId();

	return (
		<Card data-label="lights-schedule">
			<CityLightsHeader
				city={model().cityName()}
				title={model().title()}
			/>
			<div
				class={styles.content}
				style={{
					"--lights-color": CITY_LIGHTS_WIDGET_CONFIG.color,
					"--lights-max-width": CITY_LIGHTS_WIDGET_CONFIG.layout.maxWidth
				}}
			>
				<div class={styles.visual}>
					<CityLightsHero
						lights={model().lightsOn()}
						state={model().stateLabel()}
						status={model().status()}
						switchingWindowLabel={model().switchingWindowLabel()}
						withinWindow={model().withinWindow()}
					/>
					<Show when={model().night()}>
						{night => <>
							<CityLightsGraph
								date={props.date}
								describedBy={`${descriptionId} ${selectionId} ${sourceId}`}
								lights={model().lightsOn()}
								night={night()}
								source={model().source()}
							/>
							<CityLightsLegend
								events={model().events()}
								id={descriptionId}
								renderTime={props.renderTime}
								reservedEvents={solarModel.events()}
							/>
							<CityLightsSummary
								countdown={model().countdown()}
								countdownLabel={model().countdownLabel()}
								duration={model().duration()}
								durationLabel={model().durationLabel()}
								estimated={model().estimated()}
								getTimerTimestamp={props.getTimerTimestamp}
							/>
							<p class={styles.description} id={selectionId}>
								{model().selectedTime()}
							</p>
						</>}
					</Show>
					<CityLightsSource
						id={sourceId}
						officialAvailable={officialAvailable()}
						onChange={setSource}
						reservedUncertainty={solarModel.uncertaintyLabel()}
						selected={selectedSource()}
						uncertainty={model().uncertaintyLabel()}
					/>
				</div>
			</div>
		</Card>
	);
}
