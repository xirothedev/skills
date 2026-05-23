---
title: Use Direct ref Prop (React 19, No forwardRef)
impact: MEDIUM
impactDescription: Simplifies component API, removes boilerplate, follows React 19 conventions
tags: client-components, react-19, forwardref
versionScope: "15.x.x, 16.x.x"
deprecatedFrom: "14.x.x"
dataset: client/no-forwardref
---

## Use Direct ref Prop (React 19, No forwardRef)

React 19 removes the need for `forwardRef`. Pass `ref` as a regular prop. This simplifies component signatures and is the recommended pattern for Next.js 15+ with React 19.

**Incorrect (React 18 forwardRef pattern):**

```tsx
'use client'

import { forwardRef } from 'react'

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input({ className, ...rest }, ref) {
    return <input ref={ref} className={className} {...rest} />
  }
)
```

**Correct (React 19 direct ref prop):**

```tsx
'use client'

export function Input({ className, ref, ...rest }: InputProps) {
  return <input ref={ref} className={className} {...rest} />
}
```

For TypeScript, define the type normally:

```tsx
'use client'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  ref?: React.Ref<HTMLInputElement>
}

export function Input({ className, ref, ...rest }: InputProps) {
  return <input ref={ref} className={className} {...rest} />
}
```

This applies to all interactive components: inputs, buttons, custom form controls, and any component that previously used `forwardRef`.

Dataset: `dataset/client/no-forwardref`

Reference:
- https://react.dev/reference/react/forwardRef
- https://react.dev/blog/2024/04/25/react-19
