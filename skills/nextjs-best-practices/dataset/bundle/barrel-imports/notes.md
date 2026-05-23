# Barrel File Imports

## What Are Barrel Files?

Barrel files are `index.ts` (or `index.js`) files that re-export multiple modules from a directory. They provide a convenient single entry point for imports.

```ts
// components/index.ts — a barrel file
export * from './button'
export * from './modal'
export * from './sidebar'
export * from './chart'
```

## The Problem: Tree-Shaking Prevention

Modern bundlers (webpack, Rollup, esbuild) use tree-shaking to eliminate unused code. However, barrel files undermine this optimization:

1. **Side-effect analysis**: Bundlers must assume re-exports may have side effects
2. **Circular dependency risk**: Barrel files often create circular import graphs
3. **Hoisting behavior**: Import statements get hoisted, pulling in the entire barrel

When you write:
```ts
import { Button } from '@/components'  // Imports barrel file
```

The bundler cannot guarantee that `Modal`, `Sidebar`, and `Chart` are unused, so it may include them in the bundle.

## When It Matters Most

### Third-Party Libraries
Lodash is the classic example. `import { debounce } from 'lodash'` can bundle the entire library (~70KB minified+gzipped), while `import debounce from 'lodash/debounce'` bundles only that function.

### UI Component Libraries
Large component libraries often export dozens of components. Barrel imports pull everything into the client bundle.

### Icon Libraries
Icon sets can contain hundreds of SVGs. Importing from the barrel bundles icons you never render.

## Impact Assessment

| Library Type | Barrel Import Size | Direct Import Size | Wasted |
|--------------|-------------------|-------------------|--------|
| lodash (full) | ~70KB | ~2KB per function | 35x+ |
| @heroicons/react | ~200KB | ~1KB per icon | 200x+ |
| Material UI icons | ~500KB+ | ~1KB per icon | 500x+ |

## When Barrel Files Are Acceptable

- **Server-side code**: Bundle size doesn't affect users
- **Small directories**: 2-3 tightly coupled modules
- **Internal utilities**: Used everywhere, minimal overhead
- **Type-only exports**: TypeScript removes these at compile time

## Best Practices

1. **Always import directly from the source file** for client-side code
2. **Audit bundle size** with `@next/bundle-analyzer` to catch barrel imports
3. **Configure path aliases** to make direct imports ergonomic
4. **Use `lodash-es`** or individual lodash packages for tree-shakeable lodash