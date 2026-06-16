-- Stage 4-E6.1-D: Element Card Storage — line/1 … line/6
-- Approved expert_draft cards from supabase/reference/element_cards/line_*.v1.json
-- DB version stays v1; editorial versions live in pro_layers.card_metadata

insert into public.hd_reference_interpretations (
  element_kind, element_key, element_label, language, version,
  classic_markdown, hr_translation_markdown, pro_markdown,
  talent_hints, risk_hints, management_hints, environment_hints, limitations,
  base_layers, pro_layers, context_rules, not_self_layers, contrast_examples,
  source_quality
) values

-- line/1
(
  'line',
  '1',
  'Линия 1',
  'ru',
  'v1',
  'Line 1 · Опора на основу

investigator, foundation, security, research, basis

Line 1 adds foundation, investigation, security and depth of preparation to the theme.

When a gate or activation is in the 1st line, the theme tends to seek a basis before stable expression. It becomes clearer and more reliable when the person understands the underlying structure.',
  '## Название

Опора на основу

## Короткая суть

Эта линия показывает стиль, в котором рабочая тема раскрывается через понимание основы, исследование и чувство опоры.

## Как проявляется в работе

Человек лучше действует, когда понимает, на чём всё держится: правила, причины, структуру задачи, исходные данные и реальные основания решения.

## Здоровое проявление

Человек создаёт устойчивую базу: разбирается в сути, задаёт точные вопросы, проверяет фундамент и помогает не строить работу на догадках.

## Искажённое проявление

Может застревать в подготовке, сомневаться без достаточного основания, искать полную гарантию перед действием или перегружать себя сбором информации.

## Как использовать

Давать время на изучение контекста, объяснять задачу не только через “что сделать”, но и через “почему это важно” и “на чём держится решение”.

## Что проверить в реальности

Помогает ли человеку предварительное понимание основы работать точнее — или он уходит в избыточную подготовку и откладывает действие.

## Важно

Линия 1 не означает, что человек всегда аналитик или теоретик. Она показывает, что конкретная тема проявляется через потребность в основе и понимании фундамента.',
  '## Линия 1 · Фундамент

## Technical meaning

Line 1 adds foundation, investigation, security and depth of preparation to the theme.

## Mechanics

When a gate or activation is in the 1st line, the theme tends to seek a basis before stable expression. It becomes clearer and more reliable when the person understands the underlying structure.

## Role in chart

Line 1 modifies a gate or activation by making the theme more foundation-oriented: the person may need to understand why, how and on what basis the theme should be used.

## Contextual reading

Line 1 should be read through the gate, planet, side, activation_position, profile, type, authority and whole chart context.

## Correct expression

The theme expresses through research, preparation, understanding and building a stable base for action.

## Not-Self expression

The theme may distort into insecurity, over-preparation, fear of acting without enough information or dependence on external guarantees.

## Interpretation limits

Do not conclude that the person is slow, uncertain or overly theoretical. Line 1 shows the style of manifestation of a specific theme, not the whole personality.',
  '["создаёт основу", "разбирается в причинах", "задаёт фундаментальные вопросы", "укрепляет решение через понимание"]'::jsonb,
  '["избыточная подготовка", "застревание в исследовании", "поиск полной гарантии", "сомнение без практической проверки"]'::jsonb,
  '["дать контекст и причины задачи", "показать исходные данные", "обозначить критерий достаточной подготовки", "не давить на мгновенное действие без понимания основы"]'::jsonb,
  '["понятные правила", "доступ к информации", "уважение к подготовке", "пространство для вопросов"]'::jsonb,
  '["Не делать вывод, что человек медлительный, неуверенный или излишне теоретический.", "Line 1 показывает стиль проявления конкретной темы, а не всю личность.", "Не использовать line/1 как финальный вывод о человеке.", "Не использовать для fit_score, match_score или решения о найме.", "Не читать линию отдельно от gate, activation_position, profile и whole chart context."]'::jsonb,
  '{"title": "Опора на основу", "base_label": "Опора на основу", "plain_meaning": "Эта линия показывает стиль, в котором рабочая тема раскрывается через понимание основы, исследование и чувство опоры.", "work_manifestation": "Человек лучше действует, когда понимает, на чём всё держится: правила, причины, структуру задачи, исходные данные и реальные основания решения.", "healthy_expression": "Человек создаёт устойчивую базу: разбирается в сути, задаёт точные вопросы, проверяет фундамент и помогает не строить работу на догадках.", "distorted_expression": "Может застревать в подготовке, сомневаться без достаточного основания, искать полную гарантию перед действием или перегружать себя сбором информации.", "strengths": "создаёт основу; разбирается в причинах; задаёт фундаментальные вопросы; укрепляет решение через понимание", "risks": "избыточная подготовка; застревание в исследовании; поиск полной гарантии; сомнение без практической проверки", "when_it_works_best": "Давать время на изучение контекста, объяснять задачу не только через “что сделать”, но и через “почему это важно” и “на чём держится решение”.", "when_talent_is_not_revealed": "Может застревать в подготовке, сомневаться без достаточного основания, искать полную гарантию перед действием или перегружать себя сбором информации.", "development_hints": ["дать контекст и причины задачи", "показать исходные данные", "обозначить критерий достаточной подготовки", "не давить на мгновенное действие без понимания основы"], "communication_hints": ["дать контекст и причины задачи", "показать исходные данные", "обозначить критерий достаточной подготовки", "не давить на мгновенное действие без понимания основы"], "reality_check": "Помогает ли человеку предварительное понимание основы работать точнее — или он уходит в избыточную подготовку и откладывает действие.", "important_note": "Линия 1 не означает, что человек всегда аналитик или теоретик. Она показывает, что конкретная тема проявляется через потребность в основе и понимании фундамента."}'::jsonb,
  '{"hd_meaning": "Line 1 adds foundation, investigation, security and depth of preparation to the theme.", "mechanics": "When a gate or activation is in the 1st line, the theme tends to seek a basis before stable expression. It becomes clearer and more reliable when the person understands the underlying structure.", "classical_keywords": ["investigator", "foundation", "security", "research", "basis"], "source_logic": "line/1 describes the universal style of manifestation for a gate or activation theme. Final reading depends on gate, planet, side, activation_position, profile, type, authority and whole chart context.", "role_in_chart": "Line 1 modifies a gate or activation by making the theme more foundation-oriented: the person may need to understand why, how and on what basis the theme should be used.", "contextual_reading": "Line 1 should be read through the gate, planet, side, activation_position, profile, type, authority and whole chart context.", "correct_expression": "The theme expresses through research, preparation, understanding and building a stable base for action.", "not_self_expression": "The theme may distort into insecurity, over-preparation, fear of acting without enough information or dependence on external guarantees.", "pro_not_self": "Not-Self проявление Line 1 связано с попыткой получить абсолютную безопасность через информацию, вместо корректного применения темы в контексте карты.", "interpretation_limitations": "Do not conclude that the person is slow, uncertain or overly theoretical. Line 1 shows the style of manifestation of a specific theme, not the whole personality.", "card_metadata": {"editorial_version": "v0.1.1", "status": "approved_after_editorial_review", "ui_base_label": "Опора на основу", "ui_pro_label": "Линия 1 · Фундамент", "primary_layer_key": "pro_foundation", "link_target": "element://line/1", "source_file": "supabase/reference/element_cards/source/line_1.md", "used_in_layers": ["work_style", "decision_and_stability", "development_potential", "pro_foundation"], "methodology_note": "Universal line card: describes style of manifestation, not a final person label. Read through gate, activation_position and whole chart context."}, "ai_source_rules": {"allowed_uses": ["использовать как supporting source для pro_foundation", "использовать для уточнения стиля проявления темы в gate или activation", "использовать в слоях, указанных в used_in_layers", "использовать для контекстного чтения activation composition"], "forbidden_uses": ["не использовать как финальный вывод о человеке", "не использовать для fit_score или match_score", "не использовать для hire/no-hire decisions", "не подменять line-card profile-card или activation_position", "не читать line отдельно от gate и activation context"], "preferred_layers": ["work_style", "decision_and_stability", "development_potential", "pro_foundation"], "source_priority": "supporting", "ai_must_check": ["gate", "activation", "activation_position", "planet", "side", "profile", "type", "authority"]}, "source_chip": {"base_label": "Опора на основу", "pro_label": "Линия 1 · Фундамент", "short_role": "Показывает, что тема проявляется через исследование и создание базы.", "role_in_this_layer": "Уточняет, что тема требует понимания основы перед устойчивым применением.", "link_target": "element://line/1"}}'::jsonb,
  '{"primary_context": ["gate", "activation", "profile"], "secondary_context": ["planet", "side", "activation_position", "type", "authority"], "depends_on": "Итоговое чтение зависит от темы ворот, позиции активации, профиля и общего контекста карты.", "related_element_kinds": ["gate", "activation", "profile", "planet", "side", "activation_position"], "context_note": "Линия 1 показывает стиль проявления темы через основу, исследование и подготовку. Не использовать как самостоятельный вывод о человеке."}'::jsonb,
  '{"base": "Тема может искажаться через избыточную подготовку, сомнения и поиск полной гарантии.", "pro": "Not-Self проявление Line 1 связано с попыткой получить абсолютную безопасность через информацию, вместо корректного применения темы в контексте карты.", "warning_signals": ["человек долго готовится, но не переходит к действию", "требует полной ясности там, где нужен рабочий минимум", "использует недостаток информации как повод отложить решение"], "recovery_conditions": ["понятный контекст задачи", "доступ к ключевой информации", "критерий достаточной подготовки", "поддержка перехода от исследования к действию"]}'::jsonb,
  '[{"contrast_context": "Line 1 в gate, связанной с аналитикой", "how_it_would_read": "Может усиливать способность глубоко разбираться в причинах и строить надёжную основу решения.", "why_current_context_is_different": "Если та же линия стоит в теме коммуникации, акцент будет не на анализе как профессии, а на подготовленности высказывания."}, {"contrast_context": "Line 1 как часть profile/1/3", "how_it_would_read": "Фундаментальная подготовка соединяется с практическими пробами и ошибками.", "why_current_context_is_different": "Отдельная line/1 не равна всему профилю 1/3; профиль добавляет динамику второй линии."}, {"contrast_context": "Line 1 в центральной activation_position", "how_it_would_read": "Тема может быть важной опорой личности или автоматической механики.", "why_current_context_is_different": "В периферийной позиции line/1 может быть только уточняющим стилем, а не главным паттерном карты."}, {"contrast_context": "Line 1 в полном канале", "how_it_would_read": "Фундаментальность может проявляться устойчивее, потому что тема поддержана всей механикой канала.", "why_current_context_is_different": "В hanging gate проявление может быть более ситуативным и зависеть от контекста."}, {"contrast_context": "Line 1 в здоровом и искажённом проявлении", "how_it_would_read": "В здоровом проявлении даёт надёжную базу; в искажённом — застревание в подготовке.", "why_current_context_is_different": "Качество проявления зависит от условий, роли, нагрузки и общей механики человека."}]'::jsonb,
  'expert_draft'
),

