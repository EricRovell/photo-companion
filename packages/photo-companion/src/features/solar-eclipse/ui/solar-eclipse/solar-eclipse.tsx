import { useTranslation } from "~/features/translation";

import { useSolarEclipse } from "../../model";
import { SolarEclipseDetails } from "../solar-eclipse-details/solar-eclipse-details";
import { SolarEclipseGraph } from "../solar-eclipse-graph/solar-eclipse-graph";
import { SolarEclipseNavigation } from "../solar-eclipse-navigation";

import styles from "./solar-eclipse.module.css";

export function SolarEclipse() {
	const { t } = useTranslation();
	const eclipse = useSolarEclipse();

	return (
		<section class={`card ${styles.card}`} data-label="solar-eclipse">
			<header>
				<h2>{t().SOLAR_ECLIPSE.TITLE}</h2>
			</header>

			<div class={styles.body}>
				<div class={styles["graph-container"]}>
					<SolarEclipseGraph
						event={eclipse.event()}
						latitude={eclipse.latitude()}
						longitude={eclipse.longitude()}
						state={eclipse.state()}
					/>
					<SolarEclipseNavigation
						onNext={() => eclipse.navigate("next")}
						onPrevious={() => eclipse.navigate("previous")}
					/>
				</div>
				<SolarEclipseDetails
					event={eclipse.event()}
					obscuration={eclipse.state().obscuration}
				/>
			</div>
		</section>
	);
}
