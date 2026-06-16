import {
  createContext,
  type FormEvent,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { SelectedCity } from '../../lib/geocoding'
import { calculateCandidateChart } from '../../lib/chartApi'
import { resolveDisplayElementCounts } from '../../lib/chartElementCounts'
import { parseNormalizedChart } from '../../lib/chartDataHelpers'
import { buildTalentMapSynthesisInput } from '../../lib/buildTalentMapSynthesisInput'
import { buildReferenceBundle } from '../../lib/referenceBundleApi'
import {
  getChartElementCounts,
  getFirstCandidateForCompany,
  getLatestChartForCandidate,
  getOrCreateCompanyForCurrentUser,
  upsertSingleCandidateForCompany,
  type CandidatePayload,
} from '../../lib/hrApi'
import type {
  Candidate,
  CandidateChart,
  ChartElementCounts,
  Company,
  ReferenceBundleResponse,
} from '../../lib/types'
import type { ElementDrawerSelection } from './ElementDrawer'

export type FormValues = {
  name: string
  birth_date: string
  birth_time: string
  birth_place: string
  birth_timezone: string
}

type ChartUiStatus = 'not_calculated' | 'calculating' | 'calculated' | 'error'

type WorkspaceState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; company: Company; candidate: Candidate | null; values: FormValues }

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