-- line/2
(
  'line',
  '2',
  'Линия 2',
  'ru',
  'v1',
  'Line 2 · Естественный способ

hermit, natural gift, call-out, talent, withdrawal

Line 2 adds naturalness, innate gift, withdrawal and call-out mechanics to the theme.

When a gate or activation is in the 2nd line, the theme may be visible to others before the person fully recognizes it as a skill or strength.',
  '## Название

Естественный способ

## Короткая суть

Эта линия показывает стиль, в котором рабочая тема проявляется естественно, почти без усилия, как природная способность.

## Как проявляется в работе

Человек может делать что-то легко и органично, но не всегда сам понимает, почему это ценно для других.

## Здоровое проявление

Талант проявляется просто, живо и без чрезмерного давления. Человек раскрывается, когда его способность замечают и обращаются к ней в подходящем контексте.

## Искажённое проявление

Может прятать способность, избегать проявления, закрываться от внешних запросов или ждать, что другие сами всё заметят и правильно поймут.

## Как использовать

Не давить постоянным контролем. Лучше замечать естественную сильную сторону человека и обращаться к ней там, где этот дар действительно нужен.

## Что проверить в реальности

Есть ли тема, которую человек делает легко, но недооценивает, не считает навыком или не умеет объяснить как профессиональную ценность.

## Важно

Линия 2 не означает пассивность или закрытость. Она показывает, что конкретная тема раскрывается естественнее, когда есть пространство, признание и точное обращение к способности.',
  '## Линия 2 · Естественный дар

## Technical meaning

Line 2 adds naturalness, innate gift, withdrawal and call-out mechanics to the theme.

## Mechanics

When a gate or activation is in the 2nd line, the theme may be visible to others before the person fully recognizes it as a skill or strength.

## Role in chart

Line 2 modifies a theme by making it more natural, less forced and more dependent on recognition from the outside field.

## Contextual reading

Line 2 must be read through gate, planet, side, activation_position, profile, type, strategy, authority and whole chart context.

## Correct expression

The theme expresses naturally, without excessive self-proving, when there is space, recognition and a precise external call to the ability.

## Not-Self expression

The theme may distort into hiding, avoiding visibility, rejecting recognition or waiting passively to be noticed.

## Interpretation limits

Do not confuse Line 2 with Projector strategy. Line 2 describes a natural style of manifestation and call-out mechanics, not the whole strategy for entering work or relationships.',
  '["естественный дар", "лёгкость проявления", "способность делать без лишнего напряжения", "заметная природная сила"]'::jsonb,
  '["скрывание таланта", "недооценка своей способности", "избегание запроса", "закрытость под давлением"]'::jsonb,
  '["замечать сильную сторону", "обращаться к способности в подходящем контексте", "не перегружать постоянным контролем", "не требовать агрессивного самопродвижения"]'::jsonb,
  '["пространство без давления", "признание способности", "уважение к личному ритму", "точный запрос вместо навязывания"]'::jsonb,
  '["Не смешивать Line 2 со стратегией Проектора.", "Line 2 описывает естественный стиль проявления и call-out mechanics, а не всю стратегию входа в работу или отношения.", "Не использовать line/2 как финальный вывод о человеке.", "Не использовать для fit_score, match_score или решения о найме.", "Не читать линию отдельно от gate, activation_position, profile и whole chart context."]'::jsonb,
  '{"title": "Естественный способ", "base_label": "Естественный способ", "plain_meaning": "Эта линия показывает стиль, в котором рабочая тема проявляется естественно, почти без усилия, как природная способность.", "work_manifestation": "Человек может делать что-то легко и органично, но не всегда сам понимает, почему это ценно для других.", "healthy_expression": "Талант проявляется просто, живо и без чрезмерного давления. Человек раскрывается, когда его способность замечают и обращаются к ней в подходящем контексте.", "distorted_expression": "Может прятать способность, избегать проявления, закрываться от внешних запросов или ждать, что другие сами всё заметят и правильно поймут.", "strengths": "естественный дар; лёгкость проявления; способность делать без лишнего напряжения; заметная природная сила", "risks": "скрывание таланта; недооценка своей способности; избегание запроса; закрытость под давлением", "when_it_works_best": "Не давить постоянным контролем. Лучше замечать естественную сильную сторону человека и обращаться к ней там, где этот дар действительно нужен.", "when_talent_is_not_revealed": "Может прятать способность, избегать проявления, закрываться от внешних запросов или ждать, что другие сами всё заметят и правильно поймут.", "development_hints": ["замечать сильную сторону", "обращаться к способности в подходящем контексте", "не перегружать постоянным контролем", "не требовать агрессивного самопродвижения"], "communication_hints": ["замечать сильную сторону", "обращаться к способности в подходящем контексте", "не перегружать постоянным контролем", "не требовать агрессивного самопродвижения"], "reality_check": "Есть ли тема, которую человек делает легко, но недооценивает, не считает навыком или не умеет объяснить как профессиональную ценность.", "important_note": "Линия 2 не означает пассивность или закрытость. Она показывает, что конкретная тема раскрывается естественнее, когда есть пространство, признание и точное обращение к способности."}'::jsonb,
  '{"hd_meaning": "Line 2 adds naturalness, innate gift, withdrawal and call-out mechanics to the theme.", "mechanics": "When a gate or activation is in the 2nd line, the theme may be visible to others before the person fully recognizes it as a skill or strength.", "classical_keywords": ["hermit", "natural gift", "call-out", "talent", "withdrawal"], "source_logic": "line/2 describes the universal style of manifestation for a gate or activation theme. Final reading depends on gate, planet, side, activation_position, profile, type, authority and whole chart context.", "role_in_chart": "Line 2 modifies a theme by making it more natural, less forced and more dependent on recognition from the outside field.", "contextual_reading": "Line 2 must be read through gate, planet, side, activation_position, profile, type, strategy, authority and whole chart context.", "correct_expression": "The theme expresses naturally, without excessive self-proving, when there is space, recognition and a precise external call to the ability.", "not_self_expression": "The theme may distort into hiding, avoiding visibility, rejecting recognition or waiting passively to be noticed.", "pro_not_self": "Not-Self проявление Line 2 связано с уходом в изоляцию, отказом от признания дара или неразличением корректного внешнего обращения к способности.", "interpretation_limitations": "Do not confuse Line 2 with Projector strategy. Line 2 describes a natural style of manifestation and call-out mechanics, not the whole strategy for entering work or relationships.", "card_metadata": {"editorial_version": "v0.1.1", "status": "approved_after_editorial_review", "ui_base_label": "Естественный способ", "ui_pro_label": "Линия 2 · Естественный дар", "primary_layer_key": "pro_foundation", "link_target": "element://line/2", "source_file": "supabase/reference/element_cards/source/line_2.md", "used_in_layers": ["work_style", "main_talents", "management_and_environment", "development_potential", "pro_foundation"], "methodology_note": "Universal line card: describes style of manifestation, not a final person label. Read through gate, activation_position and whole chart context."}, "ai_source_rules": {"allowed_uses": ["использовать как supporting source для pro_foundation", "использовать для уточнения стиля проявления темы в gate или activation", "использовать в слоях, указанных в used_in_layers", "использовать для контекстного чтения activation composition"], "forbidden_uses": ["не использовать как финальный вывод о человеке", "не использовать для fit_score или match_score", "не использовать для hire/no-hire decisions", "не подменять line-card profile-card или activation_position", "не читать line отдельно от gate и activation context"], "preferred_layers": ["work_style", "main_talents", "management_and_environment", "development_potential", "pro_foundation"], "source_priority": "supporting", "ai_must_check": ["gate", "activation", "activation_position", "planet", "side", "profile", "type", "authority"]}, "source_chip": {"base_label": "Естественный способ", "pro_label": "Линия 2 · Естественный дар", "short_role": "Показывает, что тема проявляется природно и лучше раскрывается без давления.", "role_in_this_layer": "Уточняет, где тема работает как естественная способность, которую важно заметить и правильно применить.", "link_target": "element://line/2"}}'::jsonb,
  '{"primary_context": ["gate", "activation", "profile"], "secondary_context": ["planet", "side", "activation_position", "type", "strategy", "authority"], "depends_on": "Итоговое чтение зависит от темы ворот, позиции активации, профиля, типа, стратегии и авторитета.", "related_element_kinds": ["gate", "activation", "profile", "planet", "side", "activation_position"], "context_note": "Линия 2 показывает естественный стиль проявления темы и не должна смешиваться со стратегией Проектора."}'::jsonb,
  '{"base": "Тема может искажаться через скрывание способности, избегание проявления или ожидание, что другие сами всё распознают.", "pro": "Not-Self проявление Line 2 связано с уходом в изоляцию, отказом от признания дара или неразличением корректного внешнего обращения к способности.", "warning_signals": ["человек обесценивает то, что делает легко", "избегает проявления под давлением", "ждёт, что другие сами заметят и сформулируют его ценность"], "recovery_conditions": ["пространство без давления", "точное признание способности", "корректный внешний запрос", "уважение к естественному ритму проявления"]}'::jsonb,
  '[{"contrast_context": "Line 2 в таланте", "how_it_would_read": "Может показывать природную способность, которую человек сам считает обычной.", "why_current_context_is_different": "Если line/2 стоит в зоне риска или напряжения, естественность может проявляться как уход от проявления."}, {"contrast_context": "Line 2 и strategy/wait_for_the_invitation", "how_it_would_read": "Обе темы могут включать внешний сигнал, но относятся к разным уровням.", "why_current_context_is_different": "Стратегия описывает корректный вход в действие для типа, а line/2 — стиль проявления конкретной темы."}, {"contrast_context": "Line 2 в profile/2/4", "how_it_would_read": "Естественный дар соединяется с влиянием через доверительный круг.", "why_current_context_is_different": "Отдельная line/2 не описывает всю социальную динамику профиля."}, {"contrast_context": "Line 2 в central activation_position", "how_it_would_read": "Естественный дар может быть заметной частью рабочей формулы человека.", "why_current_context_is_different": "В менее центральной позиции line/2 может быть только дополнительным оттенком темы."}, {"contrast_context": "Line 2 здорово / искажённо", "how_it_would_read": "В здоровом проявлении даёт лёгкость дара; в искажённом — скрывание и избегание.", "why_current_context_is_different": "Ключевым становится качество среды: признание без давления или ожидание проявления через силу."}]'::jsonb,
  'expert_draft'
),

