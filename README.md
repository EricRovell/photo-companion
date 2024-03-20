# Photo Companion

Minimalistic photography toolkit progressive web application.

[Try it out][photo-companion]

## Packages

This is a monorepo containing `Photo companion` web-application and it's supporting packages based on workspaces. Each workspace has it's own **README** file with more details.

All packages are broken into 3 categories.

### `src/apps/*`

This directory contains web-applications packages. Right now it contains the only [`photo-companion`][app-photo-companion] package itself.

### `src/packages/*`

This directory contains independent packages used to build web-applications.

- [`bridge-schedule`][package-bridge-schedule] — Saint-Petersburg bridges schedule provider;
- [`lights-schedule`][package-lights-schedule] — city lights schedule provider;
- [`moon-sun-calc`][package-moon-sun-calc] — the Sun and the Moon calculations;
- `ui` — core UI components and helpers;
- [`versioned-local-storage`][package-versioned-local-storage] — browser local storage with versioning;

### `src/core/*`

This directory contains core packages used within monorepo.

- `types` — common project types;
- [`utils`][package-utils] — common project utility functions;


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

There are 3 linter commands:

- `pnpm lint:code` — uses `eslint`;
- `pnpm lint:styles` — uses `stylelint` to lint styles;
- `pnpm lint:svelte` — uses `svelte-check` to lint `.svelte` files;
- `pnpm lint:types` — uses `tsc` to lint types;

All checks can be run concurrently using `pnpm lint:all` command.

### Writing tests

All tests are localed in `*/test` directories inside a workspace.

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
