import { Card } from '../components/ui/Card'
import { StatusBadge } from '../components/ui/StatusBadge'

const blocks = [
  { title: 'Данные кандидата', status: 'draft' as const },
  { title: 'Статус технической карты', status: 'draft' as const },
  { title: 'Статус карты талантов', status: 'draft' as const },
]

export function CandidatePage() {
  return (
    <div className="stack">
      <div>
        <h1 className="page-title">Кандидат</h1>
        <p className="page-subtitle">Placeholder страницы кандидата</p>
      </div>

      <div className="grid-2">
        {blocks.map((block) => (
          <Card key={block.title} title={block.title}>
            <div className="empty-state">
              <StatusBadge status={block.status} />
              <p style={{ marginTop: '0.75rem' }}>Данные появятся после подключения Supabase.</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
