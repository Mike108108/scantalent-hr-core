-- Stage 4-A: HD Reference Interpretations — context metadata, not-self, contrast examples
-- Run after 202606050001_initial_schema.sql

alter table public.hd_reference_interpretations
  add column if not exists base_layers jsonb not null default '{}'::jsonb;

alter table public.hd_reference_interpretations
  add column if not exists pro_layers jsonb not null default '{}'::jsonb;

alter table public.hd_reference_interpretations
  add column if not exists context_rules jsonb not null default '{}'::jsonb;

alter table public.hd_reference_interpretations
  add column if not exists not_self_layers jsonb not null default '{}'::jsonb;

alter table public.hd_reference_interpretations
  add column if not exists contrast_examples jsonb not null default '[]'::jsonb;

-- ---------------------------------------------------------------------------
-- Reference upserts for test-case chart elements (ru / v1)
-- ---------------------------------------------------------------------------

insert into public.hd_reference_interpretations (
  element_kind, element_key, element_label, language, version,
  classic_markdown, hr_translation_markdown, pro_markdown,
  talent_hints, risk_hints, management_hints, environment_hints, limitations,
  base_layers, pro_layers, context_rules, not_self_layers, contrast_examples,
  source_quality
) values

-- TYPE: projector
(
  'type', 'projector', 'Проектор', 'ru', 'v1',
  'Проектор — тип, который видит других и системы, но не генерирует постоянную рабочую энергию для «тащить всё самому». Классическая стратегия — ждать приглашения и признания, чтобы вклад был услышан и использован.',
  'Кандидат-проектор сильнее раскрывается, когда его экспертизу **приглашают** в задачу, а не когда его «вталкивают» в операционную нагрузку. В HR-контексте это профиль наставника, консультанта, координатора, архитектора процессов — человека, который улучшает работу других, а не заменяет всю команду собой.',
  'Human Design Type: **Projector**. Нет постоянного Sacral-отклика; энергия управляемая и направленная. Стратегия *Wait for the Invitation*; сигнатура — Success, несигнатура — Bitterness. Проектор считывает ауру других и видит, где система теряет эффективность.',
  '["системное видение", "направление людей и процессов", "глубокая экспертиза при правильном входе"]'::jsonb,
  '["выгорание при постоянной инициативе без приглашения", "обида, если советы игнорируют", "перегруз, если роль требует 8+ часов «генераторной» нагрузки"]'::jsonb,
  '["приглашать в проекты явно", "давать время на вход в контекст", "признавать вклад публично", "не требовать постоянного self-start без рамки"]'::jsonb,
  '["спокойный темп без хаотичных переключений", "культура уважения к экспертизе", "ясные роли и зоны ответственности"]'::jsonb,
  '["не подходит для роли единственного «движка» операционки без команды", "слабее в среде, где ценится только скорость реакции"]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Человек, который лучше всего помогает другим работать эффективнее, когда его зовут и слушают.',
    'work_manifestation', 'В работе проявляется как наблюдатель системы: замечает узкие места, предлагает улучшения, направляет команду. Сила раскрывается после того, как его включили в задачу осознанно.',
    'strengths', 'Видит людей и процессы; умеет направлять без лишнего давления; даёт точные рекомендации при достаточном контексте.',
    'risks', 'Пытается «тащить» всё сам; обижается, если советы не принимают; выгорает от роли постоянного исполнителя.',
    'when_it_works_best', 'Когда есть приглашение в проект, время на анализ и признание экспертного вклада.',
    'when_talent_is_not_revealed', 'Когда кандидата ставят в роль «делай сам, быстро, без объяснений» или игнорируют его обратную связь.'
  ),
  jsonb_build_object(
    'hd_meaning', 'Projector — аура фокусированная и проникающая; предназначен управлять, направлять и видеть других.',
    'mechanics', 'Отсутствие стабильного Sacral; решения и энергия не для непрерывного производства, а для корректного направления.',
    'classical_keywords', '["invitation", "recognition", "guidance", "success", "bitterness"]',
    'source_logic', 'Тип берётся из определённых центров и каналов карты; для Projector Sacral не определён.',
    'pro_not_self', 'Bitterness — когда действует без приглашения или не получает признания за вклад.'
  ),
  jsonb_build_object(
    'primary_context', '["strategy", "authority", "profile", "defined_centers", "open_centers"]',
    'secondary_context', '["channels", "gates"]',
    'depends_on', 'Стратегия приглашения и авторитет определяют, как проектор входит в задачи и принимает решения.',
    'related_element_kinds', '["strategy", "authority", "profile", "defined_center", "open_center", "channel"]',
    'context_note', 'Тип читается только вместе с тем, как человек входит в работу (стратегия) и как принимает решения (авторитет).'
  ),
  jsonb_build_object(
    'base', 'Искажение: человек берёт на себя чужую рабочую нагрузку и ждёт, что его «заметят сами».',
    'pro', 'Not-Self тема Projector — горечь (Bitterness) от непризнанного руководства и действий без приглашения.',
    'warning_signals', '["хроническая усталость при «нормальной» нагрузке", "раздражение, что «никто не слушает»", "попытки доказать ценность через переработки"]',
    'recovery_conditions', '["явное приглашение в зону ответственности", "снижение операционной нагрузки", "регулярная обратная связь о ценности вклада"]'
  ),
  jsonb_build_array(
    jsonb_build_object(
      'contrast_context', 'Роль генератора с постоянной операционной нагрузкой',
      'how_it_would_read', 'Тот же человек мог бы казаться «энергичным исполнителем», которому нужно много задач и быстрый отклик.',
      'why_current_context_is_different', 'В карте тип Projector — сила не в объёме действий, а в направлении и экспертизе по запросу.'
    )
  ),
  'draft'
),

