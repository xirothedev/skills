# Use Direct ref Prop (React 19, No forwardRef)

React 19 removes the need for `forwardRef`. Pass `ref` as a regular prop. This simplifies component signatures and is the recommended pattern for Next.js 15+ with React 19.

## Why This Matters

- `forwardRef` is deprecated in React 19
- Direct `ref` prop is cleaner and more intuitive
- Reduces boilerplate in component libraries
- Applies to all interactive components: inputs, buttons, custom form controls

## Migration Notes

- Next.js 15+ ships with React 19
- For Next.js 14 with React 18, continue using `forwardRef`
- TypeScript types change: `ref` becomes a regular prop

## References

- https://react.dev/reference/react/forwardRef
- https://react.dev/blog/2024/04/25/react-19