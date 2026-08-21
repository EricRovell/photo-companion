import { render } from "@solidjs/testing-library";
import { describe, expect, test, vi } from "vitest";

import type { LunarEclipseState } from "moon-sun-calc";

import { LunarEclipseGraph } from "./lunar-eclipse-graph";

vi.mock("~/features/translation", () => ({
	useTranslation: () => ({
		t: () => ({
			LUNAR_ECLIPSE: {
				GRAPH_DESCRIPTION: "Description",
				GRAPH_TITLE: "Title",
				HORIZON: "Horizon"
			}
		})
	})
}));

const STATE: LunarEclipseState = {
	moon: {
		altitude: 30,
		angularRadius: 0.25,
		apparentAltitude: 30,
		azimuth: 180,
		offset: { altitude: 0.1, azimuth: -0.2 }
	},
	penumbralMagnitude: 1,
	phase: "PARTIAL",
	separation: 0.8,
	shadow: {
		altitude: 30,
		apparentAltitude: 30,
		azimuth: 180,
		penumbraAngularRadius: 1.3,
		umbraAngularRadius: 0.75
	},
	umbralCoverage: 0.25,
	umbralMagnitude: 0.25
};

describe("LunarEclipseGraph", () => {
	test("uses unique gradient and Moon clip identifiers for every graph", () => {
		const view = render(() => (
			<>
				<LunarEclipseGraph event={null} latitude={0} longitude={0} state={STATE} />
				<LunarEclipseGraph event={null} latitude={0} longitude={0} state={STATE} />
			</>
		));
		const gradientIds = [ ...view.container.querySelectorAll("radialGradient") ]
			.map(element => element.id);
		const clipIds = [ ...view.container.querySelectorAll("clipPath") ]
			.map(element => element.id);

		expect(gradientIds).toHaveLength(2);
		expect(new Set(gradientIds).size).toBe(2);
		expect(clipIds).toHaveLength(2);
		expect(new Set(clipIds).size).toBe(2);
		expect(view.container.querySelectorAll("[clip-path]")).toHaveLength(2);
	});
});