-- STRATEGY: wait_for_the_invitation
(
  'strategy', 'wait_for_the_invitation', 'Wait for the Invitation', 'ru', 'v1',
  'Стратегия проектора: ждать приглашения — не пассивность, а ожидание правильного входа в значимые решения и роли.',
  'На практике это значит: перед тем как брать ключевую роль или навязывать решение, кандидату важно получить **явный запрос** от команды или руководителя. Без приглашения советы и инициатива часто воспринимаются как давление.',
  'Strategy: *Wait for the Invitation* — корректный вход в значимые взаимодействия для Projector. Приглашение может быть формальным (оффер, назначение) или неформальным (прямой запрос совета).',
  '["точный вход в задачи", "меньше сопротивления команды"]'::jsonb,
  '["фрустрация при самоназначении", "отвержение непрошеных советов"]'::jsonb,
  '["формулировать приглашения явно", "спрашивать: «нужен ли твой взгляд?»"]'::jsonb,
  '["культура запроса экспертизы", "не наказывать за ожидание сигнала"]'::jsonb,
  '[]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Лучше включаться в важные задачи, когда его явно попросили.',
    'work_manifestation', 'Сначала уточняет, нужен ли его вклад; после приглашения работает глубоко и адресно.',
    'strengths', 'Снижает конфликт; повышает принятие рекомендаций.',
    'risks', 'Может казаться «пассивным», если менеджер не понимает механику.',
    'when_it_works_best', 'Когда руководитель и команда привыкли запрашивать экспертизу.',
    'when_talent_is_not_revealed', 'Когда от человека ждут постоянной самоинициативы без рамки.'
  ),
  jsonb_build_object(
    'hd_meaning', 'Стратегия определяет корректный способ взаимодействия с миром для данного типа.',
    'mechanics', 'Для Projector приглашение открывает доступ к энергии взаимодействия и снижает несигнатуру.',
    'classical_keywords', '["invitation", "recognition"]',
    'source_logic', 'Стратегия выводится из типа карты.',
    'pro_not_self', 'Действие без приглашения ведёт к Bitterness.'
  ),
  jsonb_build_object(
    'primary_context', '["type"]',
    'secondary_context', '["authority", "profile"]',
    'depends_on', 'Стратегия всегда читается в паре с типом.',
    'related_element_kinds', '["type", "authority"]',
    'context_note', 'Приглашение — про значимые решения, не про бытовые мелочи.'
  ),
  jsonb_build_object(
    'base', 'Человек лезет с советами и решениями без запроса.',
    'pro', 'Нарушение стратегии Projector — классический путь в Not-Self.',
    'warning_signals', '["советы не слушают", "ощущение «меня обходят»"]',
    'recovery_conditions', '["договориться о формате приглашения", "снизить навязчивые инициативы"]'
  ),
  '[]'::jsonb,
  'draft'
),

-- AUTHORITY: splenic
(
  'authority', 'splenic', 'Splenic', 'ru', 'v1',
  'Спленический авторитет — мгновенное телесное «знаю / не знаю» в настоящем моменте. Решение нельзя долго обдумывать логикой — интуиция приходит и уходит быстро.',
  'В HR-контексте кандидат с таким авторитетом **лучше принимает решения сразу**, когда есть достаточно фактов «здесь и сейчас». Повторные «ночные обдумывания» часто уводят от верного ответа. Важно давать право сказать «нет» быстро, без давления «подумай ещё».',
  'Authority: **Splenic** — встроенная интуиция выживания и здоровья. Работает в моменте, не через эмоциональную волну и не через Sacral «да/нет».',
  '["быстрые точные решения в моменте", "чувство риска и несоответствия"]'::jsonb,
  '["сомнение после того, как момент прошёл", "давление «нужен ответ завтра» ломает механику"]'::jsonb,
  '["спрашивать мнение, когда человек в контексте", "не требовать долгих обдумываний", "уважать быстрое «нет»"]'::jsonb,
  '["возможность решать на встрече, а не асинхронно неделями"]'::jsonb,
  '["не идеален для ролей с искусственно затянутым циклом согласований"]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Решает интуитивно и быстро, пока «живёт» ситуация.',
    'work_manifestation', 'На интервью или в рабочем разговоре может сразу почувствовать, подходит ли задача, команда, условия.',
    'strengths', 'Острый риск-радар; быстрые решения без лишней бюрократии.',
    'risks', 'Потом сомневается; другие могут не доверять «мгновенным» ответам.',
    'when_it_works_best', 'Когда решение принимается в моменте присутствия и с полным контекстом.',
    'when_talent_is_not_revealed', 'Когда от человека требуют «вернуться с ответом через неделю» по важному вопросу.'
  ),
  jsonb_build_object(
    'hd_meaning', 'Splenic Authority — самый старый инстинктивный авторитет; связан с Spleen center.',
    'mechanics', 'Сигнал одноразовый и тихий; повторный анализ умом часто искажает.',
    'classical_keywords', '["intuition", "in the now", "survival awareness"]',
    'source_logic', 'Авторитет определяется определёнными центрами; здесь определён Spleen без эмоциональной волны.',
    'pro_not_self', 'Игнорирование мгновенного «нет» ведёт к здоровью и безопасности рискам.'
  ),
  jsonb_build_object(
    'primary_context', '["type", "defined_center"]',
    'secondary_context', '["channels", "gates"]',
    'depends_on', 'Наличие определённого Spleen center.',
    'related_element_kinds', '["type", "defined_center", "channel"]',
    'context_note', 'Спленический ответ нельзя «переспрашивать» тем же способом на следующий день.'
  ),
  jsonb_build_object(
    'base', 'Человек соглашается против внутреннего «нет», чтобы не обидеть.',
    'pro', 'Not-Self Splenic — жить в режиме, где интуиция систематически подавлена.',
    'warning_signals', '["частые болезни/стресс", "согласие с последующим сожалением"]',
    'recovery_conditions', '["право на мгновенный отказ", "решения в живом контакте с контекстом"]'
  ),
  jsonb_build_array(
    jsonb_build_object(
      'contrast_context', 'Эмоциональный авторитет с волной',
      'how_it_would_read', 'Решения требовали бы времени «проспать» и пережить эмоциональный цикл.',
      'why_current_context_is_different', 'Здесь Splenic — ответ в моменте, без волны.'
    )
  ),
  'draft'
),

