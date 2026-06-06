import { type FormEvent, useEffect, useState } from 'react'
import { CityAutocomplete } from '../components/candidate/CityAutocomplete'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { StatusBadge } from '../components/ui/StatusBadge'
import { calculateCandidateChart } from '../lib/chartApi'
import type { SelectedCity } from '../lib/geocoding'
import { resolveDisplayElementCounts } from '../lib/chartElementCounts'
import { buildTalentMapSynthesisInput } from '../lib/buildTalentMapSynthesisInput'
import { buildReferenceBundle } from '../lib/referenceBundleApi'
import {
  getChartElementCounts,
  getFirstCandidateForCompany,
  getLatestChartForCandidate,
  getOrCreateCompanyForCurrentUser,
  upsertSingleCandidateForCompany,
  type CandidatePayload,
} from '../lib/hrApi'
import type {
  Candidate,
  CandidateChart,
  ChartElementCounts,
  Company,
  ReferenceBundleResponse,
} from '../lib/types'

type FormValues = {
  name: string
  birth_date: string
  birth_time: string
  birth_place: string
  birth_timezone: string
}

type ChartUiStatus = 'not_calculated' | 'calculating' | 'calculated' | 'error'

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | {
      status: 'ready'
      company: Company
      candidate: Candidate | null
      values: FormValues
    }

const emptyValues: FormValues = {
  name: '',
  birth_date: '',
  birth_time: '',
  birth_place: '',
  birth_timezone: '',
}

function candidateToFormValues(candidate: Candidate | null): FormValues {
  if (!candidate) {
    return emptyValues
  }

  return {
    name: candidate.name,
    birth_date: candidate.birth_date ?? '',
    birth_time: candidate.birth_time ? candidate.birth_time.slice(0, 5) : '',
    birth_place: candidate.birth_place ?? '',
    birth_timezone: candidate.birth_timezone ?? '',
  }
}

function formValuesToPayload(values: FormValues, selectedCity: SelectedCity | null): CandidatePayload {
  const payload: CandidatePayload = {
    name: values.name,
    birth_date: values.birth_date || null,
    birth_time: values.birth_time || null,
    birth_place: values.birth_place || null,
    birth_timezone: values.birth_timezone || null,
  }

  if (selectedCity) {
    payload.birth_city_label = selectedCity.displayLabel
    payload.birth_latitude = selectedCity.latitude
    payload.birth_longitude = selectedCity.longitude
    payload.birth_city_source = 'open_meteo'
  } else if (!values.birth_place.trim()) {
    payload.birth_city_label = null
    payload.birth_latitude = null
    payload.birth_longitude = null
    payload.birth_city_source = null
  }

  return payload
}

type BirthInputSnapshot = {
  city_label: string | null
  timezone: string | null
  latitude: number | null
  longitude: number | null
}

function rehydrateSelectedCity(
  candidate: Candidate | null,
  chartBirthInput: BirthInputSnapshot | null,
): SelectedCity | null {
  const label =
    candidate?.birth_city_label ??
    candidate?.birth_place ??
    chartBirthInput?.city_label ??
    null
  const timezone = candidate?.birth_timezone ?? chartBirthInput?.timezone ?? null
  const latitude = candidate?.birth_latitude ?? chartBirthInput?.latitude ?? null
  const longitude = candidate?.birth_longitude ?? chartBirthInput?.longitude ?? null

  if (
    !label ||
    !timezone ||
    latitude === null ||
    longitude === null ||
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ) {
    return null
  }

  const name = label.split(',')[0]?.trim() || label

  return {
    id: 0,
    displayLabel: label,
    name,
    latitude,
    longitude,
    timezone,
    country: '',
    admin1: null,
  }
}

function readBirthInputFromChart(chart: CandidateChart | null) {
  if (!chart?.normalized_chart_data || typeof chart.normalized_chart_data !== 'object') {
    return null
  }

  const birthInput = (chart.normalized_chart_data as { birth_input?: Record<string, unknown> })
    .birth_input

  if (!birthInput) {
    return null
  }

  return {
    city_label:
      typeof birthInput.city_label === 'string'
        ? birthInput.city_label
        : typeof birthInput.birth_place === 'string'
          ? birthInput.birth_place
          : null,
    timezone: typeof birthInput.birth_timezone === 'string' ? birthInput.birth_timezone : null,
    latitude: typeof birthInput.birth_latitude === 'number' ? birthInput.birth_latitude : null,
    longitude: typeof birthInput.birth_longitude === 'number' ? birthInput.birth_longitude : null,
  }
}

