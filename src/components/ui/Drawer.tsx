import { type ReactNode, useEffect } from 'react'
import { Button } from './Button'

type DrawerProps = {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}

export function Drawer({ open, title, onClose, children }: DrawerProps) {
  useEffect(() => {
    if (!open) {
      return
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) {
    return null
  }

  return (
    <div className="drawer-root" role="presentation">
      <button type="button" className="drawer-backdrop" aria-label="Закрыть" onClick={onClose} />
      <aside className="drawer-panel" role="dialog" aria-modal="true" aria-label={title}>
        <header className="drawer-panel__header">
          <h2 className="drawer-panel__title">{title}</h2>
          <Button variant="ghost" type="button" onClick={onClose} aria-label="Закрыть панель">
            ✕
          </Button>
        </header>
        <div className="drawer-panel__body">{children}</div>
      </aside>
    </div>
  )
}
