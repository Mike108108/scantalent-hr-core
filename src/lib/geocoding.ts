export type OpenMeteoLocation = {
  id: number
  name: string
  latitude: number
  longitude: number
  timezone: string
  country: string
  admin1?: string
}

export type SelectedCity = {
  id: number
  displayLabel: string
  name: string
  latitude: number
  longitude: number
  timezone: string
  country: string
  admin1: string | null
}

export function formatCityLabel(location: Pick<OpenMeteoLocation, 'name' | 'admin1' | 'country'>): string {
  const parts = [location.name]
  if (location.admin1) {
    parts.push(location.admin1)
  }
  if (location.country) {
    parts.push(location.country)
  }
  return parts.join(', ')
}

export function mapOpenMeteoLocation(location: OpenMeteoLocation): SelectedCity {
  return {
    id: location.id,
    displayLabel: formatCityLabel(location),
    name: location.name,
    latitude: location.latitude,
    longitude: location.longitude,
    timezone: location.timezone,
    country: location.country,
    admin1: location.admin1 ?? null,
  }
}

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search'

export async function searchCities(query: string): Promise<SelectedCity[]> {
  const trimmed = query.trim()
  if (trimmed.length < 3) {
    return []
  }

  const url = new URL(GEOCODING_URL)
  url.searchParams.set('name', trimmed)
  url.searchParams.set('count', '10')
  url.searchParams.set('language', 'ru')
  url.searchParams.set('format', 'json')

  const response = await fetch(url.toString())
  if (!response.ok) {
    throw new Error('Не удалось выполнить поиск города.')
  }

  const payload = (await response.json()) as { results?: OpenMeteoLocation[] }
  return (payload.results ?? []).map(mapOpenMeteoLocation)
}
