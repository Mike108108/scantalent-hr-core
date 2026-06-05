# Ручная настройка Supabase

Пошаговая инструкция для первого запуска базы данных ScanTalent HR Core.

## Шаги

1. Открой [Supabase Dashboard](https://supabase.com/dashboard).
2. Создай **новый project**.
3. Дождись завершения инициализации проекта.
4. Открой **SQL Editor**.
5. Скопируй содержимое файла `supabase/migrations/202606050001_initial_schema.sql`.
6. Вставь в SQL Editor и нажми **Run**.
7. Затем скопируй содержимое `supabase/seed/202606050001_reference_seed.sql`.
8. Вставь в SQL Editor и снова нажми **Run**.
9. Открой **Project Settings → API**.
10. Скопируй **Project URL** и **anon public key**.

## Простые термины

### Migration

**Migration** — это SQL-скрипт, который создаёт структуру базы: таблицы, связи, индексы, политики доступа. Его нужно выполнить один раз при создании нового Supabase project.

### Seed

**Seed** — это стартовые данные для справочников. В ScanTalent seed добавляет слои отчётов (`hr_layer_definitions`) и черновые интерпретации Human Design типов.

### RLS

**RLS (Row Level Security)** — защита на уровне строк. В ScanTalent пользователь видит только данные своей компании, где `hr_companies.owner_user_id = auth.uid()`.

### Env variables

**Env variables** — переменные окружения с ключами и URL. Для frontend нужны:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Скопируй их в локальный `.env` (по образцу `.env.example`) и в Netlify Site settings.

## Проверка

После выполнения SQL в Table Editor должны появиться таблицы:

- `hr_companies`
- `hr_candidates`
- `hr_candidate_charts`
- `hr_candidate_chart_elements`
- `hd_reference_interpretations`
- `hr_layer_definitions`
- `hr_candidate_layer_reports`
- `hr_candidate_talent_maps`

В `hr_layer_definitions` должно быть 8 слоёв.