function readBirthInputFromChart(chart: CandidateChart | null): BirthInputSnapshot | null {
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

type CandidateWorkspaceContextValue = {
  state: WorkspaceState
  values: FormValues
  selectedCity: SelectedCity | null
  saving: boolean
  saveError: string | null
  saved: boolean
  chart: CandidateChart | null
  elementCounts: ChartElementCounts | null
  displayElementCounts: ChartElementCounts | null
  chartUiStatus: ChartUiStatus
  chartError: string | null
  bundleResult: ReferenceBundleResponse | null
  bundleLoading: boolean
  bundleError: string | null
  normalizedChart: ReturnType<typeof parseNormalizedChart>
  synthesisPreview: ReturnType<typeof buildTalentMapSynthesisInput> | null
  drawerSelection: ElementDrawerSelection | null
  setDrawerSelection: (selection: ElementDrawerSelection | null) => void
  updateField: (field: keyof FormValues, value: string) => void
  handleCitySelect: (city: SelectedCity) => void
  handleCityClear: () => void
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>
  handleCalculateChart: () => Promise<void>
  handleBuildReferenceBundle: () => Promise<void>
  canCalculateChart: boolean
  cityReady: boolean
}

const CandidateWorkspaceContext = createContext<CandidateWorkspaceContextValue | null>(null)

export function CandidateWorkspaceProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WorkspaceState>({ status: 'loading' })
  const [values, setValues] = useState<FormValues>(emptyValues)
  const [selectedCity, setSelectedCity] = useState<SelectedCity | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const [chart, setChart] = useState<CandidateChart | null>(null)
  const [elementCounts, setElementCounts] = useState<ChartElementCounts | null>(null)
  const [chartUiStatus, setChartUiStatus] = useState<ChartUiStatus>('not_calculated')
  const [chartError, setChartError] = useState<string | null>(null)

  const [bundleLoading, setBundleLoading] = useState(false)
  const [bundleError, setBundleError] = useState<string | null>(null)
  const [bundleResult, setBundleResult] = useState<ReferenceBundleResponse | null>(null)
  const [drawerSelection, setDrawerSelection] = useState<ElementDrawerSelection | null>(null)
  const bundleFetchAttemptedRef = useRef<string | null>(null)

  const loadChartData = useCallback(async (candidateId: string) => {
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
  }, [])

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
  }, [loadChartData])

  useEffect(() => {
    if (!chart?.id || bundleResult) {
      return
    }

    if (bundleFetchAttemptedRef.current === chart.id) {
      return
    }

    bundleFetchAttemptedRef.current = chart.id
    let cancelled = false

    async function loadBundle() {
      setBundleLoading(true)
      setBundleError(null)

      try {
        const result = await buildReferenceBundle(chart!.id)
        if (!cancelled) {
          setBundleResult(result)
        }
      } catch (error) {
        if (!cancelled) {
          setBundleError(
            error instanceof Error ? error.message : 'Не удалось собрать bundle расшифровок.',
          )
        }
      } finally {
        if (!cancelled) {
          setBundleLoading(false)
        }
      }
    }

    void loadBundle()

    return () => {
      cancelled = true
    }
  }, [chart?.id, bundleResult])

  const updateField = useCallback((field: keyof FormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }))
    setSaved(false)
  }, [])

  const handleCitySelect = useCallback((city: SelectedCity) => {
    setSelectedCity(city)
    setValues((prev) => ({
      ...prev,
      birth_place: city.displayLabel,
      birth_timezone: city.timezone,
    }))
    setSaved(false)
  }, [])

  const handleCityClear = useCallback(() => {
    setSelectedCity(null)
    setValues((prev) => ({
      ...prev,
      birth_timezone: '',
    }))
  }, [])

  const cityReady = Boolean(
    selectedCity &&
      values.birth_timezone &&
      Number.isFinite(selectedCity.latitude) &&
      Number.isFinite(selectedCity.longitude),
  )

  const canCalculateChart =
    state.status === 'ready' &&
    Boolean(state.candidate?.id) &&
    Boolean(values.name.trim()) &&
    Boolean(values.birth_date) &&
    Boolean(values.birth_time) &&
    cityReady &&
    chartUiStatus !== 'calculating'

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
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
    },
    [state, values, selectedCity, chart],
  )

  const handleCalculateChart = useCallback(async () => {
    if (state.status !== 'ready' || !state.candidate?.id || !selectedCity) {
      return
    }

    setChartUiStatus('calculating')
    setChartError(null)
    setBundleResult(null)
    bundleFetchAttemptedRef.current = null

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
  }, [state, values, selectedCity, loadChartData])

  const handleBuildReferenceBundle = useCallback(async () => {
    if (!chart?.id) {
      return
    }

    setBundleLoading(true)
    setBundleError(null)
    bundleFetchAttemptedRef.current = chart.id

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
  }, [chart?.id])

  const normalizedChart = useMemo(() => parseNormalizedChart(chart), [chart])

  const displayElementCounts = useMemo(
    () =>
      resolveDisplayElementCounts({
        dbCounts: elementCounts,
        chart,
        bundleCoverage: bundleResult?.coverage ?? null,
      }),
    [elementCounts, chart, bundleResult?.coverage],
  )

  const synthesisPreview = useMemo(() => {
    if (!chart?.id || !bundleResult?.bundle || state.status !== 'ready' || !state.candidate?.id) {
      return null
    }

    return buildTalentMapSynthesisInput({
      candidateId: state.candidate.id,
      chartId: chart.id,
      bundle: bundleResult.bundle,
      coverage: bundleResult.coverage ?? null,
    })
  }, [chart?.id, bundleResult, state])

  const value: CandidateWorkspaceContextValue = {
    state,
    values,
    selectedCity,
    saving,
    saveError,
    saved,
    chart,
    elementCounts,
    displayElementCounts,
    chartUiStatus,
    chartError,
    bundleResult,
    bundleLoading,
    bundleError,
    normalizedChart,
    synthesisPreview,
    drawerSelection,
    setDrawerSelection,
    updateField,
    handleCitySelect,
    handleCityClear,
    handleSubmit,
    handleCalculateChart,
    handleBuildReferenceBundle,
    canCalculateChart,
    cityReady,
  }

  return (
    <CandidateWorkspaceContext.Provider value={value}>{children}</CandidateWorkspaceContext.Provider>
  )
}

export function useCandidateWorkspace() {
  const context = useContext(CandidateWorkspaceContext)
  if (!context) {
    throw new Error('useCandidateWorkspace must be used within CandidateWorkspaceProvider')
  }
  return context
}
