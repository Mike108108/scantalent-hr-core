import { CityAutocomplete } from '../candidate/CityAutocomplete'
import { useCandidateWorkspace } from '../candidate/CandidateWorkspaceContext'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Input } from '../ui/Input'
import { StatusBadge } from '../ui/StatusBadge'

export function OverviewTab() {
  const {
    state,
    values,
    selectedCity,
    saving,
    saveError,
    saved,
    chartUiStatus,
    chartError,
    displayElementCounts,
    normalizedChart,
    bundleResult,
    bundleLoading,
    canCalculateChart,
    cityReady,
    updateField,
    handleCitySelect,
    handleCityClear,
    handleSubmit,
    handleCalculateChart,
  } = useCandidateWorkspace()

  if (state.status !== 'ready') {
    return null
  }

  const isEditing = Boolean(state.candidate)
  const chartReady = chartUiStatus === 'calculated'
  const coveragePercent = bundleResult?.coverage?.coverage_percent
  const sourcesLabel =
    coveragePercent !== undefined ? `${coveragePercent}%` : bundleLoading ? 'загрузка…' : '—'

  const passportFields = [
    { label: 'Тип', value: normalizedChart?.type },
    { label: 'Стратегия', value: normalizedChart?.strategy },
    { label: 'Авторитет', value: normalizedChart?.authority },
    { label: 'Профиль', value: normalizedChart?.profile },
    { label: 'Определение', value: normalizedChart?.definition },
    { label: 'Центры', value: chartReady ? `${displayElementCounts?.defined_centers ?? 0} / ${displayElementCounts?.open_centers ?? 0}` : null },
    { label: 'Каналы', value: chartReady ? String(displayElementCounts?.channels ?? 0) : null },
    { label: 'Ворота', value: chartReady ? String(displayElementCounts?.gates ?? 0) : null },
    { label: 'Активации', value: chartReady ? String(displayElementCounts?.activations ?? 0) : null },
  ]

  return (
    <div className="stack workspace-sections">
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
            label="Дата рождения"
            name="birth_date"
            type="date"
            value={values.birth_date}
            onChange={(event) => updateField('birth_date', event.target.value)}
            required
            disabled={saving}
          />
          <Input
            label="Время рождения"
            name="birth_time"
            type="time"
            value={values.birth_time}
            onChange={(event) => updateField('birth_time', event.target.value)}
            required
            disabled={saving}
          />
          <CityAutocomplete
            label="Город рождения"
            value={values.birth_place}
            selectedCity={selectedCity}
            onValueChange={(value) => updateField('birth_place', value)}
            onCitySelect={handleCitySelect}
            onCityClear={handleCityClear}
            disabled={saving}
            required
          />
          <Input
            label="Часовой пояс (из выбранного города)"
            name="birth_timezone"
            value={values.birth_timezone}
            readOnly
            disabled
            required
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
            {state.candidate ? (
              <Button
                type="button"
                variant="secondary"
                disabled={!canCalculateChart}
                onClick={() => void handleCalculateChart()}
              >
                {chartUiStatus === 'calculating' ? 'Расчёт карты…' : 'Рассчитать техническую карту'}
              </Button>
            ) : null}
          </div>

          {!cityReady && state.candidate ? (
            <p className="city-autocomplete__hint">
              Выберите город из списка autocomplete — без этого расчёт недоступен.
            </p>
          ) : null}

          {chartError ? (
            <div className="alert alert--error" role="alert">
              {chartError}
            </div>
          ) : null}
        </form>
      </Card>

      <Card title="Статус данных">
        {!state.candidate ? (
          <p className="empty-state">Сначала сохраните кандидата.</p>
        ) : (
          <dl className="info-list">
            <div className="info-list__row">
              <dt>Техническая карта</dt>
              <dd>
                {chartUiStatus === 'calculated' ? (
                  <StatusBadge status="ready" label="готова" />
                ) : chartUiStatus === 'calculating' ? (
                  <StatusBadge status="processing" label="расчёт…" />
                ) : chartUiStatus === 'error' ? (
                  <StatusBadge status="error" label="ошибка" />
                ) : (
                  <StatusBadge status="draft" label="не готова" />
                )}
              </dd>
            </div>
            <div className="info-list__row">
              <dt>Элементы</dt>
              <dd>
                {chartReady
                  ? `${displayElementCounts?.total ?? 0} / ${displayElementCounts?.total ?? 0}`
                  : '—'}
              </dd>
            </div>
            <div className="info-list__row">
              <dt>Активации</dt>
              <dd>
                {chartReady
                  ? `${displayElementCounts?.activations ?? 0} / ${displayElementCounts?.activations ?? 0}`
                  : '—'}
              </dd>
            </div>
            <div className="info-list__row">
              <dt>Источники</dt>
              <dd>{sourcesLabel}</dd>
            </div>
          </dl>
        )}
      </Card>

      <Card title="Короткий технический паспорт">
        {!chartReady ? (
          <p className="empty-state">Техническая карта ещё не рассчитана.</p>
        ) : (
          <dl className="info-list">
            {passportFields.map((field) => (
              <div key={field.label} className="info-list__row">
                <dt>{field.label}</dt>
                <dd>{field.value ?? '—'}</dd>
              </div>
            ))}
          </dl>
        )}
      </Card>

      <Card title="Собранные разделы карты талантов">
        <div className="empty-state stack">
          <p>Разделы карты талантов ещё не собраны.</p>
          <p>Можно собрать всю карту или выбрать отдельные разделы.</p>
          <div className="form-actions">
            <Button to="/app/candidate/talent-map">Перейти к карте талантов</Button>
          </div>
        </div>
      </Card>

      <Card title="Сравнения с вакансиями">
        <div className="empty-state stack">
          <p>Кандидат пока не сравнивался с вакансиями.</p>
          <p>После добавления вакансий здесь появится история сопоставлений.</p>
          <div className="form-actions">
            <Button variant="secondary" to="/app/comparison">
              Перейти к сравнению
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
