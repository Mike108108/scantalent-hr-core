import type { ReactNode } from 'react'

type CardProps = {
  title?: string
  subtitle?: string
  children: ReactNode
  className?: string
}

export function Card({ title, subtitle, children, className }: CardProps) {
  return (
    <section className={['card', className].filter(Boolean).join(' ')}>
      {title ? <h2 className="card__title">{title}</h2> : null}
      {subtitle ? <p className="card__subtitle">{subtitle}</p> : null}
      {children}
    </section>
  )
}