-- line/3
(
  'line',
  '3',
  'Линия 3',
  'ru',
  'v1',
  'Line 3 · Опыт через пробы

martyr, trial and error, experiment, adaptation, mutation through experience

Line 3 adds experiment, trial and error, adaptation and learning through lived experience to the theme.

When a gate or activation is in the 3rd line, the theme is tested through practice. Friction, mistakes and correction become part of the learning mechanism.',
  '## Название

Опыт через пробы

## Короткая суть

Эта линия показывает стиль, в котором рабочая тема раскрывается через практику, пробы, ошибки, проверку реальностью и постепенную доработку.

## Как проявляется в работе

Человек лучше понимает тему не в теории, а через опыт: попробовать, столкнуться с ограничением, исправить, улучшить и найти рабочий вариант.

## Здоровое проявление

Человек быстро учится на практике, не боится тестировать, видит, что реально работает, и превращает ошибки в улучшения.

## Искажённое проявление

Может хаотично пробовать, повторять одни и те же ошибки, торопиться без выводов или воспринимать опыт как личную неудачу.

## Как использовать

Давать задачи, где допустимы тесты, итерации и практическая проверка. Важно отделять ошибку процесса от оценки личности.

## Что проверить в реальности

Умеет ли человек делать выводы из опыта и превращать пробы в рабочие улучшения, а не просто много экспериментировать.

## Важно

Линия 3 не означает ненадёжность. Она показывает, что конкретная тема раскрывается через практическое столкновение с реальностью. Ошибка здесь не провал, а способ проверки реальности.',
  '## Линия 3 · Эксперимент

## Technical meaning

Line 3 adds experiment, trial and error, adaptation and learning through lived experience to the theme.

## Mechanics

When a gate or activation is in the 3rd line, the theme is tested through practice. Friction, mistakes and correction become part of the learning mechanism.

## Role in chart

Line 3 modifies a theme by making it experiential and iterative. The theme may become more reliable after testing, not before.

## Contextual reading

Line 3 should be read through gate, planet, side, activation_position, profile, authority, work role and whole chart context.

## Correct expression

The theme expresses through testing, practical conclusions, iteration and the ability to find what works after direct experience.

## Not-Self expression

The theme may distort into chaotic experimentation, self-blame, fear of repeated mistakes or endless testing without integration.

## Interpretation limits

Do not conclude that the person is unstable, careless or problematic. Line 3 describes the learning style of a theme through practical reality.',
  '["быстро учится на практике", "тестирует решения", "видит, что работает в реальности", "улучшает через итерации"]'::jsonb,
  '["хаотичные пробы", "повторение ошибок без выводов", "самообвинение после неудач", "поспешные действия без интеграции опыта"]'::jsonb,
  '["разрешать тестовые циклы", "фиксировать выводы после проб", "не наказывать за честную ошибку", "помогать переводить опыт в систему"]'::jsonb,
  '["культура итераций", "право на тест", "обратная связь без стыда", "задачи с практической проверкой"]'::jsonb,
  '["Не делать вывод, что человек нестабильный, безответственный или проблемный.", "Line 3 описывает стиль обучения темы через практическую реальность.", "Не использовать line/3 как финальный вывод о человеке.", "Не использовать для fit_score, match_score или решения о найме.", "Не читать линию отдельно от gate, activation_position, profile и whole chart context."]'::jsonb,
  '{"title": "Опыт через пробы", "base_label": "Опыт через пробы", "plain_meaning": "Эта линия показывает стиль, в котором рабочая тема раскрывается через практику, пробы, ошибки, проверку реальностью и постепенную доработку.", "work_manifestation": "Человек лучше понимает тему не в теории, а через опыт: попробовать, столкнуться с ограничением, исправить, улучшить и найти рабочий вариант.", "healthy_expression": "Человек быстро учится на практике, не боится тестировать, видит, что реально работает, и превращает ошибки в улучшения.", "distorted_expression": "Может хаотично пробовать, повторять одни и те же ошибки, торопиться без выводов или воспринимать опыт как личную неудачу.", "strengths": "быстро учится на практике; тестирует решения; видит, что работает в реальности; улучшает через итерации", "risks": "хаотичные пробы; повторение ошибок без выводов; самообвинение после неудач; поспешные действия без интеграции опыта", "when_it_works_best": "Давать задачи, где допустимы тесты, итерации и практическая проверка. Важно отделять ошибку процесса от оценки личности.", "when_talent_is_not_revealed": "Может хаотично пробовать, повторять одни и те же ошибки, торопиться без выводов или воспринимать опыт как личную неудачу.", "development_hints": ["разрешать тестовые циклы", "фиксировать выводы после проб", "не наказывать за честную ошибку", "помогать переводить опыт в систему"], "communication_hints": ["разрешать тестовые циклы", "фиксировать выводы после проб", "не наказывать за честную ошибку", "помогать переводить опыт в систему"], "reality_check": "Умеет ли человек делать выводы из опыта и превращать пробы в рабочие улучшения, а не просто много экспериментировать.", "important_note": "Линия 3 не означает ненадёжность. Она показывает, что конкретная тема раскрывается через практическое столкновение с реальностью. Ошибка здесь не провал, а способ проверки реальности."}'::jsonb,
  '{"hd_meaning": "Line 3 adds experiment, trial and error, adaptation and learning through lived experience to the theme.", "mechanics": "When a gate or activation is in the 3rd line, the theme is tested through practice. Friction, mistakes and correction become part of the learning mechanism.", "classical_keywords": ["martyr", "trial and error", "experiment", "adaptation", "mutation through experience"], "source_logic": "line/3 describes the universal style of manifestation for a gate or activation theme. Final reading depends on gate, planet, side, activation_position, profile, type, authority and whole chart context.", "role_in_chart": "Line 3 modifies a theme by making it experiential and iterative. The theme may become more reliable after testing, not before.", "contextual_reading": "Line 3 should be read through gate, planet, side, activation_position, profile, authority, work role and whole chart context.", "correct_expression": "The theme expresses through testing, practical conclusions, iteration and the ability to find what works after direct experience.", "not_self_expression": "The theme may distort into chaotic experimentation, self-blame, fear of repeated mistakes or endless testing without integration.", "pro_not_self": "Not-Self проявление Line 3 связано с потерей корректного отношения к trial and error: ошибка становится самооценкой вместо материала для опыта.", "interpretation_limitations": "Do not conclude that the person is unstable, careless or problematic. Line 3 describes the learning style of a theme through practical reality.", "card_metadata": {"editorial_version": "v0.1.1", "status": "approved_after_editorial_review", "ui_base_label": "Опыт через пробы", "ui_pro_label": "Линия 3 · Эксперимент", "primary_layer_key": "pro_foundation", "link_target": "element://line/3", "source_file": "supabase/reference/element_cards/source/line_3.md", "used_in_layers": ["work_style", "risks_and_distortions", "development_potential", "pro_foundation"], "methodology_note": "Universal line card: describes style of manifestation, not a final person label. Read through gate, activation_position and whole chart context."}, "ai_source_rules": {"allowed_uses": ["использовать как supporting source для pro_foundation", "использовать для уточнения стиля проявления темы в gate или activation", "использовать в слоях, указанных в used_in_layers", "использовать для контекстного чтения activation composition"], "forbidden_uses": ["не использовать как финальный вывод о человеке", "не использовать для fit_score или match_score", "не использовать для hire/no-hire decisions", "не подменять line-card profile-card или activation_position", "не читать line отдельно от gate и activation context"], "preferred_layers": ["work_style", "risks_and_distortions", "development_potential", "pro_foundation"], "source_priority": "supporting", "ai_must_check": ["gate", "activation", "activation_position", "planet", "side", "profile", "type", "authority"]}, "source_chip": {"base_label": "Опыт через пробы", "pro_label": "Линия 3 · Эксперимент", "short_role": "Показывает, что тема раскрывается через практику, ошибки и доработку.", "role_in_this_layer": "Уточняет, где тема требует тестирования, итераций и практического опыта.", "link_target": "element://line/3"}}'::jsonb,
  '{"primary_context": ["gate", "activation", "profile"], "secondary_context": ["planet", "side", "activation_position", "authority", "work_role"], "depends_on": "Итоговое чтение зависит от темы ворот, позиции активации, профиля, авторитета и рабочей роли.", "related_element_kinds": ["gate", "activation", "profile", "planet", "side", "activation_position"], "context_note": "Линия 3 показывает стиль проявления темы через опыт, ошибки и итерации. Не использовать как вывод о ненадёжности человека."}'::jsonb,
  '{"base": "Тема может искажаться через хаотичные пробы, повторение ошибок без выводов или болезненное отношение к неудачам.", "pro": "Not-Self проявление Line 3 связано с потерей корректного отношения к trial and error: ошибка становится самооценкой вместо материала для опыта.", "warning_signals": ["человек повторяет одни и те же ошибки без интеграции", "торопится тестировать без фиксации выводов", "воспринимает рабочую ошибку как личный провал"], "recovery_conditions": ["культура итераций", "разбор опыта без стыда", "короткие циклы проверки", "перевод ошибки в вывод и улучшение"]}'::jsonb,
  '[{"contrast_context": "Line 3 в gate, связанной с улучшением", "how_it_would_read": "Может давать способность дорабатывать через практические тесты.", "why_current_context_is_different": "Если gate связана с коммуникацией, line/3 будет проявляться как обучение говорить точнее через опыт общения."}, {"contrast_context": "Line 3 в profile/1/3", "how_it_would_read": "Исследование основы соединяется с практической проверкой.", "why_current_context_is_different": "Отдельная line/3 не содержит всей потребности line/1 в фундаменте."}, {"contrast_context": "Line 3 в полном канале", "how_it_would_read": "Опыт через пробы может стать устойчивым рабочим способом.", "why_current_context_is_different": "В hanging gate проявление может быть менее стабильным и сильнее зависеть от среды."}, {"contrast_context": "Line 3 в центральной activation_position", "how_it_would_read": "Практическое тестирование может быть важной частью рабочей формулы.", "why_current_context_is_different": "В supporting-позиции line/3 только уточняет стиль отдельной темы."}, {"contrast_context": "Line 3 здорово / искажённо", "how_it_would_read": "В здоровом проявлении даёт обучение через опыт; в искажённом — хаос и самообвинение.", "why_current_context_is_different": "Ключевое различие — делает ли человек выводы из опыта."}]'::jsonb,
  'expert_draft'
),

