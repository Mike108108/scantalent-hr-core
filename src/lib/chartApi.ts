import { authGetSession } from './auth'

export type CalculateChartPayload = {
  candidate_id: string
  birth_date: string
  birth_time: string
  birth_place: string
  birth_timezone: string
  birth_latitude: number
  birth_longitude: number
}

export type CalculateChartResponse = {
  ok: boolean
  reused?: boolean
  error?: string
  chart?: {
    id: string
    candidate_id: string
    input_hash: string | null
    chart_source: string | null
    calculated_at: string | null
    normalized_chart_data: unknown
    raw_chart_data: unknown
    elements_count: number
    element_counts?: {
      total: number
      defined_centers: number
      open_centers: number
      channels: number
      gates: number
      activations: number
      by_kind: Record<string, number>
    }
  }
}

export async function calculateCandidateChart(
  payload: CalculateChartPayload,
): Promise<CalculateChartResponse> {
  const session = await authGetSession()
  if (!session?.access_token) {
    throw new Error('Пользователь не авторизован.')
  }

  const response = await fetch('/.netlify/functions/candidate-chart-calculate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify(payload),
  })

  const data = (await response.json()) as CalculateChartResponse

  if (!response.ok || !data.ok) {
    throw new Error(data.error ?? 'Ошибка расчёта карты.')
  }

  return data
}
