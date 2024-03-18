# Photo Companion

Minimalistic photography toolkit progressive web application.

[Try it out](https://photo-companion.vercel.app)

## Packages

This is a monorepo containing `Photo companion` web-application and it's supporting packages based on workspaces. Each workspace has it's own **README** file with more details.

All packages are broken into 3 categories.

### `src/apps/*`

This directory contains web-applications packages. Right now it contains the only `photo-companion` package itself.

### `src/packages/*`

This directory contains independent packages used to build web-applications.

- `bridge-schedule` — Saint-Petersburg bridges schedule provider;
- `lights-schedule` — city lights schedule provider;
- `moon-sun-calc` — the Sun and the Moon calculations;
- `ui` — core UI components and helpers;
- `versioned-local-storage` — browser local storrage with versioning;

### `src/shared/*`

This directory contains core packages used within monorepo.

- `types` — common project types;
- `utils` — common project utility functions;


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

All checks can be run concurrently using `pnpm lint:all` command.

### Writing tests

All tests are localed in `*/test` directories of specific workspace.

### Running tests

1. To run test, run `pnpm test:unit`;
2. To run a particular test suite, use `pnpm test:unit <suite-name>`, for example `pnpm test:unit moon`;
