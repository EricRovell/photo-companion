import { EclipseNavigation } from "~/entities/eclipse";
import { useTranslation } from "~/features/translation";

import { useLunarEclipse } from "../../model";
import { LunarEclipseDetails } from "../lunar-eclipse-details/lunar-eclipse-details";
import { LunarEclipseGraph } from "../lunar-eclipse-graph/lunar-eclipse-graph";

import styles from "./lunar-eclipse.module.css";

export function LunarEclipse() {
	const { t } = useTranslation();
	const eclipse = useLunarEclipse();

	return (
		<section class={`card ${styles.card}`} data-label="lunar-eclipse">
			<header>
				<h2>{t().LUNAR_ECLIPSE.TITLE}</h2>
			</header>

			<div class={styles.body}>
				<div class={styles["graph-container"]}>
					<LunarEclipseGraph
						event={eclipse.event()}
						latitude={eclipse.latitude()}
						longitude={eclipse.longitude()}
						state={eclipse.state()}
					/>
					<EclipseNavigation
						ariaLabel={t().LUNAR_ECLIPSE.TITLE}
						nextLabel={t().LUNAR_ECLIPSE.NEXT}
						onNext={() => eclipse.navigate("next")}
						onPrevious={() => eclipse.navigate("previous")}
						previousLabel={t().LUNAR_ECLIPSE.PREVIOUS}
					/>
				</div>
				<LunarEclipseDetails event={eclipse.event()} state={eclipse.state()} />
			</div>
		</section>
	);
}
