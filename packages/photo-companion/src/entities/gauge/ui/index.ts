export { GaugeTime } from "./gauge-time";

import { GaugeDivider } from "./gauge-divider/gauge-divider";
import { GaugeLabel } from "./gauge-label/gauge-label";
import { GaugeMarks, GaugeMarksWrapper } from "./gauge-marks/gauge-marks";
import { GaugePointer } from "./gauge-pointer/gauge-pointer";
import { GaugeRail } from "./gauge-rail/gauge-rail";
import { GaugeSlice } from "./gauge-slice/gauge-slice";
import { Gauge as _Gauge } from "./gauge/gauge";

export const Gauge = Object.assign(_Gauge, {
	Divider: GaugeDivider,
	Label: GaugeLabel,
	Marks: GaugeMarks,
	MarksWrapper: GaugeMarksWrapper,
	Pointer: GaugePointer,
	Rail: GaugeRail,
	Slice: GaugeSlice
});
