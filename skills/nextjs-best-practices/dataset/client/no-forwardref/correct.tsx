// Correct: React 19 direct ref prop (Next.js 15+)
// components/input.tsx
'use client'

import { type InputHTMLAttributes, type Ref } from 'react'

// React 19 style: ref is a regular prop (no forwardRef wrapper needed)
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  ref?: Ref<HTMLInputElement>
}

export function Input({ label, error, className, ref, ...props }: InputProps) {
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

// ---
// components/button.tsx
'use client'

import { type ButtonHTMLAttributes, type Ref } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  ref?: Ref<HTMLButtonElement>
}

export function Button({ variant = 'primary', className, ref, ...props }: ButtonProps) {
  return (
    <button
      ref={ref}
      className={`btn btn-${variant} ${className ?? ''}`}
      {...props}
    />
  )
}

// ---
// Usage in parent component
// app/form/page.tsx
'use client'

import { useRef } from 'react'
import { Input } from '@/components/input'
import { Button } from '@/components/button'

export function Form() {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Direct access to input element
    console.log(inputRef.current?.value)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input ref={inputRef} name="email" label="Email" type="email" required />
      <Button type="submit">Submit</Button>
    </form>
  )
}