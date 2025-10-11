import { Graph } from "./graph/graph";
import { Path } from "./path/path";
import { Pointer } from "./pointer/pointer";
import { XAxis } from "./x-axis/x-axis";
import { ZeroAxis } from "./zero-axis/zero-axis";

export const ElevationGraph = Object.assign(Graph, {
	Path: Path,
	Pointer,
	XAxis: XAxis,
	ZeroAxis: ZeroAxis
});
