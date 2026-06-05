function readLocalParts(timeZone: string, utcMs: number) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(new Date(utcMs))

  const get = (type: string) => Number(parts.find((part) => part.type === type)?.value ?? '0')

  return {
    y: get('year'),
    m: get('month'),
    d: get('day'),
    hh: get('hour') % 24,
    mm: get('minute'),
  }
}

function getTimezoneOffsetMinutes(timeZone: string, date: Date): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    timeZoneName: 'shortOffset',
    hour: '2-digit',
  }).formatToParts(date)

  const tzName = parts.find((part) => part.type === 'timeZoneName')?.value ?? 'GMT'
  const match = tzName.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/)
  if (!match) {
    return 0
  }

  const sign = match[1] === '+' ? 1 : -1
  const hours = Number(match[2])
  const minutes = Number(match[3] ?? '0')
  return sign * (hours * 60 + minutes)
}

export function buildIsoDatetimeWithOffset(
  birthDate: string,
  birthTime: string,
  timeZone: string,
): string {
  const [year, month, day] = birthDate.split('-').map(Number)
  const [hour, minute] = birthTime.slice(0, 5).split(':').map(Number)
  const target = { y: year, m: month, d: day, hh: hour, mm: minute }

  let utcMs = Date.UTC(year, month - 1, day, hour, minute, 0)

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const local = readLocalParts(timeZone, utcMs)
    const diffMinutes =
      (target.y - local.y) * 525_600 +
      (target.m - local.m) * 43_800 +
      (target.d - local.d) * 1_440 +
      (target.hh - local.hh) * 60 +
      (target.mm - local.mm)

    if (diffMinutes === 0) {
      break
    }

    utcMs += diffMinutes * 60_000
  }

  const offsetMinutes = getTimezoneOffsetMinutes(timeZone, new Date(utcMs))
  const sign = offsetMinutes >= 0 ? '+' : '-'
  const absolute = Math.abs(offsetMinutes)
  const offsetHours = String(Math.floor(absolute / 60)).padStart(2, '0')
  const offsetMins = String(absolute % 60).padStart(2, '0')
  const timePart = birthTime.slice(0, 5)

  return `${birthDate}T${timePart}${sign}${offsetHours}:${offsetMins}`
}
