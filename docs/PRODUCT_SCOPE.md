# ScanTalent HR Core — Product Scope

## Продукт

**ScanTalent / Сканер талантов** — минимальный HR Core MVP для работы с кандидатом и его картой талантов.

## MVP-цепочка

```text
1 компания
→ 1 кандидат
→ расчёт карты кандидата
→ карта талантов кандидата
```

## Текущий scaffold-шаг

На этом этапе реализован только технический фундамент:

- React + Vite + TypeScript frontend shell
- базовый роутинг и placeholder-страницы
- Supabase client setup (без падения при отсутствии env)
- SQL migration и seed для Supabase
- Netlify-ready структура и serverless functions
- документация для ручной настройки Supabase и Netlify

## Что ещё не входит в этот шаг

- реальная авторизация и signup/login flow
- создание компании и кандидата из UI
- расчёт Human Design карты
- генерация послойных отчётов и итоговой карты талантов

## Цель следующего этапа

Подключить Supabase, создать первую компанию и первого кандидата, затем перейти к расчёту карты и сборке talent map.
