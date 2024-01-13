# Things to manage

## filter commands

I could not set up `packages` workflow because of the `filter` command. The ability to targer specific package scripts should be managed before the `moon-sun-calc` is published.

## `vercel.json`

As mentioned [here](https://github.com/vercel/vercel/discussions/7649) there is only a workaround to use `vercel.json` for different projects in monorepo. As the monorepo contains one application, the `vercel.json` is located in the root. In case there will be more apps (not planned for now) this issue should be managed.
