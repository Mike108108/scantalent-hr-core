import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

type BaseProps = {
  variant?: ButtonVariant
  children: ReactNode
  className?: string
}

type ButtonAsButton = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    to?: undefined
  }

type ButtonAsLink = BaseProps & {
  to: string
}

type ButtonProps = ButtonAsButton | ButtonAsLink

function getClassName(variant: ButtonVariant, className?: string): string {
  return ['btn', `btn--${variant}`, className].filter(Boolean).join(' ')
}

export function Button(props: ButtonProps) {
  const { variant = 'primary', children, className } = props

  if ('to' in props && props.to) {
    return (
      <Link to={props.to} className={getClassName(variant, className)}>
        {children}
      </Link>
    )
  }

  const { type = 'button', ...rest } = props as ButtonAsButton

  return (
    <button type={type} className={getClassName(variant, className)} {...rest}>
      {children}
    </button>
  )
}
