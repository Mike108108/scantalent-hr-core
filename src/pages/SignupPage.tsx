import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'

export function SignupPage() {
  const { signUp } = useAuth()
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
      await signUp(email, password)
      navigate('/app', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось создать аккаунт.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card title="Регистрация" subtitle="Создайте аккаунт ScanTalent" className="form-card">
      <form className="stack" onSubmit={(event) => void handleSubmit(event)}>
        <Input label="Email" name="email" type="email" autoComplete="email" required disabled={loading} />
        <Input
          label="Пароль"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          disabled={loading}
        />
        {error ? (
          <div className="alert alert--error" role="alert">
            {error}
          </div>
        ) : null}
        <div className="form-actions">
          <Button type="submit" disabled={loading}>
            {loading ? 'Создание…' : 'Создать аккаунт'}
          </Button>
        </div>
        <p className="form-footer">
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </form>
    </Card>
  )
}