-- PROFILE: 1/3
(
  'profile', '1/3', '1/3', 'ru', 'v1',
  'Профиль 1/3 — Исследователь / Мученик: сочетание глубины изучения и обучения через практический опыт и ошибки.',
  'В работе это человек, которому нужно **сначала разобраться в основах**, а затем проверить их на практике. Он надёжен, когда может учиться на реальных кейсах, а не только на теории. Ошибки — часть метода, а не «провал».',
  'Profile **1/3**: Line 1 (Investigator) + Line 3 (Martyr). Фундамент знаний + экспериментальный путь.',
  '["глубокое изучение темы", "практическая проверка гипотез", "устойчивость через опыт"]'::jsonb,
  '["страх ошибок в культуре «нельзя ошибаться»", "поверхностные процессы без права эксперимента"]'::jsonb,
  '["давать доступ к экспертам и материалам", "нормализовать итерации", "не наказывать за «неудачные» пробы"]'::jsonb,
  '["среда, где можно тестировать", "наставник для базы знаний"]'::jsonb,
  '[]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Сначала изучает фундамент, потом проверяет на практике.',
    'work_manifestation', 'Задаёт много уточняющих вопросов, строит собственную базу, затем пробует и корректирует.',
    'strengths', 'Глубина + реализм; умеет находить слабые места через опыт.',
    'risks', 'Может казаться «медленным» на старте; болезненно реагирует на публичные ошибки.',
    'when_it_works_best', 'Роли с обучением, R&D, улучшением процессов, пилотами.',
    'when_talent_is_not_revealed', 'Среда «делай с первого дня без права ошибиться».'
  ),
  jsonb_build_object(
    'hd_meaning', '1/3 — классический путь «фундамент + trial and error».',
    'mechanics', 'Линия 1 требует безопасной базы; линия 3 учится через столкновение с реальностью.',
    'classical_keywords', '["investigator", "martyr", "foundation", "trial and error"]',
    'source_logic', 'Профиль из Sun/Earth personality и design линий.',
    'pro_not_self', 'Страх эксперимента или отсутствие базы знаний.'
  ),
  jsonb_build_object(
    'primary_context', '["type", "authority"]',
    'secondary_context', '["definition", "channels"]',
    'depends_on', 'Профиль модифицирует проявление типа и авторитета.',
    'related_element_kinds', '["type", "authority", "definition"]',
    'context_note', '1/3 не «неуверенность», а метод познания.'
  ),
  jsonb_build_object(
    'base', 'Притворяется экспертом без базы или боится пробовать.',
    'pro', 'Not-Self 3-й линии — избегание эксперимента из-за стыда.',
    'warning_signals', '["скрывает ошибки", "не задаёт вопросов"]',
    'recovery_conditions', '["психологически безопасные пилоты", "доступ к наставникам"]'
  ),
  '[]'::jsonb,
  'draft'
),

-- DEFINITION: split_definition
(
  'definition', 'split_definition', 'Split Definition', 'ru', 'v1',
  'Split Definition — два отдельных энергетических «острова» в карте, между которыми нужен мост (часто через других людей или определённые темы).',
  'На работе человек может **ощущать разрыв** между разными ролями или стилями мышления. Ему полезны партнёры/команда, которые соединяют его «две части». Без моста — внутреннее напряжение и ощущение «я разный в разных контекстах».',
  'Definition: **Split** — два кластера определённости, не соединённые каналами в собственной карте.',
  '["гибкость между двумя режимами мышления", "ценен в паре с дополняющими людьми"]'::jsonb,
  '["ощущение «нецельности» в одиночку", "зависимость от «мостовых» тем"]'::jsonb,
  '["подбирать напарников/стейкхолдеров", "не требовать «одного универсального стиля»"]'::jsonb,
  '["командная работа", "понятные точки стыковки ролей"]'::jsonb,
  '[]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Две внутренние «части» требуют связки через людей или контекст.',
    'work_manifestation', 'Может блестяще переключаться между двумя доменами, но нуждается в связующем звене.',
    'strengths', 'Мультиконтекстность; ценен в кросс-функциональных задачах.',
    'risks', 'Нерешительность без внешнего моста; зависимость от «правильного» партнёра.',
    'when_it_works_best', 'Парная работа, менторство, проекты с явным стыком функций.',
    'when_talent_is_not_revealed', 'Изолированная роль без связи с остальной системой.'
  ),
  jsonb_build_object(
    'hd_meaning', 'Split Definition — два defined areas без собственного канала между ними.',
    'mechanics', 'Тема моста часто приходит через транзиты или ауры других людей.',
    'classical_keywords', '["bridge", "split", "connection theme"]',
    'source_logic', 'Определяется топологией defined centers и channels.',
    'pro_not_self', 'Попытка «быть цельным» без признания split.'
  ),
  jsonb_build_object(
    'primary_context', '["type", "defined_center", "channel"]',
    'secondary_context', '["profile"]',
    'depends_on', 'Какие центры и каналы образуют два кластера.',
    'related_element_kinds', '["defined_center", "channel"]',
    'context_note', 'Мост — не слабость, а механика карты.'
  ),
  jsonb_build_object(
    'base', 'Требует от себя универсальности без опоры на команду.',
    'pro', 'Not-Self split — игнорирование темы моста.',
    'warning_signals', '["внутренний разрыв", "зависимость от одного человека"]',
    'recovery_conditions', '["осознанный подбор мостов", "кросс-функциональные связи"]'
  ),
  '[]'::jsonb,
  'draft'
)

on conflict (element_kind, element_key, language, version) do update set
  element_label = excluded.element_label,
  classic_markdown = excluded.classic_markdown,
  hr_translation_markdown = excluded.hr_translation_markdown,
  pro_markdown = excluded.pro_markdown,
  talent_hints = excluded.talent_hints,
  risk_hints = excluded.risk_hints,
  management_hints = excluded.management_hints,
  environment_hints = excluded.environment_hints,
  limitations = excluded.limitations,
  base_layers = excluded.base_layers,
  pro_layers = excluded.pro_layers,
  context_rules = excluded.context_rules,
  not_self_layers = excluded.not_self_layers,
  contrast_examples = excluded.contrast_examples,
  source_quality = excluded.source_quality,
  updated_at = timezone('utc', now());

-- Defined centers
insert into public.hd_reference_interpretations (
  element_kind, element_key, element_label, language, version,
  classic_markdown, hr_translation_markdown, pro_markdown,
  talent_hints, risk_hints, management_hints, environment_hints, limitations,
  base_layers, pro_layers, context_rules, not_self_layers, contrast_examples,
  source_quality
) values