-- line/4
(
  'line',
  '4',
  'Линия 4',
  'ru',
  'v1',
  'Line 4 · Влияние через доверие

opportunist, network, trust, friendship, influence through connection

Line 4 adds network, trust, close-circle influence and relational transmission to the theme.

When a gate or activation is in the 4th line, the theme is more easily transmitted through connection, familiarity, reputation and people who are already open to receiving it.',
  '## Название

Влияние через доверие

## Короткая суть

Эта линия показывает стиль, в котором рабочая тема проявляется через доверие, связи, близкий круг, репутацию и человеческий контакт.

## Как проявляется в работе

Человек сильнее влияет там, где есть отношения, понятный круг взаимодействия и доверие к его словам, роли или опыту.

## Здоровое проявление

Человек передаёт тему через контакт, объединяет людей, укрепляет доверие и влияет не давлением, а устойчивой связью.

## Искажённое проявление

Может зависеть от реакции своего круга, бояться потерять контакт, избегать новых людей или слишком держаться за привычные связи.

## Как использовать

Строить взаимодействие через доверие, понятные договорённости, устойчивые контакты и уважение к роли человека в группе.

## Что проверить в реальности

Где человек раскрывается сильнее: в холодной среде без контакта или там, где есть доверие, знакомый круг и репутационная опора.

## Важно

Линия 4 не означает, что человек обязательно экстраверт. Здесь важно не количество контактов, а качество доверия.',
  '## Линия 4 · Связи

## Technical meaning

Line 4 adds network, trust, close-circle influence and relational transmission to the theme.

## Mechanics

When a gate or activation is in the 4th line, the theme is more easily transmitted through connection, familiarity, reputation and people who are already open to receiving it.

## Role in chart

Line 4 modifies a theme by making it socially transmissive: the theme tends to spread through trust, contact and relationship fields.

## Contextual reading

Line 4 should be read through gate, planet, side, activation_position, profile, communication context, team environment and whole chart context.

## Correct expression

The theme expresses through trust, support, exchange, stable connections and influence within a relational field.

## Not-Self expression

The theme may distort into dependence on acceptance, fear of losing connection, pressure on the close circle or avoidance of new relational contexts.

## Interpretation limits

Do not conclude that the person is simply sociable, extraverted or dependent on people. Line 4 describes the relational style of manifestation of a specific theme.',
  '["влияние через доверие", "укрепление связей", "передача темы через контакт", "репутационная опора"]'::jsonb,
  '["зависимость от своего круга", "страх потерять контакт", "закрытость к новым людям", "давление на близкие связи"]'::jsonb,
  '["строить доверие", "не ломать резко рабочий круг", "использовать силу репутации", "давать роль в коммуникации с людьми"]'::jsonb,
  '["доверительная команда", "устойчивые контакты", "понятные договорённости", "среда без резких социальных разрывов"]'::jsonb,
  '["Не делать вывод, что человек просто общительный, экстравертный или зависимый от людей.", "Line 4 описывает relational style проявления конкретной темы.", "Не использовать line/4 как финальный вывод о человеке.", "Не использовать для fit_score, match_score или решения о найме.", "Не читать линию отдельно от gate, activation_position, profile и whole chart context."]'::jsonb,
  '{"title": "Влияние через доверие", "base_label": "Влияние через доверие", "plain_meaning": "Эта линия показывает стиль, в котором рабочая тема проявляется через доверие, связи, близкий круг, репутацию и человеческий контакт.", "work_manifestation": "Человек сильнее влияет там, где есть отношения, понятный круг взаимодействия и доверие к его словам, роли или опыту.", "healthy_expression": "Человек передаёт тему через контакт, объединяет людей, укрепляет доверие и влияет не давлением, а устойчивой связью.", "distorted_expression": "Может зависеть от реакции своего круга, бояться потерять контакт, избегать новых людей или слишком держаться за привычные связи.", "strengths": "влияние через доверие; укрепление связей; передача темы через контакт; репутационная опора", "risks": "зависимость от своего круга; страх потерять контакт; закрытость к новым людям; давление на близкие связи", "when_it_works_best": "Строить взаимодействие через доверие, понятные договорённости, устойчивые контакты и уважение к роли человека в группе.", "when_talent_is_not_revealed": "Может зависеть от реакции своего круга, бояться потерять контакт, избегать новых людей или слишком держаться за привычные связи.", "development_hints": ["строить доверие", "не ломать резко рабочий круг", "использовать силу репутации", "давать роль в коммуникации с людьми"], "communication_hints": ["строить доверие", "не ломать резко рабочий круг", "использовать силу репутации", "давать роль в коммуникации с людьми"], "reality_check": "Где человек раскрывается сильнее: в холодной среде без контакта или там, где есть доверие, знакомый круг и репутационная опора.", "important_note": "Линия 4 не означает, что человек обязательно экстраверт. Здесь важно не количество контактов, а качество доверия."}'::jsonb,
  '{"hd_meaning": "Line 4 adds network, trust, close-circle influence and relational transmission to the theme.", "mechanics": "When a gate or activation is in the 4th line, the theme is more easily transmitted through connection, familiarity, reputation and people who are already open to receiving it.", "classical_keywords": ["opportunist", "network", "trust", "friendship", "influence through connection"], "source_logic": "line/4 describes the universal style of manifestation for a gate or activation theme. Final reading depends on gate, planet, side, activation_position, profile, type, authority and whole chart context.", "role_in_chart": "Line 4 modifies a theme by making it socially transmissive: the theme tends to spread through trust, contact and relationship fields.", "contextual_reading": "Line 4 should be read through gate, planet, side, activation_position, profile, communication context, team environment and whole chart context.", "correct_expression": "The theme expresses through trust, support, exchange, stable connections and influence within a relational field.", "not_self_expression": "The theme may distort into dependence on acceptance, fear of losing connection, pressure on the close circle or avoidance of new relational contexts.", "pro_not_self": "Not-Self проявление Line 4 связано с неустойчивым отношением к сети: человек может держаться за привычный круг или пытаться влиять без настоящего доверия.", "interpretation_limitations": "Do not conclude that the person is simply sociable, extraverted or dependent on people. Line 4 describes the relational style of manifestation of a specific theme.", "card_metadata": {"editorial_version": "v0.1.1", "status": "approved_after_editorial_review", "ui_base_label": "Влияние через доверие", "ui_pro_label": "Линия 4 · Связи", "primary_layer_key": "pro_foundation", "link_target": "element://line/4", "source_file": "supabase/reference/element_cards/source/line_4.md", "used_in_layers": ["communication_and_influence", "management_and_environment", "work_style", "pro_foundation"], "methodology_note": "Universal line card: describes style of manifestation, not a final person label. Read through gate, activation_position and whole chart context."}, "ai_source_rules": {"allowed_uses": ["использовать как supporting source для pro_foundation", "использовать для уточнения стиля проявления темы в gate или activation", "использовать в слоях, указанных в used_in_layers", "использовать для контекстного чтения activation composition"], "forbidden_uses": ["не использовать как финальный вывод о человеке", "не использовать для fit_score или match_score", "не использовать для hire/no-hire decisions", "не подменять line-card profile-card или activation_position", "не читать line отдельно от gate и activation context"], "preferred_layers": ["communication_and_influence", "management_and_environment", "work_style", "pro_foundation"], "source_priority": "supporting", "ai_must_check": ["gate", "activation", "activation_position", "planet", "side", "profile", "type", "authority"]}, "source_chip": {"base_label": "Влияние через доверие", "pro_label": "Линия 4 · Связи", "short_role": "Показывает, что тема проявляется через доверие, контакты и устойчивые связи.", "role_in_this_layer": "Уточняет, где тема лучше передаётся через отношения, репутацию и доверительный контакт.", "link_target": "element://line/4"}}'::jsonb,
  '{"primary_context": ["gate", "activation", "profile"], "secondary_context": ["planet", "side", "activation_position", "communication_context", "team_environment"], "depends_on": "Итоговое чтение зависит от темы ворот, позиции активации, профиля, коммуникационного контекста и среды.", "related_element_kinds": ["gate", "activation", "profile", "planet", "side", "activation_position"], "context_note": "Линия 4 показывает стиль проявления темы через доверие и связи. Не читать как экстраверсию или обязательную социальность."}'::jsonb,
  '{"base": "Тема может искажаться через зависимость от реакции своего круга, страх потерять контакт или давление на близкие связи.", "pro": "Not-Self проявление Line 4 связано с неустойчивым отношением к сети: человек может держаться за привычный круг или пытаться влиять без настоящего доверия.", "warning_signals": ["человек боится потерять контакт", "держится только за привычный круг", "пытается влиять там, где доверие не сформировано"], "recovery_conditions": ["устойчивые договорённости", "доверительная коммуникация", "постепенное расширение круга", "ясная роль в группе"]}'::jsonb,
  '[{"contrast_context": "Line 4 в коммуникационной теме", "how_it_would_read": "Может усиливать передачу идей через доверие и знакомый круг.", "why_current_context_is_different": "Если тема не коммуникационная, line/4 всё равно указывает на relational style, но не делает человека коммуникатором по умолчанию."}, {"contrast_context": "Line 4 в profile/4/6", "how_it_would_read": "Связи соединяются со зрелой перспективой.", "why_current_context_is_different": "Отдельная line/4 не содержит всей динамики line/6."}, {"contrast_context": "Line 4 в холодной среде", "how_it_would_read": "Тема может проявляться слабее, если нет доверия и понятных контактов.", "why_current_context_is_different": "В доверительной среде та же тема может стать сильным каналом влияния."}, {"contrast_context": "Line 4 в центральной activation_position", "how_it_would_read": "Доверие и связи могут стать важной частью рабочей формулы.", "why_current_context_is_different": "В supporting-позиции line/4 только уточняет способ проявления отдельной темы."}, {"contrast_context": "Line 4 здорово / искажённо", "how_it_would_read": "В здоровом проявлении даёт влияние через доверие; в искажённом — зависимость от круга.", "why_current_context_is_different": "Качество проявления зависит от зрелости контакта и среды."}]'::jsonb,
  'expert_draft'
),

