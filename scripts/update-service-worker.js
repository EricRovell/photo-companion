import { readFileSync, writeFileSync } from "node:fs";

const SW_PATH = "public/service-worker.js";
const REPLACE_LINE = 2; // 0-index

// get line to replace
let data = readFileSync(SW_PATH, "utf-8").toString();
const lines = data.split(/\r?\n/)
const current = lines[REPLACE_LINE];

// get app version
const packageFile = readFileSync("package.json").toString();
const version = JSON.parse(packageFile).version;

const next = current.replace(/\d+\.\d+\.\d+/, version);

writeFileSync(SW_PATH, data.replace(current, next))