('defined_center', 'ajna', 'Ajna', 'ru', 'v1',
 'Определённый Ajna — фиксированный способ обрабатывать информацию и формировать мнения.',
 'Кандидат **уверен в своём способе думать** и может быть ценным аналитиком, методологом, архитектором идей. Ему сложнее принимать чужие «рамки мышления» без проверки.',
 'Defined **Ajna** — стабильный mental processing; не открыт для чужих мнений как open Ajna.',
 '["концептуальная ясность", "устойчивые взгляды"]'::jsonb,
 '["упрямство в позиции", "споры «чьё видение правильное»"]'::jsonb,
 '["давать автономию в анализе", "не ломать рамку без причины"]'::jsonb,
 '["время на обдумывание", "уважение к методологии"]'::jsonb,
 '[]'::jsonb,
 jsonb_build_object('plain_meaning', 'Стабильный стиль мышления и формирования мнений.', 'work_manifestation', 'Даёт структурированные концепции и держит линию аргументации.', 'strengths', 'Последовательность в анализе.', 'risks', 'Сложно менять угол без новых фактов.', 'when_it_works_best', 'Роли с концептом и стратегией.', 'when_talent_is_not_revealed', 'Среда, где мнение постоянно обесценивают.'),
 jsonb_build_object('hd_meaning', 'Defined Ajna — фиксированная mental awareness.', 'mechanics', 'Не усиливается чужими мнениями как open.', 'classical_keywords', '["certainty", "conceptual mind"]', 'source_logic', 'Ajna в defined centers.', 'pro_not_self', 'Догматизм ради уверенности.'),
 jsonb_build_object('primary_context', '["type", "channels"]', 'secondary_context', '["gates"]', 'depends_on', 'Связанные каналы и ворота Ajna.', 'related_element_kinds', '["channel", "gate"]', 'context_note', 'Читается с каналом 11-56 при наличии.'),
 jsonb_build_object('base', 'Цепляется за мнение, чтобы не потерять опору.', 'pro', 'Fixed mind Not-Self.', 'warning_signals', '["споры ради споров"]', 'recovery_conditions', '["факты вместо давления"]'),
 '[]'::jsonb, 'draft'),

('defined_center', 'throat', 'Throat', 'ru', 'v1',
 'Определённый Throat — надёжная способность к выражению, коммуникации и материализации через слово/действие.',
 'В HR-языке: человек **уверенно доносит мысли**, может представлять команду, вести переговоры, формулировать решения. Важно не перегружать бесконечными публичными выступлениями без подготовки — но сам канал выражения стабилен.',
 'Defined **Throat** — motor или manifestation hub в зависимости от подключений; здесь стабильный доступ к expression.',
 '["ясная коммуникация", "способность доводить до слова/действия", "презентация идей"]'::jsonb,
 '["говорит, когда лучше слушать", "перегруз от постоянных выступлений"]'::jsonb,
 '["давать роли с коммуникацией", "готовить ключевые выступления", "не требовать «молчи всегда»"]'::jsonb,
 '["форумы для высказывания", "структурированные встречи"]'::jsonb,
 '[]'::jsonb,
 jsonb_build_object(
   'plain_meaning', 'Стабильно выражает мысли и доводит их до видимого результата.',
   'work_manifestation', 'Может быть голосом проекта: формулирует, презентует, фиксирует договорённости.',
   'strengths', 'Ясная речь; умение «материализовать» решения в словах и действиях.',
   'risks', 'Доминирует в разговоре; усталость от роли постоянного спикера.',
   'when_it_works_best', 'Роли с коммуникацией, фасилитацией, переговорами, продуктовым storytelling.',
   'when_talent_is_not_revealed', 'Культура «нельзя говорить» или вечные письменные цепочки без живого диалога.'
 ),
 jsonb_build_object(
   'hd_meaning', 'Throat — центр manifestation и expression; defined даёт постоянный доступ.',
   'mechanics', 'Связан с каналами к Throat (например 11-56 Curiosity).',
   'classical_keywords', '["expression", "manifestation", "communication"]',
   'source_logic', 'Throat в defined centers + связанные gates/channels.',
   'pro_not_self', 'Говорит, чтобы сбросить давление, а не по смыслу.'
 ),
 jsonb_build_object(
   'primary_context', '["type", "channel", "gate"]',
   'secondary_context', '["profile"]',
   'depends_on', 'Какие каналы подключены к Throat.',
   'related_element_kinds', '["channel", "gate", "type"]',
   'context_note', 'С defined Throat коммуникация — опора, не уязвимость.'
 ),
 jsonb_build_object(
   'base', 'Говорит без запроса, заполняет тишину тревогой.',
   'pro', 'Not-Self Throat — лишние слова как разрядка.',
   'warning_signals', '["монологи", "усталость голоса/присутствия"]',
   'recovery_conditions', '["ритм выступлений", "роли слушания"]'
 ),
 jsonb_build_array(
   jsonb_build_object(
     'contrast_context', 'Открытый Throat',
     'how_it_would_read', 'Человек подстраивал бы стиль речи под аудиторию и говорил бы «в моменте».',
     'why_current_context_is_different', 'Defined Throat даёт устойчивый собственный голос.'
   )
 ),
 'draft'),

('defined_center', 'spleen', 'Spleen', 'ru', 'v1',
 'Определённый Spleen — встроенная интуиция, иммунитет к «не своему» и чувство момента.',
 'Кандидат **быстро чувствует, что здорово/нездорово** в задаче, команде, условиях. Сильный внутренний радар риска. В паре со Splenic authority это усиливает мгновенные решения «да/нет».',
 'Defined **Spleen** — splenic awareness, survival intelligence, immune system to environment.',
 '["интуитивный риск-радар", "здоровые границы", "мгновенная оценка ситуации"]'::jsonb,
 '["тревога, если сигнал игнорируют", "резкие «нет» без объяснений"]'::jsonb,
 '["доверять быстрым сигналам", "не давить после «нет»", "давать контекст до решения"]'::jsonb,
 '["безопасная среда", "честные условия без скрытых ожиданий"]'::jsonb,
 '[]'::jsonb,
 jsonb_build_object(
   'plain_meaning', 'Встроенное чувство «так безопасно / так нет» в моменте.',
   'work_manifestation', 'Может остановить рискованный проект, почувствовать несоответствие кандидата роли, уловить токсичную динамику.',
   'strengths', 'Защита команды от слепых зон; быстрые интуитивные решения.',
   'risks', 'Другие не понимают «откуда знание»; может казаться категоричным.',
   'when_it_works_best', 'Роли с оценкой рисков, due diligence, подбор людей, охрана качества.',
   'when_talent_is_not_revealed', 'Когда интуицию обесценивают в пользу «только цифры».'
 ),
 jsonb_build_object(
   'hd_meaning', 'Spleen — oldest awareness center; splenic hits are quiet and instant.',
   'mechanics', 'Связан с каналами 18-58, 28-38 при их наличии; поддерживает Splenic authority.',
   'classical_keywords', '["intuition", "immune system", "in the now"]',
   'source_logic', 'Spleen defined + authority Splenic.',
   'pro_not_self', 'Жить в страхе вместо доверия телесному сигналу.'
 ),
 jsonb_build_object(
   'primary_context', '["authority", "channel"]',
   'secondary_context', '["type", "gate"]',
   'depends_on', 'Splenic authority и каналы через Spleen.',
   'related_element_kinds', '["authority", "channel", "gate"]',
   'context_note', 'Спленический сигнал не повторяется — важен первый отклик.'
 ),
 jsonb_build_object(
   'base', 'Игнорирует тревогу и идёт «через силу».',
   'pro', 'Not-Self Spleen — хронический страх и небезопасность.',
   'warning_signals', '["частые болезни", "согласие вопреки телу"]',
   'recovery_conditions', '["уважение к «нет»", "снижение токсичной нагрузки"]'
 ),
 jsonb_build_array(
   jsonb_build_object(
     'contrast_context', 'Открытый Spleen',
     'how_it_would_read', 'Человек брал бы чужие страхи и нуждался бы в стабильной среде для уверенности.',
     'why_current_context_is_different', 'Defined Spleen несёт собственный иммунитет к риску.'
   )
 ),
 'draft'),