-- line/5
(
  'line',
  '5',
  'Линия 5',
  'ru',
  'v1',
  'Line 5 · Практическое решение

heretic, projection, practical solution, universalization, externalization

Line 5 adds practical influence, projection, universalization and solution-oriented externalization to the theme.

When a gate or activation is in the 5th line, the theme is often projected upon by others as useful, corrective or solution-bearing. This can increase influence and also projection pressure.',
  '## Название

Практическое решение

## Короткая суть

Эта линия показывает стиль, в котором рабочая тема проявляется как практическое решение, понятная польза или выход из проблемы для других.

## Как проявляется в работе

Человек может переводить тему в форму, которую другие воспринимают как полезную: совет, систему, объяснение, решение, инструкцию или способ справиться с задачей.

## Здоровое проявление

Человек предлагает применимые решения, видит, что можно упростить или исправить, и умеет делать сложное полезным для других.

## Искажённое проявление

Может попадать под чужие ожидания, брать на себя лишнюю ответственность, закрывать не свои задачи или становиться “решением для всех” без ясных границ.

## Как использовать

Давать задачи, где нужно сделать решение понятным и применимым. Важно заранее прояснять ожидания, границы ответственности и критерии результата.

## Что проверить в реальности

Есть ли у человека способность превращать тему в практическую пользу — и не попадает ли он в ловушку чужих ожиданий.

## Важно

Линия 5 не означает, что человек обязан решать чужие проблемы. Она показывает, что тема может восприниматься другими как потенциальное решение.',
  '## Линия 5 · Практическое влияние

## Technical meaning

Line 5 adds practical influence, projection, universalization and solution-oriented externalization to the theme.

## Mechanics

When a gate or activation is in the 5th line, the theme is often projected upon by others as useful, corrective or solution-bearing. This can increase influence and also projection pressure.

## Role in chart

Line 5 modifies a theme by making it more visible as a practical answer for others. It can create strong external expectations around the theme.

## Contextual reading

Line 5 should be read through gate, planet, side, activation_position, profile, communication context, management context and whole chart context.

## Correct expression

The theme expresses through practical solution, clear usefulness, working systems and the ability to offer an applicable way out.

## Not-Self expression

The theme may distort into over-responsibility, dependence on external expectations, trying to match projections or disappointment when expectations do not match reality.

## Interpretation limits

Do not conclude that the person is a rescuer or must lead others. Line 5 describes the field of practical solution and projection, not an obligation to satisfy expectations.',
  '["практическое решение", "понятная польза", "упрощение сложного", "влияние через применимость"]'::jsonb,
  '["чужие ожидания", "лишняя ответственность", "закрытие не своих задач", "разочарование из-за проекций"]'::jsonb,
  '["прояснять ожидания", "фиксировать границы ответственности", "давать задачи с практической пользой", "не превращать человека в универсальное решение для всех задач"]'::jsonb,
  '["ясные договорённости", "понятные критерии результата", "уважение к границам", "задачи с реальной применимостью"]'::jsonb,
  '["Не делать вывод, что человек спасатель или должен вести других.", "Line 5 описывает поле практического решения и проекций, а не обязанность соответствовать ожиданиям.", "Не использовать line/5 как финальный вывод о человеке.", "Не использовать для fit_score, match_score или решения о найме.", "Не читать линию отдельно от gate, activation_position, profile и whole chart context."]'::jsonb,
  '{"title": "Практическое решение", "base_label": "Практическое решение", "plain_meaning": "Эта линия показывает стиль, в котором рабочая тема проявляется как практическое решение, понятная польза или выход из проблемы для других.", "work_manifestation": "Человек может переводить тему в форму, которую другие воспринимают как полезную: совет, систему, объяснение, решение, инструкцию или способ справиться с задачей.", "healthy_expression": "Человек предлагает применимые решения, видит, что можно упростить или исправить, и умеет делать сложное полезным для других.", "distorted_expression": "Может попадать под чужие ожидания, брать на себя лишнюю ответственность, закрывать не свои задачи или становиться “решением для всех” без ясных границ.", "strengths": "практическое решение; понятная польза; упрощение сложного; влияние через применимость", "risks": "чужие ожидания; лишняя ответственность; закрытие не своих задач; разочарование из-за проекций", "when_it_works_best": "Давать задачи, где нужно сделать решение понятным и применимым. Важно заранее прояснять ожидания, границы ответственности и критерии результата.", "when_talent_is_not_revealed": "Может попадать под чужие ожидания, брать на себя лишнюю ответственность, закрывать не свои задачи или становиться “решением для всех” без ясных границ.", "development_hints": ["прояснять ожидания", "фиксировать границы ответственности", "давать задачи с практической пользой", "не превращать человека в универсальное решение для всех задач"], "communication_hints": ["прояснять ожидания", "фиксировать границы ответственности", "давать задачи с практической пользой", "не превращать человека в универсальное решение для всех задач"], "reality_check": "Есть ли у человека способность превращать тему в практическую пользу — и не попадает ли он в ловушку чужих ожиданий.", "important_note": "Линия 5 не означает, что человек обязан решать чужие проблемы. Она показывает, что тема может восприниматься другими как потенциальное решение."}'::jsonb,
  '{"hd_meaning": "Line 5 adds practical influence, projection, universalization and solution-oriented externalization to the theme.", "mechanics": "When a gate or activation is in the 5th line, the theme is often projected upon by others as useful, corrective or solution-bearing. This can increase influence and also projection pressure.", "classical_keywords": ["heretic", "projection", "practical solution", "universalization", "externalization"], "source_logic": "line/5 describes the universal style of manifestation for a gate or activation theme. Final reading depends on gate, planet, side, activation_position, profile, type, authority and whole chart context.", "role_in_chart": "Line 5 modifies a theme by making it more visible as a practical answer for others. It can create strong external expectations around the theme.", "contextual_reading": "Line 5 should be read through gate, planet, side, activation_position, profile, communication context, management context and whole chart context.", "correct_expression": "The theme expresses through practical solution, clear usefulness, working systems and the ability to offer an applicable way out.", "not_self_expression": "The theme may distort into over-responsibility, dependence on external expectations, trying to match projections or disappointment when expectations do not match reality.", "pro_not_self": "Not-Self проявление Line 5 связано с идентификацией с проекциями: человек пытается соответствовать ожиданиям поля вместо корректного применения темы.", "interpretation_limitations": "Do not conclude that the person is a rescuer or must lead others. Line 5 describes the field of practical solution and projection, not an obligation to satisfy expectations.", "card_metadata": {"editorial_version": "v0.1.1", "status": "approved_after_editorial_review", "ui_base_label": "Практическое решение", "ui_pro_label": "Линия 5 · Практическое влияние", "primary_layer_key": "pro_foundation", "link_target": "element://line/5", "source_file": "supabase/reference/element_cards/source/line_5.md", "used_in_layers": ["main_talents", "communication_and_influence", "risks_and_distortions", "management_and_environment", "pro_foundation"], "methodology_note": "Universal line card: describes style of manifestation, not a final person label. Read through gate, activation_position and whole chart context."}, "ai_source_rules": {"allowed_uses": ["использовать как supporting source для pro_foundation", "использовать для уточнения стиля проявления темы в gate или activation", "использовать в слоях, указанных в used_in_layers", "использовать для контекстного чтения activation composition"], "forbidden_uses": ["не использовать как финальный вывод о человеке", "не использовать для fit_score или match_score", "не использовать для hire/no-hire decisions", "не подменять line-card profile-card или activation_position", "не читать line отдельно от gate и activation context"], "preferred_layers": ["main_talents", "communication_and_influence", "risks_and_distortions", "management_and_environment", "pro_foundation"], "source_priority": "supporting", "ai_must_check": ["gate", "activation", "activation_position", "planet", "side", "profile", "type", "authority"]}, "source_chip": {"base_label": "Практическое решение", "pro_label": "Линия 5 · Практическое влияние", "short_role": "Показывает, что тема проявляется как решение, польза или ответ на ожидания других.", "role_in_this_layer": "Уточняет, где тема может стать практическим решением, но требует ясных границ ожиданий.", "link_target": "element://line/5"}}'::jsonb,
  '{"primary_context": ["gate", "activation", "profile"], "secondary_context": ["planet", "side", "activation_position", "communication_context", "management_context"], "depends_on": "Итоговое чтение зависит от темы ворот, позиции активации, профиля, ожиданий среды и управленческого контекста.", "related_element_kinds": ["gate", "activation", "profile", "planet", "side", "activation_position"], "context_note": "Линия 5 показывает стиль практического решения и поле проекций. Не читать как обязанность закрывать чужие ожидания."}'::jsonb,
  '{"base": "Тема может искажаться через лишнюю ответственность, попадание под чужие ожидания или попытку быть решением для всех.", "pro": "Not-Self проявление Line 5 связано с идентификацией с проекциями: человек пытается соответствовать ожиданиям поля вместо корректного применения темы.", "warning_signals": ["человек берёт на себя не свои задачи", "пытается соответствовать всем ожиданиям", "получает разочарование среды из-за неясных договорённостей"], "recovery_conditions": ["ясные ожидания", "границы ответственности", "понятные критерии результата", "разделение реального запроса и проекции"]}'::jsonb,
  '[{"contrast_context": "Line 5 в коммуникационной теме", "how_it_would_read": "Может давать способность объяснять решение так, чтобы другие могли его применить.", "why_current_context_is_different": "В теме тела, энергии или среды line/5 будет не про речь, а про практическую применимость самой темы."}, {"contrast_context": "Line 5 в profile/5/1", "how_it_would_read": "Практическое решение соединяется с потребностью в фундаменте.", "why_current_context_is_different": "Отдельная line/5 не содержит всей исследовательской основы line/1."}, {"contrast_context": "Line 5 под сильными ожиданиями среды", "how_it_would_read": "Может проявиться как давление быть решением для всех.", "why_current_context_is_different": "При ясных границах та же тема становится сильным практическим вкладом."}, {"contrast_context": "Line 5 в центральной activation_position", "how_it_would_read": "Практическое решение может быть заметной частью рабочей формулы.", "why_current_context_is_different": "В supporting-позиции line/5 может быть только способом подачи отдельной темы."}, {"contrast_context": "Line 5 здорово / искажённо", "how_it_would_read": "В здоровом проявлении даёт применимое решение; в искажённом — ловушку чужих ожиданий.", "why_current_context_is_different": "Разница зависит от ясности запроса, роли и границ."}]'::jsonb,
  'expert_draft'
),

