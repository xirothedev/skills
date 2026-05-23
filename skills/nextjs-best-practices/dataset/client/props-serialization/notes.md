# Pass Serializable Props to Client Components

Props passed from Server Components to Client Components must be serializable (JSON-like). Passing functions, Promises, class instances, or non-serializable types causes runtime errors.

## Why This Matters

- Server Components render on the server; Client Components render in the browser
- Props cross the server-client boundary via serialization
- Non-serializable props cause "Functions cannot be passed as props" errors

## Serializable Types

- Primitives: `string`, `number`, `boolean`, `null`, `undefined`
- Arrays of serializable values
- Plain objects with serializable values
- Date objects (serialized as ISO strings)
- BigInt (serialized as string)

## Non-Serializable Types

- Functions (`() => void`, event handlers)
- Promises (use `await` in Server Component instead)
- Class instances (Date is special-cased)
- `Map`, `Set`, `WeakMap`, `WeakSet`
- `Symbol`, `RegExp`
- JSX elements / React nodes (pass as `children` instead)

## Pattern

Define event handlers and callbacks inside the Client Component, not in Server Components.

## References

- https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#passing-serializable-props-and-serializing-state