('defined_center', 'root', 'Root', 'ru', 'v1',
 'Определённый Root — свой ритм давления и стресса, способность обрабатывать adrenalin по-своему.',
 'Человек **не зависит от внешнего давления** так же сильно, как с открытым Root, и может задавать собственный темп срочности. Полезен в проектах с дедлайнами, если уважать его ритм.',
 'Defined **Root** — pressure center; стабильный доступ к stress/adrenaline fuel.',
 '["свой темп срочности", "устойчивость к давлению"]'::jsonb,
 '["создаёт давление для других", "несовпадение темпа с командой"]'::jsonb,
 '["согласовывать дедлайны", "не навешивать чужой адреналин"]'::jsonb,
 '["реалистичные сроки"]'::jsonb,
 '[]'::jsonb,
 jsonb_build_object('plain_meaning', 'Свой источник «драйва» и давления.', 'work_manifestation', 'Может ускорять или замедлять темп осознанно.', 'strengths', 'Не срывается от чужой срочности.', 'risks', 'Давит на окружение.', 'when_it_works_best', 'Проекты с ясными дедлайнами.', 'when_talent_is_not_revealed', 'Хаотичная срочность без приоритетов.'),
 jsonb_build_object('hd_meaning', 'Root motor of pressure.', 'mechanics', 'Связан с каналами 18-58, 28-38 к Root.', 'classical_keywords', '["pressure", "adrenaline", "drive"]', 'source_logic', 'Root в defined.', 'pro_not_self', 'Гонка ради сброса давления.'),
 jsonb_build_object('primary_context', '["channel"]', 'secondary_context', '["type"]', 'depends_on', 'Каналы к Root.', 'related_element_kinds', '["channel"]', 'context_note', 'Root задаёт fuel, не мотивацию смыслом.'),
 jsonb_build_object('base', 'Живёт в постоянной гонке.', 'pro', 'Root Not-Self — адреналиновая зависимость.', 'warning_signals', '["выгорание на адреналине"]', 'recovery_conditions', '["паузы", "приоритизация"]'),
 '[]'::jsonb, 'draft')

on conflict (element_kind, element_key, language, version) do update set
  element_label = excluded.element_label,
  classic_markdown = excluded.classic_markdown,
  hr_translation_markdown = excluded.hr_translation_markdown,
  pro_markdown = excluded.pro_markdown,
  talent_hints = excluded.talent_hints,
  risk_hints = excluded.risk_hints,
  management_hints = excluded.management_hints,
  environment_hints = excluded.environment_hints,
  limitations = excluded.limitations,
  base_layers = excluded.base_layers,
  pro_layers = excluded.pro_layers,
  context_rules = excluded.context_rules,
  not_self_layers = excluded.not_self_layers,
  contrast_examples = excluded.contrast_examples,
  source_quality = excluded.source_quality,
  updated_at = timezone('utc', now());

-- Open centers
insert into public.hd_reference_interpretations (
  element_kind, element_key, element_label, language, version,
  classic_markdown, hr_translation_markdown, pro_markdown,
  talent_hints, risk_hints, management_hints, environment_hints, limitations,
  base_layers, pro_layers, context_rules, not_self_layers, contrast_examples,
  source_quality
) values

('open_center', 'head', 'Head', 'ru', 'v1',
 'Открытый Head — вдохновение и вопросы приходят извне; человек усиливает чужие идеи и мысли.',
 'Кандидат **хорошо чувствует, какие вопросы важны команде**, но может перегружаться чужими «надо подумать». Нужны фильтры приоритетов и право не отвечать на все вопросы сразу.',
 'Open **Head** — не фиксированный источник inspiration/mental pressure.',
 '["чувствует важные вопросы команды", "гибкое мышление"]'::jsonb,
 '["перегруз вопросами", "тревога «не знаю ответ»"]'::jsonb,
 '["фильтровать входящие запросы", "не требовать постоянных инсайтов"]'::jsonb,
 '["спокойный information diet"]'::jsonb,
 '[]'::jsonb,
 jsonb_build_object('plain_meaning', 'Вдохновляется вопросами других, не генерирует давление «думать» сам.', 'work_manifestation', 'Может быть отличным sounding board, если не давить.', 'strengths', 'Гибкость ума.', 'risks', 'Ментальная усталость.', 'when_it_works_best', 'Brainstorm с рамкой.', 'when_talent_is_not_revealed', 'Бесконечные «придумай идею сейчас».'),
 jsonb_build_object('hd_meaning', 'Open Head amplifies others'' inspiration.', 'mechanics', 'Не свой генератор вопросов.', 'classical_keywords', '["inspiration", "questions"]', 'source_logic', 'Head не в defined.', 'pro_not_self', 'Погоня за чужими вопросами.'),
 jsonb_build_object('primary_context', '["type"]', 'secondary_context', '[]', 'depends_on', 'Тип и нагрузка вопросами.', 'related_element_kinds', '["type"]', 'context_note', 'Open Head ≠ глупость.'),
 jsonb_build_object('base', 'Берёт на себя все вопросы команды.', 'pro', 'Mental anxiety.', 'warning_signals', '["бессонница от мыслей"]', 'recovery_conditions', '["лимиты на входящие"]'),
 '[]'::jsonb, 'draft'),