-- line/6
(
  'line',
  '6',
  'Линия 6',
  'ru',
  'v1',
  'Line 6 · Зрелая перспектива

role model, maturity, perspective, observer, exemplar

Line 6 adds perspective, maturity, observation, role-model potential and gradual refinement of the theme through lived experience.

When a gate or activation is in the 6th line, the theme is not automatically wise or complete. It tends to mature through experience, observation, distance and reevaluation.',
  '## Название

Зрелая перспектива

## Короткая суть

Эта линия показывает стиль, в котором рабочая тема раскрывается через зрелость, наблюдение, дистанцию, перспективу и способность видеть общую картину.

## Как проявляется в работе

Человек может видеть тему шире: не только как отдельную задачу, а как часть пути, системы, опыта и долгосрочного развития.

## Здоровое проявление

Человек становится ориентиром: видит паттерны, помогает не застревать в частностях, даёт спокойную перспективу и зрелую оценку ситуации.

## Искажённое проявление

Может отстраняться, смотреть сверху, преждевременно играть роль эксперта, терять контакт с практикой или разочаровываться в несовершенстве реальности.

## Как использовать

Давать задачи, где важны перспектива, зрелый взгляд, оценка опыта, развитие подхода и способность видеть не только текущую проблему, но и дальнейшие последствия.

## Что проверить в реальности

Даёт ли человек зрелую перспективу из опыта — или уходит в дистанцию, оценочность и отсутствие практического участия.

## Важно

Линия 6 не означает автоматическую мудрость. Она показывает, что тема стремится к зрелому выражению, но качество проявления зависит от опыта, профессионального этапа, роли и общего контекста профиля.',
  '## Линия 6 · Роль-модель

## Technical meaning

Line 6 adds perspective, maturity, observation, role-model potential and gradual refinement of the theme through lived experience.

## Mechanics

When a gate or activation is in the 6th line, the theme is not automatically wise or complete. It tends to mature through experience, observation, distance and reevaluation.

## Role in chart

Line 6 modifies a theme by giving it a trajectory toward mature expression and broader perspective. It may become more reliable when supported by experience and correct role context.

## Contextual reading

Line 6 should be read through gate, planet, side, activation_position, profile, professional stage, work role and whole chart context.

## Correct expression

The theme expresses as mature perspective, calm evaluation, recognition of patterns and the ability to become an example through lived experience.

## Not-Self expression

The theme may distort into distance, idealization, disappointment, premature expertise or observation without grounded participation.

## Interpretation limits

Do not conclude that the person is already wise, detached or a role model. Line 6 shows the maturation direction of the theme, not a guaranteed level of expression.',
  '["широкая перспектива", "видение паттернов", "зрелая оценка", "ориентир для других"]'::jsonb,
  '["отстранённость", "идеализация", "разочарование в реальности", "преждевременная экспертность"]'::jsonb,
  '["давать задачи с перспективой", "использовать способность видеть последствия", "не требовать мгновенной практической реакции во всём", "проверять связь взгляда с реальностью"]'::jsonb,
  '["пространство для наблюдения", "уважение к опыту", "долгосрочный горизонт", "роль, где ценится перспектива"]'::jsonb,
  '["Не делать вывод, что человек уже мудрый, отстранённый или role model.", "Line 6 показывает направление созревания темы, а не гарантированный уровень проявления.", "Не использовать line/6 как финальный вывод о человеке.", "Не использовать для fit_score, match_score или решения о найме.", "Не читать линию отдельно от gate, activation_position, profile и whole chart context."]'::jsonb,
  '{"title": "Зрелая перспектива", "base_label": "Зрелая перспектива", "plain_meaning": "Эта линия показывает стиль, в котором рабочая тема раскрывается через зрелость, наблюдение, дистанцию, перспективу и способность видеть общую картину.", "work_manifestation": "Человек может видеть тему шире: не только как отдельную задачу, а как часть пути, системы, опыта и долгосрочного развития.", "healthy_expression": "Человек становится ориентиром: видит паттерны, помогает не застревать в частностях, даёт спокойную перспективу и зрелую оценку ситуации.", "distorted_expression": "Может отстраняться, смотреть сверху, преждевременно играть роль эксперта, терять контакт с практикой или разочаровываться в несовершенстве реальности.", "strengths": "широкая перспектива; видение паттернов; зрелая оценка; ориентир для других", "risks": "отстранённость; идеализация; разочарование в реальности; преждевременная экспертность", "when_it_works_best": "Давать задачи, где важны перспектива, зрелый взгляд, оценка опыта, развитие подхода и способность видеть не только текущую проблему, но и дальнейшие последствия.", "when_talent_is_not_revealed": "Может отстраняться, смотреть сверху, преждевременно играть роль эксперта, терять контакт с практикой или разочаровываться в несовершенстве реальности.", "development_hints": ["давать задачи с перспективой", "использовать способность видеть последствия", "не требовать мгновенной практической реакции во всём", "проверять связь взгляда с реальностью"], "communication_hints": ["давать задачи с перспективой", "использовать способность видеть последствия", "не требовать мгновенной практической реакции во всём", "проверять связь взгляда с реальностью"], "reality_check": "Даёт ли человек зрелую перспективу из опыта — или уходит в дистанцию, оценочность и отсутствие практического участия.", "important_note": "Линия 6 не означает автоматическую мудрость. Она показывает, что тема стремится к зрелому выражению, но качество проявления зависит от опыта, профессионального этапа, роли и общего контекста профиля."}'::jsonb,
  '{"hd_meaning": "Line 6 adds perspective, maturity, observation, role-model potential and gradual refinement of the theme through lived experience.", "mechanics": "When a gate or activation is in the 6th line, the theme is not automatically wise or complete. It tends to mature through experience, observation, distance and reevaluation.", "classical_keywords": ["role model", "maturity", "perspective", "observer", "exemplar"], "source_logic": "line/6 describes the universal style of manifestation for a gate or activation theme. Final reading depends on gate, planet, side, activation_position, profile, type, authority and whole chart context.", "role_in_chart": "Line 6 modifies a theme by giving it a trajectory toward mature expression and broader perspective. It may become more reliable when supported by experience and correct role context.", "contextual_reading": "Line 6 should be read through gate, planet, side, activation_position, profile, professional stage, work role and whole chart context.", "correct_expression": "The theme expresses as mature perspective, calm evaluation, recognition of patterns and the ability to become an example through lived experience.", "not_self_expression": "The theme may distort into distance, idealization, disappointment, premature expertise or observation without grounded participation.", "pro_not_self": "Not-Self проявление Line 6 связано с попыткой занять позицию зрелого наблюдателя до интеграции опыта или с уходом в дистанцию вместо корректного участия.", "interpretation_limitations": "Do not conclude that the person is already wise, detached or a role model. Line 6 shows the maturation direction of the theme, not a guaranteed level of expression.", "card_metadata": {"editorial_version": "v0.1.1", "status": "approved_after_editorial_review", "ui_base_label": "Зрелая перспектива", "ui_pro_label": "Линия 6 · Роль-модель", "primary_layer_key": "pro_foundation", "link_target": "element://line/6", "source_file": "supabase/reference/element_cards/source/line_6.md", "used_in_layers": ["development_potential", "management_and_environment", "work_style", "pro_foundation"], "methodology_note": "Universal line card: describes style of manifestation, not a final person label. Read through gate, activation_position and whole chart context."}, "ai_source_rules": {"allowed_uses": ["использовать как supporting source для pro_foundation", "использовать для уточнения стиля проявления темы в gate или activation", "использовать в слоях, указанных в used_in_layers", "использовать для контекстного чтения activation composition"], "forbidden_uses": ["не использовать как финальный вывод о человеке", "не использовать для fit_score или match_score", "не использовать для hire/no-hire decisions", "не подменять line-card profile-card или activation_position", "не читать line отдельно от gate и activation context"], "preferred_layers": ["development_potential", "management_and_environment", "work_style", "pro_foundation"], "source_priority": "supporting", "ai_must_check": ["gate", "activation", "activation_position", "planet", "side", "profile", "type", "authority"]}, "source_chip": {"base_label": "Зрелая перспектива", "pro_label": "Линия 6 · Роль-модель", "short_role": "Показывает, что тема проявляется через зрелость, перспективу и способность видеть общую картину.", "role_in_this_layer": "Уточняет, где тема стремится к зрелому выражению, перспективе и роли ориентира.", "link_target": "element://line/6"}}'::jsonb,
  '{"primary_context": ["gate", "activation", "profile"], "secondary_context": ["planet", "side", "activation_position", "professional_stage", "work_role"], "depends_on": "Итоговое чтение зависит от темы ворот, позиции активации, профиля, профессионального этапа, роли и общего контекста карты.", "related_element_kinds": ["gate", "activation", "profile", "planet", "side", "activation_position"], "context_note": "Линия 6 показывает стиль созревания темы через перспективу и опыт. Не читать как автоматическую мудрость."}'::jsonb,
  '{"base": "Тема может искажаться через отстранённость, преждевременную экспертность, идеализацию или разочарование в реальности.", "pro": "Not-Self проявление Line 6 связано с попыткой занять позицию зрелого наблюдателя до интеграции опыта или с уходом в дистанцию вместо корректного участия.", "warning_signals": ["человек смотрит сверху, но не участвует практически", "делает выводы без достаточной опоры на опыт", "разочаровывается, когда реальность не соответствует идеалу"], "recovery_conditions": ["контакт с практикой", "роль, где ценится перспектива", "реалистичный горизонт развития", "интеграция опыта в спокойный вывод"]}'::jsonb,
  '[{"contrast_context": "Line 6 в теме развития", "how_it_would_read": "Может усиливать способность видеть путь, этапы и долгосрочную перспективу.", "why_current_context_is_different": "В теме коммуникации line/6 может проявиться как зрелый тон объяснения, а не как развитие само по себе."}, {"contrast_context": "Line 6 в profile/6/2", "how_it_would_read": "Зрелая перспектива соединяется с естественным даром.", "why_current_context_is_different": "Отдельная line/6 не содержит всей динамики line/2."}, {"contrast_context": "Line 6 без практической опоры", "how_it_would_read": "Может звучать как дистанция или преждевременная экспертность.", "why_current_context_is_different": "С прожитым опытом та же тема может стать зрелой перспективой."}, {"contrast_context": "Line 6 в центральной activation_position", "how_it_would_read": "Зрелая перспектива может стать важной частью рабочей формулы.", "why_current_context_is_different": "В supporting-позиции line/6 может только уточнять стиль отдельной темы."}, {"contrast_context": "Line 6 здорово / искажённо", "how_it_would_read": "В здоровом проявлении даёт зрелый ориентир; в искажённом — дистанцию и идеализацию.", "why_current_context_is_different": "Разница зависит от опыта, роли, контакта с реальностью и условий проявления."}]'::jsonb,
  'expert_draft'
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
