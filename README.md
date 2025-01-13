# Photo Companion

Minimalistic photography toolkit progressive web application.

[Try it out][photo-companion]

## Packages

This is a monorepo containing `Photo companion` web-application and it's supporting packages based on workspaces. Each workspace has it's own **README** file with more details.

- [`bridge-schedule`][bridge-schedule] — Saint-Petersburg bridges schedule provider;
- [`lights-schedule`][lights-schedule] — city lights schedule provider;
- [`moon-sun-calc`][moon-sun-calc] — the Sun and the Moon calculations;
- [`photo-companion`][photo-companion-repo] — the main web-app;
- `types` — common project types;
- `ui` — core UI components and helpers;
- [`utils`][utils] — common project utility functions;
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
[photo-companion-repo]: https://github.com/EricRovell/photo-companion/tree/main/packages/photo-companion
[bridge-schedule]: https://github.com/EricRovell/photo-companion/tree/main/packages/bridge-schedule
[lights-schedule]: https://github.com/EricRovell/photo-companion/tree/main/packages/lights-schedule
[moon-sun-calc]: https://github.com/EricRovell/photo-companion/tree/main/packages/moon-sun-calc
[versioned-local-storage]: https://github.com/EricRovell/photo-companion/tree/main/packages/versioned-local-storage
[utils]: https://github.com/EricRovell/photo-companion/tree/main/packages/utils
