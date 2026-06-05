# ScanTalent HR Core

**ScanTalent / Сканер талантов** — минимальный HR Core MVP для работы с кандидатом и картой талантов.

MVP-цепочка:

```text
1 компания → 1 кандидат → расчёт карты → карта талантов
```

Текущий шаг — технический scaffold: frontend shell, SQL schema, seed, Netlify functions и документация.

## Стек

- Vite + React + TypeScript
- React Router
- Supabase JS client
- Netlify Functions
- Обычный CSS без UI-библиотек

## Локальный запуск

```bash
npm install
cp .env.example .env
npm run dev
```

Приложение откроется на `http://localhost:5173`.

## Environment variables

Скопируй `.env.example` в `.env` и заполни frontend-переменные:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Дополнительные server-side переменные для Netlify Functions:

```env
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
HD_API_KEY=
HD_API_BASE_URL=
```

Если `VITE_SUPABASE_*` не заданы, приложение **не падает** — показывается предупреждение и UI работает в scaffold-режиме.

## Сборка

```bash
npm run build
```

Проверка типов:

```bash
npm run typecheck
```

## Маршруты

| Path | Страница |
|------|----------|
| `/` | Landing |
| `/login` | Login form |
| `/signup` | Signup form |
| `/app` | App home |
| `/app/candidate` | Candidate placeholder |
| `/app/candidate/talent-map` | Talent map placeholder |

## Netlify

Репозиторий готов к деплою на Netlify:

- build: `npm run build`
- publish: `dist`
- functions: `netlify/functions`

### Health function

Локально через Netlify CLI:

```bash
npx netlify dev
```

Затем открой:

```text
http://localhost:8888/.netlify/functions/health
```

На production:

```text
https://<your-site>.netlify.app/.netlify/functions/health
```

### Env check function

```text
https://<your-site>.netlify.app/.netlify/functions/env-check
```

## Supabase

1. Создай новый Supabase project.
2. Выполни `supabase/migrations/202606050001_initial_schema.sql`.
3. Выполни `supabase/seed/202606050001_reference_seed.sql`.
4. Скопируй Project URL и anon key в `.env` и Netlify.

Подробнее: [docs/MANUAL_SETUP_SUPABASE.md](docs/MANUAL_SETUP_SUPABASE.md)

## Netlify setup

Подробная инструкция: [docs/MANUAL_SETUP_NETLIFY.md](docs/MANUAL_SETUP_NETLIFY.md)

## Что входит в scaffold-шаг

- React + Vite + TypeScript frontend
- базовый роутинг и placeholder-страницы
- UI-компоненты: Button, Card, Input, StatusBadge
- Supabase client setup с безопасным fallback
- SQL migration и seed
- Netlify config и functions (`health`, `env-check`)
- документация product scope и manual setup

## Структура проекта

```text
src/
  app/           — App shell и routes
  components/    — layout и ui
  lib/           — env, supabase client, types
  pages/         — страницы MVP
  styles/        — global.css
netlify/functions/
supabase/migrations/
supabase/seed/
docs/
```

## Product scope

См. [docs/PRODUCT_SCOPE.md](docs/PRODUCT_SCOPE.md)

## License

Private MVP scaffold.