('open_center', 'g', 'G', 'ru', 'v1',
 'Открытый G — гибкость в идентичности и направлении; человек чувствует «куда идёт» команда/проект.',
 'В работе может **адаптироваться к культуре**, но рискует потерять свой вектор, если окружение хаотично. Полезен в ролях, где важна чуткость к миссии организации.',
 'Open **G** (Identity) — не фиксированный вектор love/direction.',
 '["чувствует культуру и направление", "адаптивность"]'::jsonb,
 '["потеря своего вектора", "привязанность к «не своим» целям"]'::jsonb,
 '["ясная миссия компании", "регулярная сверка целей"]'::jsonb,
 '["стабильные ценности организации"]'::jsonb,
 '[]'::jsonb,
 jsonb_build_object('plain_meaning', 'Гибко чувствует направление, но не держит его жёстко сам.', 'work_manifestation', 'Может быть «барометром» культуры.', 'strengths', 'Адаптация.', 'risks', 'Дрейф идентичности.', 'when_it_works_best', 'Чёткая миссия.', 'when_talent_is_not_revealed', 'Хаотичные смены стратегии.'),
 jsonb_build_object('hd_meaning', 'Open G — sampling identity/direction.', 'mechanics', 'Усиливает окружение.', 'classical_keywords', '["direction", "identity"]', 'source_logic', 'G не defined.', 'pro_not_self', 'Ложная идентичность.'),
 jsonb_build_object('primary_context', '["type"]', 'secondary_context', '[]', 'depends_on', 'Культура компании.', 'related_element_kinds', '["type"]', 'context_note', 'Нужна внешняя опора направления.'),
 jsonb_build_object('base', 'Цепляется за чужую миссию как свою.', 'pro', 'Lost direction.', 'warning_signals', '["«не знаю, кто я в работе»"]', 'recovery_conditions', '["личные KPI", "наставник"]'),
 '[]'::jsonb, 'draft'),

('open_center', 'ego', 'Ego', 'ru', 'v1',
 'Открытый Ego/Heart — нестабильная самооценка воли и обещаний; человек чувствует, «кто что может пообещать».',
 'На работе может **переоценивать или недооценивать свои обязательства**, стараясь доказать ценность. Важно не давить KPI «докажи, что ты лучший» и давать реалистичные обещания.',
 'Open **Ego/Heart/Will** — не фиксированный willpower/self-worth.',
 '["чувствует амбиции команды", "гибкость в переговорах о ресурсах"]'::jsonb,
 '["обещает больше, чем может", "выгорание от доказательств"]'::jsonb,
 '["реалистичные цели", "признание без соревнования воли"]'::jsonb,
 '["культура без токсичного heroism"]'::jsonb,
 '[]'::jsonb,
 jsonb_build_object('plain_meaning', 'Самооценка и обещания зависят от контекста и давления.', 'work_manifestation', 'Может брать лишнее, чтобы заслужить уважение.', 'strengths', 'Чуткость к ожиданиям.', 'risks', 'Переобещание.', 'when_it_works_best', 'Поддерживающая культура.', 'when_talent_is_not_revealed', 'Культура «докажи или уйди».'),
 jsonb_build_object('hd_meaning', 'Open Heart — нет постоянного will.', 'mechanics', 'Усиливает чужие обещания.', 'classical_keywords', '["will", "worth"]', 'source_logic', 'Ego не defined.', 'pro_not_self', 'Доказательство ценности.'),
 jsonb_build_object('primary_context', '["type"]', 'secondary_context', '[]', 'depends_on', 'Давление KPI.', 'related_element_kinds', '["type"]', 'context_note', 'Open Ego чувствителен к сравнению.'),
 jsonb_build_object('base', 'Обещает ради одобрения.', 'pro', 'Worthlessness.', 'warning_signals', '["невыполненные обещания"]', 'recovery_conditions', '["реалистичные коммиты"]'),
 '[]'::jsonb, 'draft'),

('open_center', 'solar_plexus', 'Solar Plexus', 'ru', 'v1',
 'Открытый Solar Plexus — эмоциональная чувствительность к настроению команды; нет своей волны.',
 'Кандидат **тонко читает эмоциональный фон**, но может путать чужие эмоции со своими. Нужны границы и спокойная обратная связь.',
 'Open **Solar Plexus** — emotional amplification, нет собственной emotional wave для authority.',
 '["эмпатия", "чтение атмосферы"]'::jsonb,
 '["эмоциональное выгорание", "избегание конфликтов"]'::jsonb,
 '["прямая но спокойная обратная связь", "границы после тяжёлых встреч"]'::jsonb,
 '["эмоционально зрелая команда"]'::jsonb,
 '[]'::jsonb,
 jsonb_build_object('plain_meaning', 'Усиливает эмоции окружения, сам не несёт волну.', 'work_manifestation', 'Может быть «барометром» команды.', 'strengths', 'Эмпатия.', 'risks', 'Переполнение чужими эмоциями.', 'when_it_works_best', 'Здоровая культура.', 'when_talent_is_not_revealed', 'Токсичные эмоциональные качели.'),
 jsonb_build_object('hd_meaning', 'Open Solar Plexus — не emotional authority.', 'mechanics', 'Amplifies feelings.', 'classical_keywords', '["empathy", "wave"]', 'source_logic', 'Solar Plexus open.', 'pro_not_self', 'Избегание правды ради мира.'),
 jsonb_build_object('primary_context', '["type", "authority"]', 'secondary_context', '[]', 'depends_on', 'Splenic authority — нет своей волны.', 'related_element_kinds', '["authority"]', 'context_note', 'Чужие эмоции не «его правда».'),
 jsonb_build_object('base', 'Подавляет правду, лишь бы не злить.', 'pro', 'People-pleasing.', 'warning_signals', '["усталость после встреч"]', 'recovery_conditions', '["дебриф", "границы"]'),
 '[]'::jsonb, 'draft'),

