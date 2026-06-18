import type { TalentMapStatus } from '../../lib/types'

type StatusBadgeProps = {
  status: TalentMapStatus
  label?: string
}

const labels: Record<string, string> = {
  draft: 'Черновик',
  pending: 'Ожидает',
  processing: 'В обработке',
  ready: 'Готово',
  error: 'Ошибка',
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  return (
    <span className={`status-badge status-badge--${status}`}>
      {label ?? labels[status] ?? status}
    </span>
  )
}
