// Incorrect: React 18 forwardRef pattern (deprecated in React 19)
// components/input.tsx
'use client'

import { forwardRef, type InputHTMLAttributes, type Ref } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

// React 18 style: forwardRef wrapper adds unnecessary boilerplate
export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input({ label, error, className, ...props }, ref: Ref<HTMLInputElement>) {
    const inputId = props.id ?? props.name

    return (
      <div className="input-wrapper">
        {label && <label htmlFor={inputId}>{label}</label>}
        <input
          ref={ref}
          id={inputId}
          className={`${className ?? ''} ${error ? 'error' : ''}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error && (
          <span id={`${inputId}-error`} className="error-message" role="alert">
            {error}
          </span>
        )}
      </div>
    )
  }
)

// Problems:
// 1. forwardRef is deprecated in React 19 (Next.js 15+)
// 2. Extra wrapper function adds unnecessary complexity
// 3. Component name must be explicitly set for DevTools (function name in second arg)
// 4. TypeScript types are more verbose
// 5. Ref is special-cased instead of being a regular prop

// ---
// components/button.tsx (also incorrect in React 19)
'use client'

import { forwardRef, type ButtonHTMLAttributes, type Ref } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ variant = 'primary', className, ...props }, ref: Ref<HTMLButtonElement>) {
    return (
      <button
        ref={ref}
        className={`btn btn-${variant} ${className ?? ''}`}
        {...props}
      />
    )
  }
)

// This pattern still works in React 19 but triggers deprecation warnings
// and will be removed in future versions