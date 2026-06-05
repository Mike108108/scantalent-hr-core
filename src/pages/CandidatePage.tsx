import { type FormEvent, useEffect, useState } from 'react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Textarea } from '../components/ui/Textarea'
import {
  getFirstCandidateForCompany,
  getOrCreateCompanyForCurrentUser,
  upsertSingleCandidateForCompany,
  type CandidatePayload,
} from '../lib/hrApi'
import type { Candidate, Company } from '../lib/types'

type FormValues = {
  name: string
  email: string
  phone: string
  birth_date: string
  birth_time: string
  birth_place: string
  birth_timezone: string
  notes: string
}

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; company: Company; candidate: Candidate | null; values: FormValues }

const emptyValues: FormValues = {
  name: '',
  email: '',
  phone: '',
  birth_date: '',
  birth_time: '',
  birth_place: '',
  birth_timezone: '',
  notes: '',
}

function candidateToFormValues(candidate: Candidate | null): FormValues {
  if (!candidate) {
    return emptyValues
  }

  return {
    name: candidate.name,
    email: candidate.email ?? '',
    phone: candidate.phone ?? '',
    birth_date: candidate.birth_date ?? '',
    birth_time: candidate.birth_time ? candidate.birth_time.slice(0, 5) : '',
    birth_place: candidate.birth_place ?? '',
    birth_timezone: candidate.birth_timezone ?? '',
    notes: candidate.notes ?? '',
  }
}

function formValuesToPayload(values: FormValues): CandidatePayload {
  return {
    name: values.name,
    email: values.email || null,
    phone: values.phone || null,
    birth_date: values.birth_date || null,
    birth_time: values.birth_time || null,
    birth_place: values.birth_place || null,
    birth_timezone: values.birth_timezone || null,
    notes: values.notes || null,
  }
}

export function CandidatePage() {
  const [state, setState] = useState<PageState>({ status: 'loading' })
  const [values, setValues] = useState<FormValues>(emptyValues)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const company = await getOrCreateCompanyForCurrentUser()
        const candidate = await getFirstCandidateForCompany(company.id)

        if (!cancelled) {
          const formValues = candidateToFormValues(candidate)
          setValues(formValues)
          setState({ status: 'ready', company, candidate, values: formValues })
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            status: 'error',
            message: error instanceof Error ? error.message : 'Не удалось загрузить кандидата.',
          })
        }
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [])

  function updateField(field: keyof FormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (state.status !== 'ready') {
      return
    }

    setSaving(true)
    setSaveError(null)
    setSaved(false)

    try {
      const candidate = await upsertSingleCandidateForCompany(
        state.company.id,
        formValuesToPayload(values),
      )
      const formValues = candidateToFormValues(candidate)
      setValues(formValues)
      setState({ status: 'ready', company: state.company, candidate, values: formValues })
      setSaved(true)
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Не удалось сохранить кандидата.')
    } finally {
      setSaving(false)
    }
  }

  if (state.status === 'loading') {
    return (
      <div className="page-loading" role="status" aria-live="polite">
        <span className="spinner" aria-hidden="true" />
        <span>Загрузка кандидата…</span>
      </div>
    )
  }

  if (state.status === 'error') {
    return (
      <div className="stack">
        <div>
          <h1 className="page-title">Кандидат</h1>
          <p className="page-subtitle">Данные кандидата для HR-анализа</p>
        </div>
        <div className="alert alert--error" role="alert">
          {state.message}
        </div>
      </div>
    )
  }

  const isEditing = Boolean(state.candidate)

  return (
    <div className="stack">
      <div>
        <h1 className="page-title">Кандидат</h1>
        <p className="page-subtitle">
          {isEditing ? 'Редактирование данных кандидата' : 'Создание первого кандидата компании'}
        </p>
      </div>

      <Card title={isEditing ? 'Данные кандидата' : 'Новый кандидат'}>
        <form className="stack" onSubmit={(event) => void handleSubmit(event)}>
          <Input
            label="Имя кандидата"
            name="name"
            value={values.name}
            onChange={(event) => updateField('name', event.target.value)}
            required
            disabled={saving}
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={values.email}
            onChange={(event) => updateField('email', event.target.value)}
            disabled={saving}
          />
          <Input
            label="Телефон"
            name="phone"
            type="tel"
            value={values.phone}
            onChange={(event) => updateField('phone', event.target.value)}
            disabled={saving}
          />
          <Input
            label="Дата рождения"
            name="birth_date"
            type="date"
            value={values.birth_date}
            onChange={(event) => updateField('birth_date', event.target.value)}
            disabled={saving}
          />
          <Input
            label="Время рождения"
            name="birth_time"
            type="time"
            value={values.birth_time}
            onChange={(event) => updateField('birth_time', event.target.value)}
            disabled={saving}
          />
          <Input
            label="Место рождения"
            name="birth_place"
            value={values.birth_place}
            onChange={(event) => updateField('birth_place', event.target.value)}
            disabled={saving}
          />
          <Input
            label="Часовой пояс"
            name="birth_timezone"
            placeholder="Europe/Moscow"
            value={values.birth_timezone}
            onChange={(event) => updateField('birth_timezone', event.target.value)}
            disabled={saving}
          />
          <Textarea
            label="Комментарий HR"
            name="notes"
            value={values.notes}
            onChange={(event) => updateField('notes', event.target.value)}
            disabled={saving}
          />

          {saveError ? (
            <div className="alert alert--error" role="alert">
              {saveError}
            </div>
          ) : null}

          {saved ? (
            <div className="alert alert--success" role="status">
              Кандидат сохранён
            </div>
          ) : null}

          <div className="form-actions">
            <Button type="submit" disabled={saving}>
              {saving ? 'Сохранение…' : 'Сохранить кандидата'}
            </Button>
            {isEditing ? (
              <Button variant="secondary" to="/app/candidate/talent-map">
                Карта талантов
              </Button>
            ) : null}
          </div>
        </form>
      </Card>
    </div>
  )
}