('open_center', 'sacral', 'Sacral', 'ru', 'v1',
 'Открытый Sacral — нет постоянного генератора рабочей энергии; человек не предназначен «тащить» 8+ часов на чистом отклике.',
 'Критично для HR: **не ставить в чисто генераторную нагрузку** без пауз, делегирования и смысла. Энергия берётся из интереса, среды и правильного входа (для проектора — через приглашение), а не из бесконечного «делай-делай».',
 'Open **Sacral** — нет sustainable life-force response; типично для Projector.',
 '["гибкость", "чувствует энергию команды", "не перегружает операционку естественно"]'::jsonb,
 '["выгорание при генераторном графике", "чувство «я ленивый» в неправильной роли"]'::jsonb,
 '["роли без 10ч операционки", "паузы", "приглашение в задачи"]'::jsonb,
 '["спокойный темп", "уважение к типу"]'::jsonb,
 '["не для роли «единственный исполнитель на потоке»"]'::jsonb,
 jsonb_build_object(
   'plain_meaning', 'Нет бесконечного «рабочего мотора» — энергия управляемая и контекстная.',
   'work_manifestation', 'Может работать интенсивно короткими циклами, но не как генератор 5/2 без остановки.',
   'strengths', 'Не создаёт ложных ожиданий «всегда включён»; лучше чувствует перегруз команды.',
   'risks', 'Берёт на себя генераторный график и ломается; стыд за «мало энергии».',
   'when_it_works_best', 'Экспертные, проектные, фасилитационные роли с ясными границами.',
   'when_talent_is_not_revealed', 'Роль «делай руками весь день без делегирования».'
 ),
 jsonb_build_object(
   'hd_meaning', 'Open Sacral — не Generator/MG motor; усиливает чужую Sacral энергию.',
   'mechanics', 'Projector с open Sacral — классическая связка; стратегия приглашения компенсирует отсутствие motor.',
   'classical_keywords', '["no sustainable work energy", "amplified sacral"]',
   'source_logic', 'Sacral не в defined; тип Projector.',
   'pro_not_self', 'Пытаться «успевать как генератор».'
 ),
 jsonb_build_object(
   'primary_context', '["type", "strategy"]',
   'secondary_context', '["authority"]',
   'depends_on', 'Тип Projector + стратегия приглашения.',
   'related_element_kinds', '["type", "strategy"]',
   'context_note', 'Open Sacral у проектора — норма, не дефект.'
 ),
 jsonb_build_object(
   'base', 'Доказывает ценность бесконечной работой.',
   'pro', 'Exhaustion from mimicking Generator.',
   'warning_signals', '["хроническая усталость", "нет восстановления"]',
   'recovery_conditions', '["снижение часов операционки", "делегирование", "приглашения"]'
 ),
 jsonb_build_array(
   jsonb_build_object(
     'contrast_context', 'Defined Sacral (Генератор)',
     'how_it_would_read', 'Человек мог бы стабильно работать долгими сессиями с внутренним откликом.',
     'why_current_context_is_different', 'Open Sacral + Projector — сила в направлении, не в объёме моторной энергии.'
   )
 ),
 'draft')

on conflict (element_kind, element_key, language, version) do update set
  element_label = excluded.element_label,
  classic_markdown = excluded.classic_markdown,
  hr_translation_markdown = excluded.hr_translation_markdown,
  pro_markdown = excluded.pro_markdown,
  talent_hints = excluded.talent_hints,
  risk_hints = excluded.risk_hints,
  management_hints = excluded.management_hints,
  environment_hints = excluded.environment_hints,
  limitations = excluded.limitations,
  base_layers = excluded.base_layers,
  pro_layers = excluded.pro_layers,
  context_rules = excluded.context_rules,
  not_self_layers = excluded.not_self_layers,
  contrast_examples = excluded.contrast_examples,
  source_quality = excluded.source_quality,
  updated_at = timezone('utc', now());

-- Channels
insert into public.hd_reference_interpretations (
  element_kind, element_key, element_label, language, version,
  classic_markdown, hr_translation_markdown, pro_markdown,
  talent_hints, risk_hints, management_hints, environment_hints, limitations,
  base_layers, pro_layers, context_rules, not_self_layers, contrast_examples,
  source_quality
) values

('channel', '11-56', '11-56', 'ru', 'v1',
 'Канал 11-56 (Curiosity) — любознательность и умение превращать идеи в истории, понятные другим.',
 'В HR-языке: сильный **исследователь-коммуникатор**. Человек копает в тему и может донести смысл до команды, клиента, стейкхолдеров. Хорош в обучении, контенте, продуктовых объяснениях.',
 'Channel **11-56** Ajna–Throat: Gate 11 Ideas + Gate 56 Stimulation/Storytelling.',
 '["любознательность", "сторителлинг", "обучение через истории"]'::jsonb,
 '["распыление на слишком много тем", "говорит красиво без глубины (если нет 1-й линии)"]'::jsonb,
 '["давать роли исследования + презентации", "фокусировать темы"]'::jsonb,
 '["аудитория, которая слушает", "время на подготовку истории"]'::jsonb,
 '[]'::jsonb,
 jsonb_build_object(
   'plain_meaning', 'Соединяет глубокий интерес к идеям с даром рассказать их другим.',
   'work_manifestation', 'Может исследовать продукт/рынок и упаковать выводы в понятный нарратив для команды.',
   'strengths', 'Обучение; презентации; перевод сложного в простое.',
   'risks', 'Много начатых тем; поверхностный блеск без проверки.',
   'when_it_works_best', 'Продукт, маркетинг, обучение, аналитика с презентацией.',
   'when_talent_is_not_revealed', 'Роль «только таблицы без права говорить».'
 ),
 jsonb_build_object(
   'hd_meaning', 'Curiosity channel — fixed way of conceptualizing and expressing.',
   'mechanics', 'Defined Ajna + defined Throat через 11 и 56.',
   'classical_keywords', '["curiosity", "ideas", "stimulation", "storyteller"]',
   'source_logic', 'Оба gate активны, канал соединяет Ajna и Throat.',
   'pro_not_self', 'Болтовня без смысла ради внимания.'
 ),
 jsonb_build_object(
   'primary_context', '["defined_center", "gate"]',
   'secondary_context', '["type", "profile"]',
   'depends_on', 'Defined Ajna и Throat; ворота 11 и 56.',
   'related_element_kinds', '["defined_center", "gate", "type"]',
   'context_note', 'Усиливается профилем 1/3 через глубину и проверку.'
 ),
 jsonb_build_object(
   'base', 'Говорит, чтобы быть интересным, а не чтобы передать смысл.',
   'pro', 'Throat-Ajna Not-Self — пустая стимуляция.',
   'warning_signals', '["много слов, мало результата"]',
   'recovery_conditions', '["фокус тем", "проверка фактов"]'
 ),
 jsonb_build_array(
   jsonb_build_object(
     'contrast_context', 'Без канала 11-56',
     'how_it_would_read', 'Идеи могли бы оставаться внутренними без стабильного выхода в коммуникацию.',
     'why_current_context_is_different', 'Канал даёт постоянный мост «идея → слово».'
   )
 ),
 'draft'),

