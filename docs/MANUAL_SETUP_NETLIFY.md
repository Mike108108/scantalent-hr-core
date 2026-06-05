# Ручная настройка Netlify

Пошаговая инструкция для деплоя ScanTalent HR Core.

## Шаги

1. Открой [Netlify Dashboard](https://app.netlify.com/).
2. Нажми **Add new site**.
3. Выбери **Import from Git**.
4. Подключи GitHub и выбери репозиторий `scantalent-hr-core`.
5. Убедись в настройках сборки:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
6. Добавь environment variables:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
HD_API_KEY=
HD_API_BASE_URL=
```

7. Нажми **Deploy site**.

## Что уже настроено в репозитории

- `netlify.toml` — команда сборки, publish directory и redirects для SPA
- `public/_redirects` — fallback для client-side routing
- `netlify/functions/health.ts` — health check endpoint
- `netlify/functions/env-check.ts` — проверка наличия секретных env без раскрытия значений

## Проверка после деплоя

### Health function

Открой:

```text
https://<your-site>.netlify.app/.netlify/functions/health
```

Ожидаемый ответ:

```json
{
  "ok": true,
  "service": "scantalent-hr-core",
  "timestamp": "..."
}
```

### Env check function

Открой:

```text
https://<your-site>.netlify.app/.netlify/functions/env-check
```

Ответ покажет только `true/false` для каждой переменной, без значений секретов.

## SPA routing

Маршруты `/app`, `/login`, `/signup` и вложенные пути работают через redirect на `index.html`.
