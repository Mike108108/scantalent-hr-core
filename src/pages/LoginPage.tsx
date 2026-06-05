import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'

export function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const email = String(formData.get('email') ?? '').trim()
    const password = String(formData.get('password') ?? '')

    try {
      await signIn(email, password)
      navigate('/app', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось войти.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card title="Вход" subtitle="Войдите в ScanTalent HR Core" className="form-card">
      <form className="stack" onSubmit={(event) => void handleSubmit(event)}>
        <Input label="Email" name="email" type="email" autoComplete="email" required disabled={loading} />
        <Input
          label="Пароль"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          disabled={loading}
        />
        {error ? (
          <div className="alert alert--error" role="alert">
            {error}
          </div>
        ) : null}
        <div className="form-actions">
          <Button type="submit" disabled={loading}>
            {loading ? 'Вход…' : 'Войти'}
          </Button>
        </div>
        <p className="form-footer">
          Нет аккаунта? <Link to="/signup">Зарегистрироваться</Link>
        </p>
      </form>
    </Card>
  )
}