('channel', '18-58', '18-58', 'ru', 'v1',
 'Канал 18-58 (Judgment) — способность видеть, что не совершенно, и давить на улучшение до рабочего результата.',
 'В работе это **сильный аудитор качества и процессов**: замечает слабые места, предлагает доработки, доводит до «можно жить». Риск — излишняя критичность, если нет культуры улучшений.',
 'Channel **18-58** Spleen–Root: Gate 18 Correction + Gate 58 Vitality/Joy of improvement.',
 '["критическое мышление к качеству", "драйв улучшений", "устойчивость к «неидеальному» через доработку"]'::jsonb,
 '["воспринимается как «вечно недовольный»", "давление на команду"]'::jsonb,
 '["роли QA, процессов, аудита", "канал обратной связи «критика → улучшение»"]'::jsonb,
 '["культура continuous improvement", "не наказывать за замечания"]'::jsonb,
 '["слабее там, где «и так сойдёт» — будет конфликт ценностей"]'::jsonb,
 jsonb_build_object(
   'plain_meaning', 'Видит изъяны и мотивирован их исправлять до рабочего уровня.',
   'work_manifestation', 'Может вести ретроспективы, код-ревью, аудит процессов, чек-листы качества.',
   'strengths', 'Высокий стандарт; системное улучшение; выносливость в доработках.',
   'risks', 'Тонкая грань между «улучшаю» и «критикую людей».',
   'when_it_works_best', 'Инженерная культура, продуктовые итерации, compliance.',
   'when_talent_is_not_revealed', 'Среда, где ошибки скрывают и наказывают за вскрытие.'
 ),
 jsonb_build_object(
   'hd_meaning', 'Channel of Judgment — splenic correction meets root joy of struggle to perfect.',
   'mechanics', 'Связывает defined Spleen и Root; усиливает Splenic authority в оценке «что не так».',
   'classical_keywords', '["correction", "judgment", "vitality", "improvement"]',
   'source_logic', 'Gates 18 и 58; центры Spleen и Root.',
   'pro_not_self', 'Критика ради сброса давления Root.'
 ),
 jsonb_build_object(
   'primary_context', '["defined_center", "authority", "gate"]',
   'secondary_context', '["type"]',
   'depends_on', 'Defined Spleen + Root; splenic hits по качеству.',
   'related_element_kinds', '["defined_center", "gate", "authority"]',
   'context_note', 'Читается с авторитетом Splenic — «нет» по качеству мгновенно.'
 ),
 jsonb_build_object(
   'base', 'Критикует людей вместо систем.',
   'pro', 'Bitter judgment — Not-Self 18.',
   'warning_signals', '["команда избегает обратной связи"]',
   'recovery_conditions', '["правила feedback", "фокус на процесс"]'
 ),
 jsonb_build_array(
   jsonb_build_object(
     'contrast_context', 'Культура «не трогай, лишь бы работало»',
     'how_it_would_read', 'Талант мог бы восприниматься как «токсичная придирчивость».',
     'why_current_context_is_different', 'В зрелой CI-культуре это ключевой талант качества.'
   )
 ),
 'draft'),

('channel', '28-38', '28-38', 'ru', 'v1',
 'Канал 28-38 (Struggle) — поиск смысла через борьбу за ценное; готовность идти в трудный путь ради важного.',
 'HR-перевод: человек **не боится сложных задач**, если видит смысл. Может тянуть «тяжёлые» инициативы, спасать провальные проекты, идти до конца. Риск — борьба ради борьбы без цели.',
 'Channel **28-38** Spleen–Root: Gate 28 Player/Struggle + Gate 38 Fighter/Opposition.',
 '["упорство", "поиск смысла", "готовность к сложным боям"]'::jsonb,
 '["выгорание в бессмысленных войнах", "конфликтность"]'::jsonb,
 '["объяснять «зачем» борьба", "не давать бессмысленных крестов"]'::jsonb,
 '["проекты со смыслом", "честные ставки"]'::jsonb,
 '["может конфликтовать в политизированных средах"]'::jsonb,
 jsonb_build_object(
   'plain_meaning', 'Борется за то, что считает по-настоящему важным.',
   'work_manifestation', 'Может вести turnaround, сложные переговоры, защищать непопулярные, но нужные решения.',
   'strengths', 'Стойкость; смысловая мотивация; смелость.',
   'risks', 'Ввязывается в чужие битвы; истощение без победы.',
   'when_it_works_best', 'Миссионерские проекты, кризис-менеджмент со смыслом.',
   'when_talent_is_not_revealed', 'Поручают «воевать» без объяснения ценности.'
 ),
 jsonb_build_object(
   'hd_meaning', 'Channel of Struggle — finding purpose through fight.',
   'mechanics', 'Root pressure + Spleen intuition о ценности борьбы.',
   'classical_keywords', '["struggle", "purpose", "fighter", "opposition"]',
   'source_logic', 'Gates 28 и 38 между Spleen и Root.',
   'pro_not_self', 'Борьба из Root pressure без splenic «стоит ли».'
 ),
 jsonb_build_object(
   'primary_context', '["defined_center", "authority", "type"]',
   'secondary_context', '["profile"]',
   'depends_on', 'Splenic authority фильтрует, какие битвы брать.',
   'related_element_kinds', '["defined_center", "authority", "type"]',
   'context_note', 'С Splenic authority — брать только те битвы, где мгновенное «да».'
 ),
 jsonb_build_object(
   'base', 'Соглашается на бессмысленный конфликт из адреналина.',
   'pro', 'Struggle without purpose.',
   'warning_signals', '["вечная война", "цинизм"]',
   'recovery_conditions', '["ясная миссия", "право отказаться от битвы"]'
 ),
 jsonb_build_array(
   jsonb_build_object(
     'contrast_context', 'Избегающий конфликтов профиль',
     'how_it_would_read', 'Человек уходил бы от борьбы и искал компромисс любой ценой.',
     'why_current_context_is_different', '28-38 даёт энергию осмысленной борьбы.'
   )
 ),
 'draft')

on conflict (element_kind, element_key, language, version) do update set
  element_label = excluded.element_label,
  classic_markdown = excluded.classic_markdown,
  hr_translation_markdown = excluded.hr_translation_markdown,
  pro_markdown = excluded.pro_markdown,
  talent_hints = excluded.talent_hints,
  risk_hints = excluded.risk_hints,
  management_hints = excluded.management_hints,
  environment_hints = excluded.environment_hints,
  limitations = excluded.limitations,
  base_layers = excluded.base_layers,
  pro_layers = excluded.pro_layers,
  context_rules = excluded.context_rules,
  not_self_layers = excluded.not_self_layers,
  contrast_examples = excluded.contrast_examples,
  source_quality = excluded.source_quality,
  updated_at = timezone('utc', now());
