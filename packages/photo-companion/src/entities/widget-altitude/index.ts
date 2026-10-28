import { Chart } from "./ui/altitude-chart/altitude-chart";
import { Content } from "./ui/altitude-content/altitude-content";
import { Cursor } from "./ui/altitude-cursor/altitude-cursor";
import { Grid } from "./ui/altitude-grid/altitude-grid";
import { Header } from "./ui/altitude-header";
import { Legend } from "./ui/altitude-legend/altitude-legend";
import { Path } from "./ui/altitude-path/altitude-path";
import { Root } from "./ui/altitude-widget/altitude-widget";

export const AltitudeWidget = Object.assign(Root, {
	Chart,
	Content,
	Cursor,
	Grid,
	Header,
	Legend,
	Path
});
