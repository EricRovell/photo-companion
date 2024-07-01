/**
 * Script gets the d.ts file and replaces the declared `index` module with
 * the name of the package defined in `package.json`.
 */
import fs from "fs/promises";
import path from "path";

// eslint-disable-next-line no-undef
const cwd = process.cwd();
const re = /declare module "(.*?)"/g;

/**
 * @param {string} file
 */
async function readJSON(file) {
	const resolved = path.resolve(cwd, file);
	const content = await fs.readFile(resolved, "utf-8");

	// eslint-disable-next-line @typescript-eslint/no-unsafe-return
	return JSON.parse(content);
}

export default async function main() {
	const dtsFilePath = path.resolve(cwd, "dist", "index.d.ts");
	const content = await fs.readFile(dtsFilePath, "utf-8");
	const declarations = content.match(re);

	if (declarations === null) {
		throw new Error(`No found declarations at ${dtsFilePath}`);
	}

	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const json = await readJSON("package.json");
	const searchValue = declarations.at(-1);
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	const replaceValue = searchValue.replace(/"(.*?)"/, `"${json.name}"`);
	const edited = content.replace(searchValue, replaceValue);

	await fs.writeFile(dtsFilePath, edited, "utf-8");
}

void main();
