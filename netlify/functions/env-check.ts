import type { Handler } from '@netlify/functions'

const ENV_KEYS = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'OPENAI_API_KEY',
  'HD_API_KEY',
  'HD_API_BASE_URL',
] as const

export const handler: Handler = async () => {
  const envStatus = Object.fromEntries(
    ENV_KEYS.map((key) => [key, Boolean(process.env[key]?.trim())]),
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
    }),
  }
}
