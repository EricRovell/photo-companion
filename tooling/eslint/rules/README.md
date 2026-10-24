# ESlint rule: JSX wrapping

The local `jsx/wrap-props` rule formats `.tsx` files without a separate formatter. It measures width from the opening `<`, excluding indentation and preceding code.

When inline JSX exceeds the limit, the fixer moves children onto separate lines first. If the opening tag still exceeds the limit, it puts each prop and the closing bracket on separate lines. Self-closing tags wrap props directly.

For example, with the default 65-column limit:

```tsx
// Before
<Text as="p" color="secondary">A longer description for the current photo.</Text>

// After
<Text as="p" color="secondary">
	A longer description for the current photo.
</Text>
```

Configure the rule in [eslint.config.js](../../../eslint.config.js):

```js
"jsx/wrap-props": [ "error", { maxWidth: 65, tabWidth: 2 } ]
```

`maxWidth` sets the wrapping threshold. `tabWidth` sets tab stops within JSX; leading indentation never counts toward the limit.

Apply fixes with `pnpm lint:code:fix`.

The fixer preserves comments, existing multiline children, and meaningful text whitespace. It keeps already multiline opening tags at one prop per line and does not automatically collapse them back onto one line.
