import { authGetSession } from './auth'
import type { ReferenceBundleResponse } from './types'

export async function buildReferenceBundle(chartId: string): Promise<ReferenceBundleResponse> {
  const session = await authGetSession()
  if (!session?.access_token) {
    throw new Error('Пользователь не авторизован.')
  }

  const response = await fetch('/.netlify/functions/reference-bundle-build', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ chart_id: chartId }),
  })

  const data = (await response.json()) as ReferenceBundleResponse

  if (!response.ok || !data.ok) {
    throw new Error(data.error ?? 'Не удалось собрать bundle расшифровок.')
  }

  return data
}
