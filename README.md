# Photo Companion

Minimalistic photography toolkit progressive web application.

[Try it out][photo-companion]

## Packages

This is a monorepo containing `Photo companion` web-application and it's supporting packages based on workspaces. Each workspace has it's own **README** file with more details.

All packages are broken into 4 categories.

### `src/apps/*`

This directory contains web-applications packages. Right now it contains the only [`photo-companion`][app-photo-companion] package itself.

### `src/core/*`

This directory contains core packages used within monorepo.

- `types` — common project types;
- `ui` — core UI components and helpers;
- [`utils`][package-utils] — common project utility functions;
- 
### `src/deprecated/*`

This directory contains deprecated apps and packages.

- `photo-companion-svelte` — `Svelte JS` implementation of `photo-companion-app`, `Solid JS` is used instead;
- `ui-svelte` — core UI components and helpers based on `Svelte JS`;

### `src/packages/*`

This directory contains independent packages used to build web-applications.

- [`bridge-schedule`][package-bridge-schedule] — Saint-Petersburg bridges schedule provider;
- [`lights-schedule`][package-lights-schedule] — city lights schedule provider;
- [`moon-sun-calc`][package-moon-sun-calc] — the Sun and the Moon calculations;
- [`versioned-local-storage`][package-versioned-local-storage] — browser local storage with versioning;

## Developing

Project uses pnpm workspaces.

Install `pnpm` if you don't have one:

```
npm i pnpm -g
```

After that install dependencies for all workspaces:

```
pnpm i -r
```

Use `pnpm dev` command to start project locally and `pnpm build` to build the project.

## Contributing

### Linting

There are several linter commands:

- `pnpm lint:code` — uses `eslint`;
- `pnpm lint:styles` — uses `stylelint` to lint styles;
- `pnpm lint:types` — uses `tsc` to lint types;

All checks can be run concurrently using `pnpm lint` command.

### Writing tests

All tests are located in `*/test` directories inside a workspace.

The environment should be specified in `vitest.config.ts` file.

### Running tests

1. To run test, run `pnpm test:unit`;
2. To run a particular test suite, use `pnpm test:unit <suite-name>`, for example `pnpm test:unit moon`;

[photo-companion]: https://photo-companion.vercel.app
[app-photo-companion]: https://github.com/EricRovell/photo-companion/tree/main/src/apps/photo-companion
[package-bridge-schedule]: https://github.com/EricRovell/photo-companion/tree/main/src/packages/bridge-schedule
[package-lights-schedule]: https://github.com/EricRovell/photo-companion/tree/main/src/packages/lights-schedule
[package-moon-sun-calc]: https://github.com/EricRovell/photo-companion/tree/main/src/packages/moon-sun-calc
[package-versioned-local-storage]: https://github.com/EricRovell/photo-companion/tree/main/src/packages/versioned-local-storage
[package-utils]: https://github.com/EricRovell/photo-companion/tree/main/src/core/utils