function readCenterCountsFromChart(chart: CandidateChart | null) {
  if (!chart?.normalized_chart_data || typeof chart.normalized_chart_data !== 'object') {
    return null
  }

  const centers = (chart.normalized_chart_data as { centers?: { defined?: unknown[]; open?: unknown[]; all?: unknown[] } })
    .centers

  if (!centers) {
    return null
  }

  return {
    defined: Array.isArray(centers.defined) ? centers.defined.length : null,
    open: Array.isArray(centers.open) ? centers.open.length : null,
    all: Array.isArray(centers.all) ? centers.all.length : null,
  }
}

async function copyJson(value: unknown) {
  await navigator.clipboard.writeText(JSON.stringify(value, null, 2))
}

export function CandidatePage() {
  const [state, setState] = useState<PageState>({ status: 'loading' })
  const [values, setValues] = useState<FormValues>(emptyValues)
  const [selectedCity, setSelectedCity] = useState<SelectedCity | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const [chart, setChart] = useState<CandidateChart | null>(null)
  const [elementCounts, setElementCounts] = useState<ChartElementCounts | null>(null)
  const [chartUiStatus, setChartUiStatus] = useState<ChartUiStatus>('not_calculated')
  const [chartError, setChartError] = useState<string | null>(null)
  const [debugOpen, setDebugOpen] = useState(false)
  const [copyMessage, setCopyMessage] = useState<string | null>(null)

  const [bundleLoading, setBundleLoading] = useState(false)
  const [bundleError, setBundleError] = useState<string | null>(null)
  const [bundleResult, setBundleResult] = useState<ReferenceBundleResponse | null>(null)

  async function loadChartData(candidateId: string) {
    const latestChart = await getLatestChartForCandidate(candidateId)
    setChart(latestChart)

    if (latestChart) {
      const counts = await getChartElementCounts(latestChart.id)
      setElementCounts(counts)
      setChartUiStatus('calculated')
    } else {
      setElementCounts(null)
      setChartUiStatus('not_calculated')
    }

    return latestChart
  }

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

          let latestChart: CandidateChart | null = null
          if (candidate) {
            latestChart = await loadChartData(candidate.id)
          }

          if (!cancelled) {
            const birthInput = readBirthInputFromChart(latestChart)
            setSelectedCity(rehydrateSelectedCity(candidate, birthInput))
          }
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

  function handleCitySelect(city: SelectedCity) {
    setSelectedCity(city)
    setValues((prev) => ({
      ...prev,
      birth_place: city.displayLabel,
      birth_timezone: city.timezone,
    }))
    setSaved(false)
  }

  function handleCityClear() {
    setSelectedCity(null)
    setValues((prev) => ({
      ...prev,
      birth_timezone: '',
    }))
  }

  const cityReady = Boolean(
    selectedCity &&
      values.birth_timezone &&
      Number.isFinite(selectedCity.latitude) &&
      Number.isFinite(selectedCity.longitude),
  )

  const canCalculateChart =
    state.status === 'ready' &&
    Boolean(state.candidate?.id) &&
    values.name.trim() &&
    values.birth_date &&
    values.birth_time &&
    cityReady &&
    chartUiStatus !== 'calculating'

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
        formValuesToPayload(values, selectedCity),
      )
      const formValues = candidateToFormValues(candidate)
      setValues(formValues)
      setSelectedCity(rehydrateSelectedCity(candidate, readBirthInputFromChart(chart)))
      setState({ status: 'ready', company: state.company, candidate, values: formValues })
      setSaved(true)
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Не удалось сохранить кандидата.')
    } finally {
      setSaving(false)
    }
  }

  async function handleCalculateChart() {
    if (state.status !== 'ready' || !state.candidate?.id || !selectedCity) {
      return
    }

    setChartUiStatus('calculating')
    setChartError(null)

    try {
      const result = await calculateCandidateChart({
        candidate_id: state.candidate.id,
        birth_date: values.birth_date,
        birth_time: values.birth_time.slice(0, 5),
        birth_place: selectedCity.displayLabel,
        birth_timezone: selectedCity.timezone,
        birth_latitude: selectedCity.latitude,
        birth_longitude: selectedCity.longitude,
      })

      if (result.chart) {
        const nextChart: CandidateChart = {
          id: result.chart.id,
          company_id: state.company.id,
          candidate_id: result.chart.candidate_id,
          input_hash: result.chart.input_hash,
          chart_source: result.chart.chart_source,
          raw_chart_data: result.chart.raw_chart_data,
          normalized_chart_data: result.chart.normalized_chart_data,
          calculated_at: result.chart.calculated_at,
          created_at: result.chart.calculated_at ?? new Date().toISOString(),
          updated_at: result.chart.calculated_at ?? new Date().toISOString(),
        }

        setChart(nextChart)

        if (result.chart.element_counts) {
          setElementCounts({
            total: result.chart.element_counts.total ?? result.chart.elements_count,
            defined_centers: result.chart.element_counts.defined_centers ?? 0,
            open_centers: result.chart.element_counts.open_centers ?? 0,
            channels: result.chart.element_counts.channels ?? 0,
            gates: result.chart.element_counts.gates ?? 0,
            activations: result.chart.element_counts.activations ?? 0,
          })
        } else {
          await loadChartData(state.candidate.id)
        }
      } else {
        await loadChartData(state.candidate.id)
      }

      setChartUiStatus('calculated')
    } catch (error) {
      setChartUiStatus('error')
      setChartError(error instanceof Error ? error.message : 'Ошибка расчёта карты.')
    }
  }

  async function handleCopy(label: string, value: unknown) {
    try {
      await copyJson(value)
      setCopyMessage(`${label} скопирован`)
      window.setTimeout(() => setCopyMessage(null), 2000)
    } catch {
      setCopyMessage('Не удалось скопировать JSON')
    }
  }

  async function handleBuildReferenceBundle() {
    if (!chart?.id) {
      return
    }

    setBundleLoading(true)
    setBundleError(null)

    try {
      const result = await buildReferenceBundle(chart.id)
      setBundleResult(result)
    } catch (error) {
      setBundleError(
        error instanceof Error ? error.message : 'Не удалось собрать bundle расшифровок.',
      )
      setBundleResult(null)
    } finally {
      setBundleLoading(false)
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
  const birthInput = readBirthInputFromChart(chart)
  const displayCityLabel = selectedCity?.displayLabel ?? birthInput?.city_label ?? values.birth_place
  const displayTimezone = selectedCity?.timezone ?? birthInput?.timezone ?? values.birth_timezone
  const displayLatitude = selectedCity?.latitude ?? birthInput?.latitude
  const displayLongitude = selectedCity?.longitude ?? birthInput?.longitude
  const centerCounts = readCenterCountsFromChart(chart)
  const definedCentersCount = centerCounts?.defined ?? elementCounts?.defined_centers ?? 0
  const openCentersCount = centerCounts?.open ?? elementCounts?.open_centers ?? 0

  const synthesisPreview =
    chart?.id && bundleResult?.bundle && state.candidate?.id
      ? buildTalentMapSynthesisInput({
          candidateId: state.candidate.id,
          chartId: chart.id,
          bundle: bundleResult.bundle,
          coverage: bundleResult.coverage ?? null,
        })
      : null

  const displayElementCounts = resolveDisplayElementCounts({
    dbCounts: elementCounts,
    chart,
    bundleCoverage: bundleResult?.coverage ?? null,
  })

  return (
    <div className="stack">
      <div>
        <h1 className="page-title">Кандидат</h1>
        <p className="page-subtitle">
          {isEditing ? 'Редактирование данных кандидата' : 'Создание первого кандидата компании'}
        </p>
      </div>

      <Card title={isEditing ? 'Данные для расчёта карты' : 'Новый кандидат'}>
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
            {isEditing ? (
              <Button variant="secondary" to="/app/candidate/talent-map">
                Карта талантов
              </Button>
            ) : null}
          </div>
        </form>
      </Card>

      <Card title="Техническая Human Design карта">
        <div className="stack">
          <div className="chart-status-row">
            {chartUiStatus === 'not_calculated' ? (
              <StatusBadge status="draft" label="Техническая карта ещё не рассчитана" />
            ) : null}
            {chartUiStatus === 'calculating' ? (
              <StatusBadge status="processing" label="Расчёт карты…" />
            ) : null}
            {chartUiStatus === 'calculated' ? (
              <StatusBadge status="ready" label="Техническая карта рассчитана" />
            ) : null}
            {chartUiStatus === 'error' ? (
              <StatusBadge status="error" label="Ошибка расчёта карты" />
            ) : null}
          </div>

          {chartError ? (
            <div className="alert alert--error" role="alert">
              {chartError}
            </div>
          ) : null}

          {!state.candidate ? (
            <p className="empty-state">Сначала сохраните кандидата, затем рассчитайте карту.</p>
          ) : (
            <>
              <Button
                type="button"
                disabled={!canCalculateChart}
                onClick={() => void handleCalculateChart()}
              >
                {chartUiStatus === 'calculating'
                  ? 'Расчёт карты…'
                  : 'Рассчитать техническую карту'}
              </Button>

              {!cityReady ? (
                <p className="city-autocomplete__hint">
                  Выберите город из списка autocomplete — без этого расчёт недоступен.
                </p>
              ) : null}

              {chart && chartUiStatus === 'calculated' ? (
                <dl className="info-list">
                  <div className="info-list__row">
                    <dt>chart_id</dt>
                    <dd>{chart.id}</dd>
                  </div>
                  <div className="info-list__row">
                    <dt>calculated_at</dt>
                    <dd>{chart.calculated_at ?? '—'}</dd>
                  </div>
                  <div className="info-list__row">
                    <dt>chart_source</dt>
                    <dd>{chart.chart_source ?? '—'}</dd>
                  </div>
                  <div className="info-list__row">
                    <dt>elements count</dt>
                    <dd>{displayElementCounts?.total ?? 0}</dd>
                  </div>
                  <div className="info-list__row">
                    <dt>defined centers</dt>
                    <dd>{definedCentersCount}</dd>
                  </div>
                  <div className="info-list__row">
                    <dt>open centers</dt>
                    <dd>{openCentersCount}</dd>
                  </div>
                  <div className="info-list__row">
                    <dt>channels / gates / activations</dt>
                    <dd>
                      {displayElementCounts?.channels ?? 0} / {displayElementCounts?.gates ?? 0} /{' '}
                      {displayElementCounts?.activations ?? 0}
                    </dd>
                  </div>
                  <div className="info-list__row">
                    <dt>selected city</dt>
                    <dd>{displayCityLabel || '—'}</dd>
                  </div>
                  <div className="info-list__row">
                    <dt>timezone</dt>
                    <dd>{displayTimezone || '—'}</dd>
                  </div>
                  <div className="info-list__row">
                    <dt>latitude / longitude</dt>
                    <dd>
                      {displayLatitude ?? '—'} / {displayLongitude ?? '—'}
                    </dd>
                  </div>
                </dl>
              ) : null}
            </>
          )}
        </div>
      </Card>

      {chart ? (
        <Card title="Debug: справочник расшифровок">
          <div className="stack">
            <Button
              type="button"
              disabled={bundleLoading}
              onClick={() => void handleBuildReferenceBundle()}
            >
              {bundleLoading ? 'Сборка bundle…' : 'Собрать bundle расшифровок'}
            </Button>

            {bundleError ? (
              <div className="alert alert--error" role="alert">
                {bundleError}
              </div>
            ) : null}

            {bundleResult?.coverage ? (
              <div className="bundle-coverage">
                <h3 className="bundle-coverage__title">Coverage</h3>
                <dl className="info-list">
                  <div className="info-list__row">
                    <dt>всего элементов</dt>
                    <dd>{bundleResult.coverage.total_elements}</dd>
                  </div>
                  <div className="info-list__row">
                    <dt>найдено расшифровок</dt>
                    <dd>{bundleResult.coverage.matched_elements}</dd>
                  </div>
                  <div className="info-list__row">
                    <dt>не найдено</dt>
                    <dd>{bundleResult.coverage.missing_elements}</dd>
                  </div>
                  <div className="info-list__row">
                    <dt>coverage %</dt>
                    <dd>{bundleResult.coverage.coverage_percent}%</dd>
                  </div>
                </dl>

                {Object.keys(bundleResult.coverage.by_kind).length > 0 ? (
                  <div className="bundle-coverage__by-kind">
                    <h4 className="bundle-coverage__subtitle">Coverage by kind</h4>
                    <ul className="bundle-coverage__kind-list">
                      {Object.entries(bundleResult.coverage.by_kind)
                        .sort(([a], [b]) => a.localeCompare(b))
                        .map(([kind, stats]) => (
                          <li key={kind} className="bundle-coverage__kind-item">
                            <span className="bundle-coverage__kind-name">{kind}</span>
                            <span className="bundle-coverage__kind-stats">
                              {stats.matched}/{stats.total} matched, {stats.missing} missing
                            </span>
                          </li>
                        ))}
                    </ul>
                  </div>
                ) : null}

                {bundleResult.bundle?.missing_items.length ? (
                  <div className="bundle-missing">
                    <h4 className="bundle-coverage__subtitle">Missing items</h4>
                    <ul className="bundle-missing__list">
                      {bundleResult.bundle.missing_items.map((item) => (
                        <li key={`${item.element_kind}:${item.element_key}`} className="bundle-missing__item">
                          <span className="mono-text">
                            {item.element_kind}/{item.element_key}
                          </span>
                          {item.element_label ? (
                            <span className="bundle-missing__label"> — {item.element_label}</span>
                          ) : null}
                          <span className="bundle-missing__reason"> ({item.reason})</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            ) : null}

            {bundleResult?.bundle ? (
              <div className="debug-json-block">
                <div className="debug-json-block__header">
                  <h3 className="debug-json-block__title">source_interpretation_bundle</h3>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => void handleCopy('interpretation bundle JSON', bundleResult.bundle)}
                  >
                    Скопировать interpretation bundle JSON
                  </Button>
                </div>
                <pre className="debug-json-block__pre">
                  {JSON.stringify(bundleResult.bundle, null, 2)}
                </pre>
              </div>
            ) : null}
          </div>
        </Card>
      ) : null}

      {chart ? (
        <Card title="Debug: вход для будущей AI-карты талантов">
          <div className="stack">
            {!bundleResult?.bundle ? (
              <p className="city-autocomplete__hint">
                Сначала соберите bundle расшифровок — preview строится детерминированно из
                source_interpretation_bundle.
              </p>
            ) : null}

            {synthesisPreview ? (
              <>
                <div className="bundle-coverage">
                  <h3 className="bundle-coverage__title">Coverage</h3>
                  <dl className="info-list">
                    <div className="info-list__row">
                      <dt>matched elements</dt>
                      <dd>
                        {synthesisPreview.source_coverage?.matched_elements ?? '—'} /{' '}
                        {synthesisPreview.source_coverage?.total_elements ?? '—'}
                      </dd>
                    </div>
                    <div className="info-list__row">
                      <dt>coverage %</dt>
                      <dd>{synthesisPreview.source_coverage?.coverage_percent ?? '—'}%</dd>
                    </div>
                    <div className="info-list__row">
                      <dt>слоёв</dt>
                      <dd>{synthesisPreview.layers.length}</dd>
                    </div>
                  </dl>

                  {synthesisPreview.warnings.length > 0 ? (
                    <div className="bundle-missing">
                      <h4 className="bundle-coverage__subtitle">Предупреждения</h4>
                      <ul className="bundle-missing__list">
                        {synthesisPreview.warnings.map((warning) => (
                          <li key={warning} className="bundle-missing__item">
                            {warning}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>

                <div className="synthesis-layer-list">
                  <h3 className="bundle-coverage__title">Слои synthesis input</h3>
                  <ul className="synthesis-layer-list__items">
                    {synthesisPreview.layers.map((layer) => (
                      <li key={layer.layer_key} className="synthesis-layer-list__item">
                        <div className="synthesis-layer-list__header">
                          <span className="synthesis-layer-list__key mono-text">{layer.layer_key}</span>
                          <span className="synthesis-layer-list__title">{layer.layer_title}</span>
                        </div>
                        <div className="synthesis-layer-list__stats">
                          <span>source_items: {layer.source_items.length}</span>
                          <span>
                            primary:{' '}
                            {layer.source_items.filter((item) => item.source_role === 'primary').length}
                          </span>
                          <span>
                            supporting:{' '}
                            {layer.source_items.filter((item) => item.source_role === 'supporting').length}
                          </span>
                          <span>
                            context:{' '}
                            {layer.source_items.filter((item) => item.source_role === 'context_only').length}
                          </span>
                          <span>source_chips: {layer.source_chips.length}</span>
                        </div>
                        <div className="synthesis-layer-list__kinds">
                          <span className="synthesis-layer-list__kinds-label">element_kinds:</span>{' '}
                          <span className="mono-text">{layer.element_kinds_present.join(', ') || '—'}</span>
                        </div>
                        {layer.source_chips.length > 0 ? (
                          <ul className="synthesis-chip-list">
                            {layer.source_chips.map((chip) => (
                              <li key={`${chip.element_kind}:${chip.element_key}`} className="synthesis-chip-list__item">
                                <span className="mono-text">{chip.link_target}</span>
                                <span className="synthesis-chip-list__role">{chip.role_in_layer}</span>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                        {layer.warnings.length > 0 ? (
                          <ul className="synthesis-layer-list__warnings">
                            {layer.warnings.map((warning) => (
                              <li key={warning}>{warning}</li>
                            ))}
                          </ul>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="debug-json-block">
                  <div className="debug-json-block__header">
                    <h3 className="debug-json-block__title">talent_map_synthesis_input_preview</h3>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => void handleCopy('synthesis input preview JSON', synthesisPreview)}
                    >
                      Скопировать synthesis input preview JSON
                    </Button>
                  </div>
                  <pre className="debug-json-block__pre">
                    {JSON.stringify(synthesisPreview, null, 2)}
                  </pre>
                </div>
              </>
            ) : null}
          </div>
        </Card>
      ) : null}

      {chart ? (
        <Card title="Debug: техническая карта">
          <div className="stack">
            <Button type="button" variant="secondary" onClick={() => setDebugOpen((prev) => !prev)}>
              {debugOpen ? 'Скрыть debug-блок' : 'Показать debug-блок'}
            </Button>

            {copyMessage ? <p className="city-autocomplete__hint">{copyMessage}</p> : null}

            {debugOpen ? (
              <>
                <dl className="info-list">
                  <div className="info-list__row">
                    <dt>chart_id</dt>
                    <dd>{chart.id}</dd>
                  </div>
                  <div className="info-list__row">
                    <dt>calculated_at</dt>
                    <dd>{chart.calculated_at ?? '—'}</dd>
                  </div>
                  <div className="info-list__row">
                    <dt>chart_source</dt>
                    <dd>{chart.chart_source ?? '—'}</dd>
                  </div>
                  <div className="info-list__row">
                    <dt>input_hash</dt>
                    <dd className="mono-text">{chart.input_hash ?? '—'}</dd>
                  </div>
                  <div className="info-list__row">
                    <dt>selected city</dt>
                    <dd>{displayCityLabel || '—'}</dd>
                  </div>
                  <div className="info-list__row">
                    <dt>timezone</dt>
                    <dd>{displayTimezone || '—'}</dd>
                  </div>
                  <div className="info-list__row">
                    <dt>latitude / longitude</dt>
                    <dd>
                      {displayLatitude ?? '—'} / {displayLongitude ?? '—'}
                    </dd>
                  </div>
                  <div className="info-list__row">
                    <dt>defined centers</dt>
                    <dd>{definedCentersCount}</dd>
                  </div>
                  <div className="info-list__row">
                    <dt>open centers</dt>
                    <dd>{openCentersCount}</dd>
                  </div>
                  <div className="info-list__row">
                    <dt>elements count</dt>
                    <dd>{elementCounts?.total ?? 0}</dd>
                  </div>
                </dl>

                <div className="debug-json-block">
                  <div className="debug-json-block__header">
                    <h3 className="debug-json-block__title">normalized_chart_data</h3>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => void handleCopy('normalized JSON', chart.normalized_chart_data)}
                    >
                      Скопировать normalized JSON
                    </Button>
                  </div>
                  <pre className="debug-json-block__pre">
                    {JSON.stringify(chart.normalized_chart_data, null, 2)}
                  </pre>
                </div>

                <div className="debug-json-block">
                  <div className="debug-json-block__header">
                    <h3 className="debug-json-block__title">raw_chart_data</h3>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => void handleCopy('raw HD API JSON', chart.raw_chart_data)}
                    >
                      Скопировать raw HD API JSON
                    </Button>
                  </div>
                  <pre className="debug-json-block__pre">
                    {JSON.stringify(chart.raw_chart_data, null, 2)}
                  </pre>
                </div>
              </>
            ) : null}
          </div>
        </Card>
      ) : null}
    </div>
  )
}
