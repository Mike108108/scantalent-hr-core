import { createHash } from 'node:crypto'

export type ChartBirthInput = {
  birth_date: string
  birth_time: string
  birth_place: string
  birth_timezone: string
  birth_latitude: number
  birth_longitude: number
}

function roundCoordinate(value: number): number {
  return Math.round(value * 1_000_000) / 1_000_000
}

export function computeChartInputHash(input: ChartBirthInput): string {
  const canonical = JSON.stringify({
    birth_date: input.birth_date,
    birth_time: input.birth_time.slice(0, 5),
    birth_place: input.birth_place.trim(),
    birth_timezone: input.birth_timezone.trim(),
    birth_latitude: roundCoordinate(input.birth_latitude),
    birth_longitude: roundCoordinate(input.birth_longitude),
  })

  return createHash('sha256').update(canonical).digest('hex')
}
