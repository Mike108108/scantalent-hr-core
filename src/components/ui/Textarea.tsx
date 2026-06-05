import type { TextareaHTMLAttributes } from 'react'

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string
}

export function Textarea({ label, id, ...rest }: TextareaProps) {
  const textareaId = id ?? rest.name

  return (
    <label className="input-field" htmlFor={textareaId}>
      <span className="input-field__label">{label}</span>
      <textarea id={textareaId} className="input-field__textarea" rows={4} {...rest} />
    </label>
  )
}
