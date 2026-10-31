import { useTranslation } from "~/features/translation";
import { Card, Text } from "~/shared/ui";

import { createSunlightModel } from "../../model";
import { SunlightDial } from "../sunlight-dial/sunlight-dial";
import { SunlightLegend } from "../sunlight-legend/sunlight-legend";

import type { SunlightWidgetProps } from "../../types";

import styles from "./sunlight-widget.module.css";

export function SunlightWidget(props: SunlightWidgetProps) {
	const { format, t } = useTranslation();

	const model = createSunlightModel(props);

	return (
		<Card class={styles.widget} data-label="sunlight">
			<Card.Header>
				<Text as="h2" variant="heading-l">{t().SUNLIGHT.TITLE}</Text>
			</Card.Header>
			<div class={styles.content}>
				<div class={styles.visual}>
					<div class={styles.diagram}>
						<SunlightDial
							ariaLabel={format().message(t().SUNLIGHT.ARIA_DIAL, {
								phase: model.phaseLabel(model.current().phase),
								time: format().timeShort(props.date)
							})}
							day={model.day()}
							formatTime={model.formatTime}
							markerLabel={model.markerLabel}
							phase={model.current().phase}
							phaseLabel={model.phaseLabel}
							progress={model.progress(props.date.getTime())}
							ticks={model.ticks()}
						/>
						<div class={styles.center} data-phase={model.current().phase}>
							<Text
								as="p"
								balance
								class={styles.phase}
								variant="heading-l"
							>
								{model.phaseLabel(model.current().phase)}
							</Text>
							<Text as="p" balance color="secondary" variant="text-s">
								{model.nextPhase()}
							</Text>
						</div>
					</div>
					<SunlightLegend
						currentPhase={model.current().phase}
						day={model.day()}
						formatTime={model.formatTime}
						phaseLabel={model.phaseLabel}
					/>
				</div>
			</div>
		</Card>
	);
}
