export type EarthshineRating = "EXCELLENT" | "FAIR" | "GOOD" | "LOW";

export interface EarthshineOpportunity {
	dateEnd: Date;
	dateStart: Date;
	peak: {
		altitude: number;
		azimuth: number;
		illumination: number;
		score: number;
		time: Date;
	};
	rating: EarthshineRating;
	waxing: boolean;
}

export type EarthshineSample = { waxing: boolean } & EarthshineOpportunity["peak"];
