import type { FormEvent } from 'react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'

export function LoginPage() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <Card title="Вход" subtitle="Войдите в ScanTalent HR Core" className="form-card">
      <form className="stack" onSubmit={handleSubmit}>
        <Input label="email" name="email" type="email" autoComplete="email" required />
        <Input
          label="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
        <div className="form-actions">
          <Button type="submit">Войти</Button>
        </div>
      </form>
    </Card>
  )
}
