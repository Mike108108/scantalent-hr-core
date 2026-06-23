import { getTalentMapSectionDefinition as getUiSectionDefinition } from './talentMapSections'

export const SUPPORTED_GENERATED_SECTION_KEYS = [
  'work_mode_and_entry',
  'decision_style',
] as const

export type SupportedGeneratedSectionKey =
  (typeof SUPPORTED_GENERATED_SECTION_KEYS)[number]

export function isSupportedGeneratedSectionKey(
  value: unknown,
): value is SupportedGeneratedSectionKey {
  return (
    typeof value === 'string' &&
    (SUPPORTED_GENERATED_SECTION_KEYS as readonly string[]).includes(value)
  )
}

export function assertSupportedGeneratedSectionKey(
  value: unknown,
): SupportedGeneratedSectionKey {
  if (isSupportedGeneratedSectionKey(value)) {
    return value
  }

  throw new Error(
    `Unsupported generated section key: ${String(value)}. Supported: ${SUPPORTED_GENERATED_SECTION_KEYS.join(', ')}`,
  )
}

export function getSupportedGeneratedSectionTitle(
  sectionKey: SupportedGeneratedSectionKey,
): string {
  return getUiSectionDefinition(sectionKey).title
}
