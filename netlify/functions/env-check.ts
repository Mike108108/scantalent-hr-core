import type { Handler } from '@netlify/functions'

const REQUIRED_ENV_KEYS = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'OPENAI_API_KEY',
  'HD_API_KEY',
  'HD_API_BASE_URL',
] as const

const OPTIONAL_ENV_KEYS = {
  OPENAI_RESPONSES_MODEL: {
    default: 'gpt-5-nano',
    note: 'optional, default gpt-5-nano',
  },
} as const

export const handler: Handler = async () => {
  const envStatus = Object.fromEntries(
    REQUIRED_ENV_KEYS.map((key) => [key, Boolean(process.env[key]?.trim())]),
  )

  const optionalEnvStatus = Object.fromEntries(
    Object.entries(OPTIONAL_ENV_KEYS).map(([key, meta]) => [
      key,
      {
        configured: Boolean(process.env[key]?.trim()),
        default: meta.default,
        note: meta.note,
      },
    ]),
  )

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ok: true,
      service: 'scantalent-hr-core',
      timestamp: new Date().toISOString(),
      env: envStatus,
      optional_env: optionalEnvStatus,
    }),
  }
}
