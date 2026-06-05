import { buildIsoDatetimeWithOffset } from './datetime'

export type HdChartRequest = {
  birthDate: string
  birthTime: string
  birthTimezone: string
  birthLatitude: number
  birthLongitude: number
}

export type HdChartResponse = {
  raw: unknown
  chartSource: string
}

export class HdApiError extends Error {
  provider: string
  endpoint: string
  status: number
  providerMessage: string
  requestBodyKeys: string[]

  constructor(details: {
    provider: string
    endpoint: string
    status: number
    providerMessage: string
    requestBodyKeys: string[]
  }) {
    super(details.providerMessage)
    this.name = 'HdApiError'
    this.provider = details.provider
    this.endpoint = details.endpoint
    this.status = details.status
    this.providerMessage = details.providerMessage
    this.requestBodyKeys = details.requestBodyKeys
  }
}

function extractProviderMessage(payload: unknown, fallback: string): string {
  if (typeof payload === 'object' && payload !== null) {
    const record = payload as Record<string, unknown>
    for (const key of ['message', 'error', 'errorMessage', 'detail']) {
      const value = record[key]
      if (typeof value === 'string' && value.trim()) {
        return value.trim()
      }
    }
  }

  return fallback
}

function getHdConfig() {
  const apiKey = process.env.HD_API_KEY?.trim()
  const baseUrl = process.env.HD_API_BASE_URL?.trim().replace(/\/$/, '')

  if (!apiKey || !baseUrl) {
    throw new Error('HD API is not configured (HD_API_KEY / HD_API_BASE_URL).')
  }

  return { apiKey, baseUrl }
}

function isHumanDesignApiNl(baseUrl: string): boolean {
  return baseUrl.includes('humandesignapi.nl')
}

function isBodygraphChartProvider(baseUrl: string): boolean {
  return baseUrl.includes('bodygraphchart.com') || baseUrl.includes('/hd-data')
}

function isHumanDesignHubProvider(baseUrl: string): boolean {
  return baseUrl.includes('humandesignhub.app')
}

function resolveCoordinatesEndpoint(baseUrl: string): string {
  if (baseUrl.includes('/charts/coordinates')) {
    return baseUrl
  }

  if (baseUrl.includes('/v2/charts') && !baseUrl.endsWith('/coordinates')) {
    return `${baseUrl}/coordinates`
  }

  return `${baseUrl}/v2/charts/coordinates`
}

async function readJsonResponse(response: Response): Promise<unknown> {
  const text = await response.text()
  if (!text) {
    return null
  }

  try {
    return JSON.parse(text) as unknown
  } catch {
    throw new Error(`HD API returned non-JSON response (${response.status}).`)
  }
}

async function fetchBodygraphChart(
  apiKey: string,
  baseUrl: string,
  request: HdChartRequest,
): Promise<unknown> {
  const endpoint = baseUrl.includes('/hd-data')
    ? baseUrl
    : `${baseUrl}/v221006/hd-data`

  const url = new URL(endpoint)
  url.searchParams.set('api_key', apiKey)
  url.searchParams.set('date', `${request.birthDate} ${request.birthTime.slice(0, 5)}`)
  url.searchParams.set('timezone', request.birthTimezone)

  const response = await fetch(url.toString(), { method: 'GET' })
  const payload = await readJsonResponse(response)

  if (!response.ok) {
    const message =
      typeof payload === 'object' && payload !== null && 'message' in payload
        ? String((payload as { message: unknown }).message)
        : `HD API error (${response.status}).`
    throw new Error(message)
  }

  return payload
}

async function fetchCoordinatesChart(
  apiKey: string,
  baseUrl: string,
  request: HdChartRequest,
): Promise<unknown> {
  const endpoint = resolveCoordinatesEndpoint(baseUrl)
  const requestBody = {
    birthdate: request.birthDate,
    birthtime: request.birthTime.slice(0, 5),
    lat: request.birthLatitude,
    lng: request.birthLongitude,
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })

  const payload = await readJsonResponse(response)

  if (!response.ok) {
    throw new HdApiError({
      provider: 'humandesignapi.nl',
      endpoint,
      status: response.status,
      providerMessage: extractProviderMessage(payload, `HD API error (${response.status}).`),
      requestBodyKeys: Object.keys(requestBody),
    })
  }

  return payload
}

async function fetchHubStyleChart(
  apiKey: string,
  baseUrl: string,
  request: HdChartRequest,
): Promise<unknown> {
  const datetime = buildIsoDatetimeWithOffset(
    request.birthDate,
    request.birthTime,
    request.birthTimezone,
  )

  const resolveUrl = `${baseUrl}/v1/timezone/resolve`
  let chartDatetime = datetime

  try {
    const resolveResponse = await fetch(resolveUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': apiKey,
      },
      body: JSON.stringify({
        date: request.birthDate,
        time: request.birthTime.slice(0, 5),
        timezone: request.birthTimezone,
      }),
    })

    if (resolveResponse.ok) {
      const resolvePayload = (await resolveResponse.json()) as {
        datetime?: string
        data?: { datetime?: string }
      }
      chartDatetime =
        resolvePayload.datetime ?? resolvePayload.data?.datetime ?? chartDatetime
    }
  } catch {
    // Fallback to locally built datetime when resolve endpoint is unavailable.
  }

  const chartUrl = baseUrl.endsWith('/bodygraph') ? baseUrl : `${baseUrl}/v1/bodygraph`

  const response = await fetch(chartUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': apiKey,
    },
    body: JSON.stringify({
      datetime: chartDatetime,
      verbose: true,
      latitude: request.birthLatitude,
      longitude: request.birthLongitude,
      timezone: request.birthTimezone,
    }),
  })

  const payload = await readJsonResponse(response)

  if (!response.ok) {
    const message =
      typeof payload === 'object' && payload !== null && 'message' in payload
        ? String((payload as { message: unknown }).message)
        : typeof payload === 'object' && payload !== null && 'error' in payload
          ? String((payload as { error: unknown }).error)
          : `HD API error (${response.status}).`
    throw new Error(message)
  }

  return payload
}

export async function fetchHumanDesignChart(request: HdChartRequest): Promise<HdChartResponse> {
  const { apiKey, baseUrl } = getHdConfig()

  if (isBodygraphChartProvider(baseUrl)) {
    const raw = await fetchBodygraphChart(apiKey, baseUrl, request)
    return { raw, chartSource: 'bodygraphchart.com' }
  }

  if (isHumanDesignApiNl(baseUrl) || baseUrl.includes('/charts/coordinates')) {
    const raw = await fetchCoordinatesChart(apiKey, baseUrl, request)
    return { raw, chartSource: 'humandesignapi.nl' }
  }

  if (isHumanDesignHubProvider(baseUrl)) {
    const raw = await fetchHubStyleChart(apiKey, baseUrl, request)
    return { raw, chartSource: 'humandesignhub.app' }
  }

  throw new Error(
    'Unsupported HD_API_BASE_URL. Use https://api.humandesignapi.nl, https://api.humandesignhub.app, or a bodygraphchart.com hd-data URL.',
  )
}
