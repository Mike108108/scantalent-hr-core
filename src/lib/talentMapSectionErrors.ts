export const QA_FAILURE_GENERATION_ERROR =
  'Раздел не прошёл проверку качества после сборки.' as const

export type SectionGenerationErrorKind = 'technical' | 'qa_failed' | 'audit_failed'

const ENDPOINT_TRANSPORT_ERROR_PREFIXES = [
  'Endpoint returned non-JSON response.',
  'Endpoint returned invalid JSON.',
] as const

export type SectionGenerationErrorPresentation = {
  userMessage: string
  technicalDetails: string
  errorKind?: SectionGenerationErrorKind
  status?: number
}

export function isEndpointTransportError(message: string | null | undefined): boolean {
  if (!message) {
    return false
  }

  return ENDPOINT_TRANSPORT_ERROR_PREFIXES.some((prefix) => message.startsWith(prefix))
}

export function formatSectionGenerationTransportUserMessage(): string {
  return 'Не удалось вызвать функцию сборки раздела.'
}

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
  if (isEndpointTransportError(technicalMessage)) {
    return formatSectionGenerationTransportUserMessage()
  }

  if (errorKind === 'qa_failed' || technicalMessage === QA_FAILURE_GENERATION_ERROR) {
    return 'Раздел не прошёл проверку'
  }

  if (
    technicalMessage?.includes('Не удалось получить токен авторизации') ||
    technicalMessage?.includes('Missing or invalid Authorization header') ||
    technicalMessage?.includes('Missing bearer token') ||
    technicalMessage?.includes('Invalid or expired session')
  ) {
    return 'Не удалось получить токен авторизации. Войдите заново.'
  }

  if (!technicalMessage) {
    return 'Не удалось собрать раздел'
  }

  if (technicalMessage.includes('OPENAI_API_KEY is not configured')) {
    return 'Не настроен ключ OpenAI для сборки раздела.'
  }

  return 'Не удалось собрать раздел'
}

export function buildSectionGenerationErrorPresentation(params: {
  technicalMessage?: string | null
  errorKind?: SectionGenerationErrorKind
  status?: number
  endpoint?: string
  diagnostics?: Record<string, unknown>
  audit?: unknown
  qualityFlags?: string[]
  rawResponse?: unknown
}): SectionGenerationErrorPresentation {
  const technicalMessage = params.technicalMessage?.trim() || 'Unknown section generation error.'
  const detailLines = [
    params.endpoint ? `Endpoint: ${params.endpoint}` : null,
    typeof params.status === 'number' ? `Status: ${params.status}` : null,
    params.errorKind ? `Error kind: ${params.errorKind}` : null,
    `Error: ${technicalMessage}`,
    params.diagnostics
      ? `Diagnostics: ${JSON.stringify(params.diagnostics, null, 2)}`
      : null,
    params.audit ? `Audit: ${JSON.stringify(params.audit, null, 2)}` : null,
    params.qualityFlags?.length
      ? `Quality flags: ${params.qualityFlags.join('; ')}`
      : null,
    params.rawResponse
      ? `Raw response: ${JSON.stringify(params.rawResponse, null, 2)}`
      : null,
  ].filter(Boolean)

  return {
    userMessage: formatSectionErrorUserMessage(technicalMessage, params.errorKind),
    technicalDetails: detailLines.join('\n'),
    errorKind: params.errorKind,
    status: params.status,
  }
}

export function shouldShowTechnicalErrorDetails(report: {
  status: string
  generation_error: string | null
}): boolean {
  return report.status === 'error' && !isPostGenerationQaFailure(report)
}
