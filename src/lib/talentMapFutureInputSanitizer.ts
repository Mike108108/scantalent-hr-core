/**
 * Sanitizes text destined for section synthesis future input (digests / selected fields).
 * Raw reference metadata in Element Library / debug views is not modified.
 */

const TERM_REPLACEMENTS: ReadonlyArray<{ pattern: RegExp; replacement: string }> = [
  { pattern: /fit_score/gi, replacement: 'числовая оценка соответствия' },
  { pattern: /fit[\s_-]?percent(?:age)?/gi, replacement: 'процент соответствия' },
  { pattern: /fit_percent/gi, replacement: 'процент соответствия' },
  { pattern: /match_score/gi, replacement: 'числовой показатель совпадения' },
  { pattern: /match_percentage/gi, replacement: 'процент совпадения' },
  { pattern: /match[\s_-]?percent(?:age)?/gi, replacement: 'процент совпадения' },
  { pattern: /role_fit/gi, replacement: 'соответствие роли' },
  { pattern: /role[\s_-]?fit/gi, replacement: 'соответствие роли' },
  { pattern: /vacancy_fit/gi, replacement: 'соответствие вакансии' },
  { pattern: /vacancy[\s_-]?fit/gi, replacement: 'соответствие вакансии' },
]

export function sanitizeFutureInputText(text: string): string {
  let result = text
  for (const { pattern, replacement } of TERM_REPLACEMENTS) {
    result = result.replace(pattern, replacement)
  }
  return result
}

export function sanitizeFutureInputValue(value: unknown): unknown {
  if (value === null || value === undefined) {
    return value
  }

  if (typeof value === 'string') {
    return sanitizeFutureInputText(value)
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeFutureInputValue(item))
  }

  if (typeof value === 'object') {
    const result: Record<string, unknown> = {}
    for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
      result[sanitizeFutureInputText(key)] = sanitizeFutureInputValue(nested)
    }
    return result
  }

  return value
}

export type SectionSourceDigestShape = {
  plain_meaning?: string
  work_manifestation?: string
  strengths?: string[]
  risks?: string[]
  management_hints?: string[]
  environment_hints?: string[]
  limitations?: string[]
  context_note?: string
  composition_meta?: {
    composition_mode?: string | null
    composition_components?: string[] | null
    source_component_keys?: string[] | null
  }
}

export function sanitizeDigestPayload<T extends SectionSourceDigestShape>(digest: T): T {
  return sanitizeFutureInputValue(digest) as T
}
