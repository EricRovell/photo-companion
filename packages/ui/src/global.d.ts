type CSSModuleClasses = Readonly<Record<string, string>>

declare module "*.module.css" {
	const classes: CSSModuleClasses;
	export default classes;
}
