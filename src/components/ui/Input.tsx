import type { InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
}

export function Input({ label, id, ...rest }: InputProps) {
  const inputId = id ?? rest.name

  return (
    <label className="input-field" htmlFor={inputId}>
      <span className="input-field__label">{label}</span>
      <input id={inputId} className="input-field__input" {...rest} />
    </label>
  )
}
