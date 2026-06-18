export const QA_FAILURE_GENERATION_ERROR =
  'Раздел не прошёл проверку качества после сборки.' as const

export type SectionGenerationErrorKind = 'technical' | 'qa_failed' | 'audit_failed'

export function isPostGenerationQaFailure(report: {
  generation_error: string | null
}): boolean {
  return report.generation_error === QA_FAILURE_GENERATION_ERROR
}

export function resolveSectionGenerationErrorKind(params: {
  generation_error: string | null
  quality_flags?: unknown
}): SectionGenerationErrorKind {
  if (isPostGenerationQaFailure(params)) {
    return 'qa_failed'
  }
  return 'technical'
}

export function formatSectionErrorBadgeLabel(report: {
  status: string
  generation_error: string | null
}): string {
  if (report.status === 'ready') {
    return 'Раздел собран'
  }

  if (report.status === 'error') {
    return isPostGenerationQaFailure(report)
      ? 'Раздел не прошёл проверку'
      : 'Не удалось собрать раздел'
  }

  return 'Ещё не собран'
}

export function formatSectionErrorUserMessage(
  technicalMessage: string | null | undefined,
  errorKind?: SectionGenerationErrorKind,
): string {
  if (errorKind === 'qa_failed' || technicalMessage === QA_FAILURE_GENERATION_ERROR) {
    return 'Раздел не прошёл проверку'
  }

  if (!technicalMessage) {
    return 'Не удалось собрать раздел'
  }

  if (technicalMessage.includes('OPENAI_API_KEY is not configured')) {
    return 'Не настроен ключ OpenAI для сборки раздела.'
  }

  return 'Не удалось собрать раздел'
}

export function shouldShowTechnicalErrorDetails(report: {
  status: string
  generation_error: string | null
}): boolean {
  return report.status === 'error' && !isPostGenerationQaFailure(report)
}
