-- ScanTalent HR Core — reference seed
-- Run after initial_schema migration

insert into public.hr_layer_definitions (
  layer_key,
  layer_title,
  description,
  required_element_kinds,
  optional_element_kinds,
  ui_priority
) values
  (
    'work_mode_and_entry',
    'Рабочий формат и вход в задачи',
    'Как кандидат входит в работу, распределяет энергию и взаимодействует с задачами.',
    '["type", "profile", "authority"]'::jsonb,
    '["defined_centers", "channels"]'::jsonb,
    10
  ),
  (
    'decision_style',
    'Принятие решений',
    'Стиль принятия решений и внутренний ориентир кандидата.',
    '["authority", "type"]'::jsonb,
    '["profile"]'::jsonb,
    20
  ),
  (
    'main_talents',
    'Главные таланты',
    'Ключевые сильные стороны и природные способности кандидата.',
    '["type", "profile"]'::jsonb,
    '["gates", "channels", "defined_centers"]'::jsonb,
    30
  ),
  (
    'work_environment',
    'Рабочая среда',
    'Условия среды, в которых кандидат работает наиболее устойчиво.',
    '["environment"]'::jsonb,
    '["type", "profile"]'::jsonb,
    40
  ),
  (
    'communication',
    'Коммуникация',
    'Стиль коммуникации, взаимодействия и обратной связи.',
    '["type", "profile"]'::jsonb,
    '["channels", "gates"]'::jsonb,
    50
  ),
  (
    'risks',
    'Риски и чувствительные зоны',
    'Зоны перегруза, конфликта и типичных HR-рисков.',
    '["type", "authority"]'::jsonb,
    '["open_centers", "profile"]'::jsonb,
    60
  ),
  (
    'management',
    'Управление кандидатом',
    'Рекомендации по управлению, мотивации и поддержке.',
    '["type", "profile", "authority"]'::jsonb,
    '["environment"]'::jsonb,
    70
  ),
  (
    'development_potential',
    'Потенциал развития',
    'Направления роста и развития кандидата в рабочем контексте.',
    '["profile", "type"]'::jsonb,
    '["gates", "channels"]'::jsonb,
    80
  )
on conflict (layer_key) do update set
  layer_title = excluded.layer_title,
  description = excluded.description,
  required_element_kinds = excluded.required_element_kinds,
  optional_element_kinds = excluded.optional_element_kinds,
  ui_priority = excluded.ui_priority,
  updated_at = timezone('utc', now());

insert into public.hd_reference_interpretations (
  element_kind,
  element_key,
  element_label,
  language,
  version,
  classic_markdown,
  hr_translation_markdown,
  pro_markdown,
  talent_hints,
  risk_hints,
  management_hints,
  environment_hints,
  source_quality
) values
  (
    'type',
    'projector',
    'Проектор',
    'ru',
    'v1',
    'Draft: Human Design type Projector.',
    'HR draft: кандидат-проектор лучше раскрывается через приглашение и признание экспертизы.',
    null,
    '["видит систему", "направляет других"]'::jsonb,
    '["выгорание без признания"]'::jsonb,
    '["давать время на вход в задачу"]'::jsonb,
    '["спокойная среда без постоянного давления"]'::jsonb,
    'draft'
  ),
  (
    'type',
    'generator',
    'Генератор',
    'ru',
    'v1',
    'Draft: Human Design type Generator.',
    'HR draft: генератору важно откликаться на задачи и чувствовать внутренний отклик.',
    null,
    '["устойчивая рабочая энергия"]'::jsonb,
    '["фрустрация при неверных задачах"]'::jsonb,
    '["давать понятные задачи с откликом"]'::jsonb,
    '["среда с ясными приоритетами"]'::jsonb,
    'draft'
  ),
  (
    'type',
    'manifestor',
    'Манифестор',
    'ru',
    'v1',
    'Draft: Human Design type Manifestor.',
    'HR draft: манифестору нужна свобода инициировать и заранее информировать окружение.',
    null,
    '["инициатива", "запуск процессов"]'::jsonb,
    '["сопротивление при ограничениях"]'::jsonb,
    '["информировать до действия"]'::jsonb,
    '["пространство для самостоятельного старта"]'::jsonb,
    'draft'
  ),
  (
    'type',
    'manifesting_generator',
    'Манифестирующий генератор',
    'ru',
    'v1',
    'Draft: Human Design type Manifesting Generator.',
    'HR draft: МГ сочетает скорость и отклик, важно не перегружать многозадачностью.',
    null,
    '["скорость", "многозадачность"]'::jsonb,
    '["хаос при слишком многих направлениях"]'::jsonb,
    '["фокусировать на приоритетах"]'::jsonb,
    '["гибкая среда с выбором задач"]'::jsonb,
    'draft'
  ),
  (
    'type',
    'reflector',
    'Рефлектор',
    'ru',
    'v1',
    'Draft: Human Design type Reflector.',
    'HR draft: рефлектор чувствителен к среде и нуждается во времени на решения.',
    null,
    '["отражает состояние команды"]'::jsonb,
    '["нестабильность в токсичной среде"]'::jsonb,
    '["давать время на оценку ситуации"]'::jsonb,
    '["здоровая и честная рабочая среда"]'::jsonb,
    'draft'
  )
on conflict (element_kind, element_key, language, version) do update set
  element_label = excluded.element_label,
  classic_markdown = excluded.classic_markdown,
  hr_translation_markdown = excluded.hr_translation_markdown,
  talent_hints = excluded.talent_hints,
  risk_hints = excluded.risk_hints,
  management_hints = excluded.management_hints,
  environment_hints = excluded.environment_hints,
  source_quality = excluded.source_quality,
  updated_at = timezone('utc', now());
