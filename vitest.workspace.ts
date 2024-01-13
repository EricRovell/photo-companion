import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
	"src/apps/*",
	"src/packages/*",
	"src/shared/*"
]);
