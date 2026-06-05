-- Stage 4-B: HD Reference Interpretations — all 64 gates (ru / v1)
-- Run after 202606050002_hd_reference_interpretation_bundle_v0_1.sql
-- Idempotent upserts via (element_kind, element_key, language, version)

insert into public.hd_reference_interpretations (
  element_kind, element_key, element_label, language, version,
  classic_markdown, hr_translation_markdown, pro_markdown,
  talent_hints, risk_hints, management_hints, environment_hints, limitations,
  base_layers, pro_layers, context_rules, not_self_layers, contrast_examples,
  source_quality
) values

-- GATE 1: Self-Expression
(
  'gate', '1', 'Ворота 1', 'ru', 'v1',
  'Gate 1 — Self-Expression (The Creative): уникальное творческое самовыражение, которое ищет форму и признание.',
  'Человек с этой темой тянется к **уникальному вкладу** — хочет делать по-своему и быть замеченным за оригинальность. В команде это может быть дизайнер, автор, продуктовый визионер, который задаёт новый стандарт.',
  'Gate 1 in G Center — Individual Circuit creative expression. Theme: mutation through unique creative direction; needs correct audience and timing.',
  '["оригинальность", "творческое лидерство", "способность задавать новый стандарт"]'::jsonb,
  '["обида, если идеи не признают", "упрямство в «своём» стиле", "зависимость от внешнего одобрения"]'::jsonb,
  '["давать пространство для авторского подхода", "признавать уникальный вклад публично", "не заставлять копировать чужие шаблоны"]'::jsonb,
  '["культура, где ценят новизну", "время на творческую проработку", "аудитория, готовая слушать"]'::jsonb,
  '["слабее в ролях жёсткого копирования чужих решений"]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Стремление выразить себя уникально и быть увиденным за это.',
    'work_manifestation', 'Приносит свежие идеи, нестандартные решения, личный стиль в продукт или процесс.',
    'strengths', 'Оригинальность; смелость отличаться; способность вдохновлять новым направлением.',
    'risks', 'Обижается при игноре; может спорить ради стиля; ждёт признания слишком долго.',
    'when_it_works_best', 'Когда есть право на авторский подход и обратная связь о ценности идей.',
    'when_talent_is_not_revealed', 'Когда заставляют работать «как все» без права на собственный голос.'
  ),
  jsonb_build_object(
    'hd_meaning', 'Gate 1 — creative self-expression in Identity direction.',
    'mechanics', 'Individual knowing circuit; expression mutates collective patterns when correctly timed.',
    'classical_keywords', '["creative", "unique", "self-expression", "mutation"]'::jsonb,
    'source_logic', 'Gate interpretation. Final reading depends on center, channel, line, planet activation, side personality/design and whole chart context.',
    'pro_not_self', 'Creative bitterness when expression is blocked or unrecognized.'
  ),
  jsonb_build_object(
    'primary_context', '["center", "channel", "activation", "line"]'::jsonb,
    'secondary_context', '["type", "strategy", "authority", "profile", "definition"]'::jsonb,
    'depends_on', 'Gate meaning must be adjusted by center, channel completion, planet activation, line and whole chart mechanics.',
    'related_element_kinds', '["activation", "channel", "defined_center", "open_center", "type", "strategy", "authority", "profile"]'::jsonb,
    'context_note', 'Standalone gate reference is only a semantic building block. It is not a final personality conclusion.'
  ),
  jsonb_build_object(
    'base', 'Человек копирует тренды и ждёт, что его «заметят сами», вместо того чтобы делать по-своему.',
    'pro', 'Not-Self: seeking recognition without authentic creative direction.',
    'warning_signals', '["потеря вкуса и радости от работы", "раздражение на «серые» задачи", "цинизм к креативу"]'::jsonb,
    'recovery_conditions', '["явное признание вклада", "проект с правом на авторство", "снижение давления «делай как в гайде»"]'::jsonb
  ),
  jsonb_build_array(
    jsonb_build_object(
      'contrast_context', 'Тема в фоновой активации без канала и без ключевой планеты',
      'how_it_would_read', 'Могло бы читаться как лёгкая склонность к оригинальности, а не как главный талант.',
      'why_current_context_is_different', 'С полным каналом, линией и планетой тема самовыражения становится центральной рабочей силой.'
    )
  ),
  'draft'
),

-- GATE 2: Higher Knowledge
(
  'gate', '2', 'Ворота 2', 'ru', 'v1',
  'Gate 2 — Higher Knowledge (The Receptive): направление и высшее знание, которое раскрывается через правильный отклик среды.',
  'Тема **направления и чуткости к контексту**: человек лучше понимает, куда двигаться, когда его спрашивают и дают пространство. Может быть стратегом, советником, навигатором сложных решений.',
  'Gate 2 in G Center — Direction of the Self. Receptive knowing; pairs with Gate 14 in Channel 2-14.',
  '["стратегическое направление", "чуткость к контексту", "способность вести без давления"]'::jsonb,
  '["пассивность без запроса", "зависимость от внешнего импульса", "сомнение в своём направлении"]'::jsonb,
  '["запрашивать мнение по курсу", "не требовать инициативы без рамки", "давать время на созревание решения"]'::jsonb,
  '["культура вопросов, а не приказов", "стабильный ритм без хаоса", "доверие к экспертизе"]'::jsonb,
  '["не идеален для роли «всегда первым бросаться вперёд»"]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Лучше всего задаёт направление, когда его приглашают и слушают.',
    'work_manifestation', 'Помогает команде понять «куда идти», видит скрытые возможности и риски курса.',
    'strengths', 'Стратегическая чуткость; спокойное лидерство; умение ждать правильный момент.',
    'risks', 'Может казаться пассивным; ждёт запроса слишком долго; сомневается без подтверждения.',
    'when_it_works_best', 'Когда руководство и команда регулярно спрашивают его взгляд на курс.',
    'when_talent_is_not_revealed', 'Когда от него ждут постоянной самоинициативы и быстрых решений без контекста.'
  ),
  jsonb_build_object(
    'hd_meaning', 'Gate 2 — magnetic direction through receptive knowing.',
    'mechanics', 'Works with Sacral response via Channel 2-14; direction needs correct fuel/invitation.',
    'classical_keywords', '["direction", "receptive", "higher knowledge", "driver"]'::jsonb,
    'source_logic', 'Gate interpretation. Final reading depends on center, channel, line, planet activation, side personality/design and whole chart context.',
    'pro_not_self', 'Directionlessness when acting without being asked or recognized.'
  ),
  jsonb_build_object(
    'primary_context', '["center", "channel", "activation", "line"]'::jsonb,
    'secondary_context', '["type", "strategy", "authority", "profile", "definition"]'::jsonb,
    'depends_on', 'Gate meaning must be adjusted by center, channel completion, planet activation, line and whole chart mechanics.',
    'related_element_kinds', '["activation", "channel", "defined_center", "open_center", "type", "strategy", "authority", "profile"]'::jsonb,
    'context_note', 'Standalone gate reference is only a semantic building block. It is not a final personality conclusion.'
  ),
  jsonb_build_object(
    'base', 'Берёт чужие цели за свои и ждёт, что «направление придёт само».',
    'pro', 'Lost direction — following others'' paths without inner magnetic pull.',
    'warning_signals', '["потеря ориентира в проектах", "согласие на чужие цели", "апатия к стратегии"]'::jsonb,
    'recovery_conditions', '["явный запрос на навигацию", "снижение шума и давления", "партнёрство с теми, кто даёт импульс"]'::jsonb
  ),
  jsonb_build_array(
    jsonb_build_object(
      'contrast_context', 'Gate 2 без Gate 14 (нет полного канала 2-14)',
      'how_it_would_read', 'Направление могло бы ощущаться как фоновая мудрость, а не как драйвер решений.',
      'why_current_context_is_different', 'С полным каналом 2-14 направление получает устойчивую энергию реализации.'
    )
  ),
  'draft'
),

-- GATE 3: Ordering
(
  'gate', '3', 'Ворота 3', 'ru', 'v1',
  'Gate 3 — Ordering (Difficulty at the Beginning): мутация и упорядочивание хаоса в начале нового цикла.',
  'Тема **запуска нового** и наведения порядка там, где всё только начинается. Человек может быть сильным в пилотах, MVP, реорганизациях — но ему нужна терпимость к «беспорядку старта».',
  'Gate 3 in Sacral — Mutation at beginnings. Channel 3-60 with Gate 60; starts new forms through chaos ordering.',
  '["запуск нового", "структурирование хаоса", "энергия начала цикла"]'::jsonb,
  '["фрустрация от медленного старта", "бросание на полпути", "конфликт с «устоявшимися» процессами"]'::jsonb,
  '["давать роль в ранней фазе проектов", "терпеть временный беспорядок", "фиксировать критерии «старт готов»"]'::jsonb,
  '["пилотные зоны и sandbox", "право экспериментировать", "команда, не боящаяся неизвестного"]'::jsonb,
  '["может уставать от бесконечной «рутины после запуска»"]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Сильнее всего там, где нужно начать новое и привести хаос в рабочий порядок.',
    'work_manifestation', 'Берёт сырой проект, прототип или новый процесс и доводит до первого рабочего состояния.',
    'strengths', 'Энергия старта; умение структурировать неопределённость; смелость в новом.',
    'risks', 'Раздражение от задержек; спешка «закрыть» старт; сопротивление зрелой рутине.',
    'when_it_works_best', 'Ранние фазы, пилоты, MVP, трансформации с понятной целью.',
    'when_talent_is_not_revealed', 'Когда заставляют только поддерживать старое без права менять.'
  ),
  jsonb_build_object(
    'hd_meaning', 'Gate 3 — Sacral mutation ordering new beginnings.',
    'mechanics', 'Individual knowing; pairs with Gate 60 in Channel of Mutation.',
    'classical_keywords', '["mutation", "ordering", "beginning", "chaos"]'::jsonb,
    'source_logic', 'Gate interpretation. Final reading depends on center, channel, line, planet activation, side personality/design and whole chart context.',
    'pro_not_self', 'Frustration when beginnings are blocked or rushed without response.'
  ),
  jsonb_build_object(
    'primary_context', '["center", "channel", "activation", "line"]'::jsonb,
    'secondary_context', '["type", "strategy", "authority", "profile", "definition"]'::jsonb,
    'depends_on', 'Gate meaning must be adjusted by center, channel completion, planet activation, line and whole chart mechanics.',
    'related_element_kinds', '["activation", "channel", "defined_center", "open_center", "type", "strategy", "authority", "profile"]'::jsonb,
    'context_note', 'Standalone gate reference is only a semantic building block. It is not a final personality conclusion.'
  ),
  jsonb_build_object(
    'base', 'Начинает многое и бросает, когда старт становится «не тем».',
    'pro', 'Sacral frustration — initiating without correct response at beginning.',
    'warning_signals', '["цепочка незавершённых пилотов", "раздражение на процессы", "конфликт с консерватизмом"]'::jsonb,
    'recovery_conditions', '["чёткая рамка пилота", "право сказать «нет» проекту", "партнёр для доведения до зрелости"]'::jsonb
  ),
  jsonb_build_array(
    jsonb_build_object(
      'contrast_context', 'Gate 3 в открытом Sacral без стабильного отклика',
      'how_it_would_read', 'Могло бы проявляться как идеи о новом, без устойчивой энергии доведения.',
      'why_current_context_is_different', 'В определённом Sacral с откликом тема запуска получает телесную поддержку.'
    )
  ),
  'draft'
),

-- GATE 4: Formulization
(
  'gate', '4', 'Ворота 4', 'ru', 'v1',
  'Gate 4 — Formulization (Youthful Folly): формулирование ответов и ментальных решений, часто преждевременных.',
  'Тема **быстрых ответов и формулировок**: человек умеет давать объяснения, гипотезы, «формулы» решений. Риск — отвечать раньше, чем достаточно данных.',
  'Gate 4 in Ajna — Mental answers and formulization. Channel 4-63 with Gate 63; pressure to answer doubts.',
  '["быстрые формулировки", "объяснение сложного", "генерация гипотез"]'::jsonb,
  '["преждевременные ответы", "упрямство в своей логике", "тревога от незакрытых вопросов"]'::jsonb,
  '["давать время на проверку гипотез", "не требовать «ответ сейчас» по сложному", "ценить вопросы, а не только ответы"]'::jsonb,
  '["культура исследования", "доступ к данным", "право пересматривать выводы"]'::jsonb,
  '["не лучший в роли «единственного источника истины без проверки»"]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Быстро формулирует ответы и объяснения, иногда раньше времени.',
    'work_manifestation', 'Помогает команде назвать проблему, предложить рабочую гипотезу, структурировать знание.',
    'strengths', 'Ясные формулировки; скорость мышления; обучающий стиль.',
    'risks', 'Отвечает без проверки; цепляется за первую версию; тревожится из-за открытых вопросов.',
    'when_it_works_best', 'Когда гипотезы проверяются, а не объявляются финалом.',
    'when_talent_is_not_revealed', 'Когда от него ждут непогрешимых ответов без права ошибиться.'
  ),
  jsonb_build_object(
    'hd_meaning', 'Gate 4 — Ajna formulization under Head doubt pressure.',
    'mechanics', 'Collective logic circuit; connects to Gate 63 in Channel of Logic.',
    'classical_keywords', '["formulization", "answers", "mental", "folly"]'::jsonb,
    'source_logic', 'Gate interpretation. Final reading depends on center, channel, line, planet activation, side personality/design and whole chart context.',
    'pro_not_self', 'Mental anxiety from answering before logic is complete.'
  ),
  jsonb_build_object(
    'primary_context', '["center", "channel", "activation", "line"]'::jsonb,
    'secondary_context', '["type", "strategy", "authority", "profile", "definition"]'::jsonb,
    'depends_on', 'Gate meaning must be adjusted by center, channel completion, planet activation, line and whole chart mechanics.',
    'related_element_kinds', '["activation", "channel", "defined_center", "open_center", "type", "strategy", "authority", "profile"]'::jsonb,
    'context_note', 'Standalone gate reference is only a semantic building block. It is not a final personality conclusion.'
  ),
  jsonb_build_object(
    'base', 'Выдаёт уверенные ответы без проверки и защищает их как истину.',
    'pro', 'Not-Self mental answer — folly of premature certainty.',
    'warning_signals', '["споры ради «правоты»", "тревога от вопросов", "обесценивание чужих данных"]'::jsonb,
    'recovery_conditions', '["явный цикл проверки", "партнёр-скептик", "разрешение сказать «пока не знаю»"]'::jsonb
  ),
  jsonb_build_array(
    jsonb_build_object(
      'contrast_context', 'Gate 4 под давлением Gate 63 без полного канала 4-63',
      'how_it_would_read', 'Ответы могли бы ощущаться как фоновая склонность к объяснениям.',
      'why_current_context_is_different', 'С полным логическим каналом формулировка становится частью системы доказательства.'
    )
  ),
  'draft'
),

-- GATE 5: Fixed Rhythms
(
  'gate', '5', 'Ворота 5', 'ru', 'v1',
  'Gate 5 — Fixed Rhythms (Waiting): фиксированные ритмы, привычки и терпеливое ожидание правильного момента.',
  'Тема **ритма и режима**: человеку важны предсказуемые циклы, стабильный темп, ожидание «своего» времени. Силён в ролях, где ценится надёжность и повторяемость.',
  'Gate 5 in Sacral — Fixed patterns and rhythms. Channel 5-15 with Gate 15; natural timing in flow.',
  '["стабильный ритм работы", "надёжность", "чувство правильного момента"]'::jsonb,
  '["жёсткость к изменениям расписания", "раздражение при срыве режима", "медлительность без контекста"]'::jsonb,
  '["уважать рабочие циклы", "предупреждать о смене ритма заранее", "не путать ожидание с ленью"]'::jsonb,
  '["предсказуемые процессы", "ясные слоты времени", "культура договорённостей"]'::jsonb,
  '["сложнее в хаотичных «всё срочно» средах"]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Работает лучше в устойчивом ритме и правильном тайминге.',
    'work_manifestation', 'Держит режим, выдерживает циклы, приходит вовремя к зрелым решениям.',
    'strengths', 'Надёжность; терпение; чувство момента.',
    'risks', 'Сопротивление внезапным сдвигам; кажется «медленным»; раздражение при хаосе.',
    'when_it_works_best', 'Процессы с понятным календарём и уважением к циклам.',
    'when_talent_is_not_revealed', 'Когда график рвут без предупреждения и ждут мгновенной реакции.'
  ),
  jsonb_build_object(
    'hd_meaning', 'Gate 5 — Sacral fixed rhythm and universal waiting.',
    'mechanics', 'Collective understanding; Channel 5-15 binds rhythm to extremes of humanity.',
    'classical_keywords', '["rhythm", "waiting", "habits", "timing"]'::jsonb,
    'source_logic', 'Gate interpretation. Final reading depends on center, channel, line, planet activation, side personality/design and whole chart context.',
    'pro_not_self', 'Frustration when forced out of natural rhythm or timing.'
  ),
  jsonb_build_object(
    'primary_context', '["center", "channel", "activation", "line"]'::jsonb,
    'secondary_context', '["type", "strategy", "authority", "profile", "definition"]'::jsonb,
    'depends_on', 'Gate meaning must be adjusted by center, channel completion, planet activation, line and whole chart mechanics.',
    'related_element_kinds', '["activation", "channel", "defined_center", "open_center", "type", "strategy", "authority", "profile"]'::jsonb,
    'context_note', 'Standalone gate reference is only a semantic building block. It is not a final personality conclusion.'
  ),
  jsonb_build_object(
    'base', 'Ломает свой режим ради чужого давления и выгорает.',
    'pro', 'Sacral frustration — abandoning fixed rhythm for external urgency.',
    'warning_signals', '["хроническая усталость", "цинизм к «срочности»", "срывы дедлайнов из протеста"]'::jsonb,
    'recovery_conditions', '["восстановление режима", "защита слотов фокуса", "договор о реалистичных сроках"]'::jsonb
  ),
  jsonb_build_array(
    jsonb_build_object(
      'contrast_context', 'Gate 5 без Gate 15',
      'how_it_would_read', 'Ритм мог бы быть личной привычкой, а не коллективной темой.',
      'why_current_context_is_different', 'С каналом 5-15 ритм связывается с широким человеческим контекстом.'
    )
  ),
  'draft'
),

-- GATE 6: Friction
(
  'gate', '6', 'Ворота 6', 'ru', 'v1',
  'Gate 6 — Friction: тема эмоционального трения, границ близости и регулирования конфликта перед сближением.',
  'Человек тонко чувствует, где отношения становятся слишком тесными, а где дистанция уже разрушает контакт. Он умеет ставить границы так, чтобы сохранить уважение, а не обрывать связь. В напряженных переговорах может стать тем, кто переводит спор в договоренности о правилах взаимодействия.',
  'Gate 6 in Solar Plexus governs friction at the boundary of intimacy. It is the emotional gate of the 59-6 channel, testing readiness for bonding. Correct timing and mood determine whether contact becomes trust or conflict.',
  '["настройка границ в отношениях", "перевод конфликта в диалог", "эмоциональная дипломатия"]'::jsonb,
  '["резкие реакции в близком контакте", "затяжные обиды", "путаница между близостью и контролем"]'::jsonb,
  '["фиксировать правила взаимодействия заранее", "проводить сложные разговоры в спокойной фазе", "разделять тему и эмоцию в конфликте"]'::jsonb,
  '["психологически безопасная команда", "прозрачные нормы коммуникации", "пространство для обратной связи"]'::jsonb,
  '["сложно работать там, где поощряют постоянное давление без диалога"]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Чувствует границу между здоровой близостью и разрушительным напряжением.',
    'work_manifestation', 'Помогает команде договариваться о правилах контакта, особенно в чувствительных темах.',
    'strengths', 'Тонкая чувствительность; умение обозначать рамки; способность снижать накал.',
    'risks', 'Импульсивность в эмоциях; уход в оборону; затяжные личные конфликты.',
    'when_it_works_best', 'Когда есть ясные договоренности о границах и время на спокойное обсуждение.',
    'when_talent_is_not_revealed', 'Когда людей сталкивают лбами и требуют близости без доверия.'
  ),
  jsonb_build_object(
    'hd_meaning', 'Gate 6 regulates emotional boundaries and intimacy friction.',
    'mechanics', 'Solar Plexus wave modulates openness; in Channel 59-6 it gates bonding chemistry.',
    'classical_keywords', '["friction", "boundaries", "intimacy", "emotional clarity"]'::jsonb,
    'source_logic', 'Gate interpretation. Final reading depends on center, channel, line, planet activation, side personality/design and whole chart context.',
    'pro_not_self', 'Emotional reactivity turns boundary intelligence into relational warfare.'
  ),
  jsonb_build_object(
    'primary_context', '["center", "channel", "activation", "line"]'::jsonb,
    'secondary_context', '["type", "strategy", "authority", "profile", "definition"]'::jsonb,
    'depends_on', 'Gate meaning must be adjusted by center, channel completion, planet activation, line and whole chart mechanics.',
    'related_element_kinds', '["activation", "channel", "defined_center", "open_center", "type", "strategy", "authority", "profile"]'::jsonb,
    'context_note', 'Standalone gate reference is only a semantic building block. It is not a final personality conclusion.'
  ),
  jsonb_build_object(
    'base', 'Сначала сближается, потом резко закрывается, не объясняя причин.',
    'pro', 'Not-Self pattern: reactive friction without emotional clarity.',
    'warning_signals', '["частые качели «приближение-отдаление»", "личные споры вместо рабочих решений", "непредсказуемость в контакте"]'::jsonb,
    'recovery_conditions', '["пауза перед разговором", "согласованные правила близких взаимодействий", "прояснение ожиданий обеих сторон"]'::jsonb
  ),
  jsonb_build_array(
    jsonb_build_object(
      'contrast_context', 'Gate 6 activated without full 59-6 channel',
      'how_it_would_read', 'May read as selective boundary sensitivity rather than a stable intimacy gate.',
      'why_current_context_is_different', 'With full channel definition, friction becomes a consistent mechanism for relational filtering.'
    )
  ),
  'draft'
),

-- GATE 7: Role of Self
(
  'gate', '7', 'Ворота 7', 'ru', 'v1',
  'Gate 7 — Role of Self: направление лидерства в группе через роль координатора и проводника курса.',
  'Человек хорошо держит общее направление в командной работе и собирает людей вокруг понятной цели. Ему легче вести, когда есть запрос от группы, а не борьба за статус. Часто это тихий координатор, который помогает другим занять свои сильные позиции.',
  'Gate 7 in the G Center expresses the role of the self in collective direction. It is a democratic leadership tone of the logical stream. With Gate 31, it forms the channel of leadership through voice and recognition.',
  '["координация людей вокруг цели", "групповая навигация", "лидерство через служение делу"]'::jsonb,
  '["перегруз чужими ожиданиями", "руководство без запроса", "разочарование при игноре роли"]'::jsonb,
  '["делегировать публичное признание роли", "давать мандат на координацию", "регулярно сверять общий курс"]'::jsonb,
  '["зрелая командная культура", "прозрачные роли", "общая цель выше эго"]'::jsonb,
  '["слабо проявляется в среде личной конкуренции за влияние"]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Задает группе направление и собирает людей вокруг общего движения.',
    'work_manifestation', 'Помогает команде сохранять курс, распределять роли и снижать хаос в приоритетах.',
    'strengths', 'Системное видение; спокойная координация; уважение к общей цели.',
    'risks', 'Берет ответственность без полномочий; устает от политических игр; теряет влияние без обратной связи.',
    'when_it_works_best', 'Когда команда явно признает координатора и согласует направление совместно.',
    'when_talent_is_not_revealed', 'Когда курс постоянно меняют кулуарно и обесценивают роль согласования.'
  ),
  jsonb_build_object(
    'hd_meaning', 'Gate 7 is the directional leadership role of the Self.',
    'mechanics', 'Operates in collective logic; amplified through Gate 31 voice in Channel 7-31.',
    'classical_keywords', '["leadership", "direction", "self-role", "collective"]'::jsonb,
    'source_logic', 'Gate interpretation. Final reading depends on center, channel, line, planet activation, side personality/design and whole chart context.',
    'pro_not_self', 'Leads for status instead of serving collective direction.'
  ),
  jsonb_build_object(
    'primary_context', '["center", "channel", "activation", "line"]'::jsonb,
    'secondary_context', '["type", "strategy", "authority", "profile", "definition"]'::jsonb,
    'depends_on', 'Gate meaning must be adjusted by center, channel completion, planet activation, line and whole chart mechanics.',
    'related_element_kinds', '["activation", "channel", "defined_center", "open_center", "type", "strategy", "authority", "profile"]'::jsonb,
    'context_note', 'Standalone gate reference is only a semantic building block. It is not a final personality conclusion.'
  ),
  jsonb_build_object(
    'base', 'Пытается тащить всех в одиночку и злится, что его не слышат.',
    'pro', 'Not-Self leadership: control without invitation or recognition.',
    'warning_signals', '["ручное управление каждой мелочью", "конфликты за полномочия", "потеря общей цели"]'::jsonb,
    'recovery_conditions', '["официальная фиксация роли", "ритуал командной сверки курса", "перераспределение ответственности"]'::jsonb
  ),
  jsonb_build_array(
    jsonb_build_object(
      'contrast_context', 'Gate 7 without Gate 31 expression',
      'how_it_would_read', 'Can appear as internal directional sense without social leadership impact.',
      'why_current_context_is_different', 'Voice and recognition via Gate 31 make leadership visible and actionable.'
    )
  ),
  'draft'
),

-- GATE 8: Contribution
(
  'gate', '8', 'Ворота 8', 'ru', 'v1',
  'Gate 8 — Contribution: продвижение уникального вклада, который задает тон и стиль для других.',
  'Человек умеет показать ценность необычного подхода и вдохновить команду принять свежий формат работы. Он не просто предлагает идею, а делает ее заметной и социально принятой. Особенно полезен там, где нужно упаковать оригинальный вклад в понятный пример.',
  'Gate 8 in the Throat is contribution through individual style and promotion. It voices what is unique and worthy of attention. With Gate 1, it channels creative identity into influence.',
  '["продвижение уникальных решений", "влияние через пример", "коммуникация ценности новизны"]'::jsonb,
  '["самопрезентация без глубины", "конфликт с консервативной средой", "усталость от борьбы за внимание"]'::jsonb,
  '["давать площадку для демонстрации кейсов", "связывать вклад с метриками пользы", "поддерживать авторский стиль без хаоса"]'::jsonb,
  '["среда, открытая новому", "публичные форматы обмена", "культура признания вклада"]'::jsonb,
  '["хуже в ролях, где нужно полностью раствориться в стандарте"]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Делает заметным полезный уникальный вклад и помогает ему прижиться.',
    'work_manifestation', 'Показывает команде рабочие примеры нового подхода и формирует доверие к ним.',
    'strengths', 'Яркая подача; умение вдохновлять; способность связать идею с практикой.',
    'risks', 'Переоценка внешнего эффекта; эмоциональная зависимость от признания; перегиб в демонстративности.',
    'when_it_works_best', 'Когда можно публично показывать результаты и связывать их с реальной пользой.',
    'when_talent_is_not_revealed', 'Когда ценят только анонимное исполнение без права на индивидуальный вклад.'
  ),
  jsonb_build_object(
    'hd_meaning', 'Gate 8 contributes and promotes individual expression through the Throat.',
    'mechanics', 'Individual circuitry broadcasts distinctiveness; Gate 1 provides creative source.',
    'classical_keywords', '["contribution", "style", "promotion", "influence"]'::jsonb,
    'source_logic', 'Gate interpretation. Final reading depends on center, channel, line, planet activation, side personality/design and whole chart context.',
    'pro_not_self', 'Performance for attention replaces authentic contribution.'
  ),
  jsonb_build_object(
    'primary_context', '["center", "channel", "activation", "line"]'::jsonb,
    'secondary_context', '["type", "strategy", "authority", "profile", "definition"]'::jsonb,
    'depends_on', 'Gate meaning must be adjusted by center, channel completion, planet activation, line and whole chart mechanics.',
    'related_element_kinds', '["activation", "channel", "defined_center", "open_center", "type", "strategy", "authority", "profile"]'::jsonb,
    'context_note', 'Standalone gate reference is only a semantic building block. It is not a final personality conclusion.'
  ),
  jsonb_build_object(
    'base', 'Гонится за заметностью, но теряет качество самого вклада.',
    'pro', 'Not-Self display: visibility without true individual transmission.',
    'warning_signals', '["много шума, мало результата", "обиды из-за недооценки", "конфликт со стандартами"]'::jsonb,
    'recovery_conditions', '["возврат к ценности продукта", "короткие демонстрации с фактами", "обратная связь от реальных пользователей"]'::jsonb
  ),
  jsonb_build_array(
    jsonb_build_object(
      'contrast_context', 'Gate 8 active without Gate 1 source',
      'how_it_would_read', 'May show as communication flair more than stable contribution frequency.',
      'why_current_context_is_different', 'With Gate 1, expression gains a consistent creative source to promote.'
    )
  ),
  'draft'
),

-- GATE 9: Focus
(
  'gate', '9', 'Ворота 9', 'ru', 'v1',
  'Gate 9 — Focus: устойчивое внимание к деталям и маленьким шагам, из которых собирается крупный результат.',
  'Человек способен долго держать концентрацию на узкой задаче и доводить ее до измеримого результата. Он эффективен там, где успех строится из последовательных мелких действий. Команда выигрывает, когда этому фокусу не мешают постоянными переключениями.',
  'Gate 9 in Sacral provides concentrated workforce energy. It narrows attention to details and iterative progress. In channel 9-52, focus is stabilized by stillness pressure.',
  '["длительная концентрация", "детальная проработка", "поступательный прогресс"]'::jsonb,
  '["туннельное зрение", "утомление от прерываний", "застревание в мелочах"]'::jsonb,
  '["защищать фокусные интервалы", "ставить дробные цели с проверками", "ограничивать контекстные переключения"]'::jsonb,
  '["тихая рабочая среда", "ясный список приоритетов", "ритм без постоянных срочностей"]'::jsonb,
  '["сложно в хаотичном режиме многозадачности"]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Стабильно продвигает задачу через внимание к деталям и шагам.',
    'work_manifestation', 'Доводит сложные процессы до результата, не теряя качества на промежуточных этапах.',
    'strengths', 'Выдержка; аккуратность; способность работать глубоко и последовательно.',
    'risks', 'Чрезмерное сужение внимания; раздражительность при отвлечениях; перфекционизм.',
    'when_it_works_best', 'Когда есть защищенное время на глубокую работу и понятные этапы.',
    'when_talent_is_not_revealed', 'Когда день дробится бесконечными срочными переключениями.'
  ),
  jsonb_build_object(
    'hd_meaning', 'Gate 9 focuses Sacral energy into detail-oriented progress.',
    'mechanics', 'Pairs with Gate 52 to sustain concentration under pressure restraint.',
    'classical_keywords', '["focus", "detail", "concentration", "small steps"]'::jsonb,
    'source_logic', 'Gate interpretation. Final reading depends on center, channel, line, planet activation, side personality/design and whole chart context.',
    'pro_not_self', 'Frustration from forced fragmentation of attention.'
  ),
  jsonb_build_object(
    'primary_context', '["center", "channel", "activation", "line"]'::jsonb,
    'secondary_context', '["type", "strategy", "authority", "profile", "definition"]'::jsonb,
    'depends_on', 'Gate meaning must be adjusted by center, channel completion, planet activation, line and whole chart mechanics.',
    'related_element_kinds', '["activation", "channel", "defined_center", "open_center", "type", "strategy", "authority", "profile"]'::jsonb,
    'context_note', 'Standalone gate reference is only a semantic building block. It is not a final personality conclusion.'
  ),
  jsonb_build_object(
    'base', 'Распыляется между задачами и теряет качество там, где раньше был силен.',
    'pro', 'Not-Self: broken concentration loop and scattered Sacral output.',
    'warning_signals', '["рост мелких ошибок", "срывы сроков на финальных этапах", "чувство постоянной перегрузки"]'::jsonb,
    'recovery_conditions', '["блоки глубокой работы", "очередь задач вместо параллельности", "короткие паузы для восстановления внимания"]'::jsonb
  ),
  jsonb_build_array(
    jsonb_build_object(
      'contrast_context', 'Gate 9 without Gate 52 anchoring',
      'how_it_would_read', 'Appears as periodic focus bursts rather than sustained concentration.',
      'why_current_context_is_different', 'Gate 52 adds stillness pressure that locks attention over time.'
    )
  ),
  'draft'
),

-- GATE 10: Self-Love
(
  'gate', '10', 'Ворота 10', 'ru', 'v1',
  'Gate 10 — Self-Love: поведение из верности себе, где личная этика важнее внешней роли.',
  'Человек демонстрирует пример честного поведения: делает так, как считает правильным, даже под давлением среды. Его сила в согласованности слов и поступков. В команде это повышает доверие, потому что люди видят предсказуемые ценности, а не удобную маску.',
  'Gate 10 in the G Center is behavior of the self and self-love frequency. It supports authentic conduct and right action from identity. Links with gates 20, 34, and 57 in integration circuitry variants.',
  '["этичная последовательность", "личная аутентичность", "пример поведения для команды"]'::jsonb,
  '["жесткость в принципах", "морализаторский тон", "конфликт с несогласованной культурой"]'::jsonb,
  '["обсуждать ценностные рамки открыто", "давать автономию в способе действий", "использовать человека как ролевую модель"]'::jsonb,
  '["культура доверия", "уважение к личной позиции", "прозрачные правила поведения"]'::jsonb,
  '["неподходяща среда, где поощряют двойные стандарты"]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Действует в согласии с собой и задает стандарт честного поведения.',
    'work_manifestation', 'Укрепляет доверие в команде за счет последовательных решений и ясной личной позиции.',
    'strengths', 'Целостность; внутренний стержень; предсказуемость в ценностях.',
    'risks', 'Непримиримость; критичность к чужому стилю; сложность в компромиссах.',
    'when_it_works_best', 'Когда можно работать из личной ответственности, а не из ролевой игры.',
    'when_talent_is_not_revealed', 'Когда требуется подстраиваться под противоречивые правила ради одобрения.'
  ),
  jsonb_build_object(
    'hd_meaning', 'Gate 10 is authentic behavior and self-love in the G Center.',
    'mechanics', 'Integration stream aligns identity and action; mutative through embodied correctness.',
    'classical_keywords', '["self-love", "behavior", "authenticity", "identity"]'::jsonb,
    'source_logic', 'Gate interpretation. Final reading depends on center, channel, line, planet activation, side personality/design and whole chart context.',
    'pro_not_self', 'Self-rejection leads to performative behavior and identity dissonance.'
  ),
  jsonb_build_object(
    'primary_context', '["center", "channel", "activation", "line"]'::jsonb,
    'secondary_context', '["type", "strategy", "authority", "profile", "definition"]'::jsonb,
    'depends_on', 'Gate meaning must be adjusted by center, channel completion, planet activation, line and whole chart mechanics.',
    'related_element_kinds', '["activation", "channel", "defined_center", "open_center", "type", "strategy", "authority", "profile"]'::jsonb,
    'context_note', 'Standalone gate reference is only a semantic building block. It is not a final personality conclusion.'
  ),
  jsonb_build_object(
    'base', 'Предает собственные принципы ради быстрого одобрения.',
    'pro', 'Not-Self behavior: acting from fear of rejection instead of self-love.',
    'warning_signals', '["внутренний стыд после решений", "резкие смены позиции", "потеря доверия коллег"]'::jsonb,
    'recovery_conditions', '["возврат к личным критериям", "публичная фиксация рабочих принципов", "решения через ценностный фильтр"]'::jsonb
  ),
  jsonb_build_array(
    jsonb_build_object(
      'contrast_context', 'Gate 10 in undefined G context',
      'how_it_would_read', 'Can read as adaptive behavior sensitivity instead of fixed authentic conduct.',
      'why_current_context_is_different', 'Definition stabilizes identity axis and behavior consistency over time.'
    )
  ),
  'draft'
),

-- GATE 11: Ideas
(
  'gate', '11', 'Ворота 11', 'ru', 'v1',
  'Gate 11 — Ideas: поток концепций, образов и смысловых вариантов для будущих обсуждений.',
  'Человек генерирует много идей и видит неожиданные направления для обсуждения. Это не всегда готовый план, но часто ценный материал для командного мышления. Наилучший эффект возникает, когда идеи сначала собирают и фильтруют, а не требуют немедленной реализации.',
  'Gate 11 in Ajna carries conceptual imagery and idea traffic. It feeds collective meaning possibilities rather than immediate certainty. With Gate 56, ideas are narrated into stories and learning.',
  '["генерация концепций", "видение альтернатив", "смысловая креативность"]'::jsonb,
  '["избыток незавершенных идей", "усталость команды от потока предложений", "смешение фантазии и плана"]'::jsonb,
  '["вести банк идей с приоритизацией", "разделять этап вдохновения и этап исполнения", "назначать критерии отбора"]'::jsonb,
  '["мозговые штурмы", "визуальные форматы обсуждения", "открытость к гипотезам"]'::jsonb,
  '["слабее в режимах, где нужна только линейная инструкция без вариантов"]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Поставляет команде широкий спектр идей и смысловых направлений.',
    'work_manifestation', 'Обогащает стратегические и продуктовые обсуждения нестандартными концепциями.',
    'strengths', 'Воображение; широта мышления; способность открывать новые ходы.',
    'risks', 'Перегруз вариантами; потеря фокуса; недооценка ограничений реализации.',
    'when_it_works_best', 'Когда идеи проходят фильтр приоритетов и превращаются в тестируемые гипотезы.',
    'when_talent_is_not_revealed', 'Когда от человека требуют только готовых ответов без права предлагать варианты.'
  ),
  jsonb_build_object(
    'hd_meaning', 'Gate 11 transmits conceptual ideas in collective abstract processing.',
    'mechanics', 'Ajna abstraction generates possibility fields; Gate 56 can verbalize them.',
    'classical_keywords', '["ideas", "concepts", "imagery", "possibilities"]'::jsonb,
    'source_logic', 'Gate interpretation. Final reading depends on center, channel, line, planet activation, side personality/design and whole chart context.',
    'pro_not_self', 'Mental pressure to prove every idea as immediate truth.'
  ),
  jsonb_build_object(
    'primary_context', '["center", "channel", "activation", "line"]'::jsonb,
    'secondary_context', '["type", "strategy", "authority", "profile", "definition"]'::jsonb,
    'depends_on', 'Gate meaning must be adjusted by center, channel completion, planet activation, line and whole chart mechanics.',
    'related_element_kinds', '["activation", "channel", "defined_center", "open_center", "type", "strategy", "authority", "profile"]'::jsonb,
    'context_note', 'Standalone gate reference is only a semantic building block. It is not a final personality conclusion.'
  ),
  jsonb_build_object(
    'base', 'Путает вдохновение с обязательством все реализовать одновременно.',
    'pro', 'Not-Self ideation: compulsive concept output without discernment.',
    'warning_signals', '["хаотичный список инициатив", "потеря критериев выбора", "фрустрация от нереализованного"]'::jsonb,
    'recovery_conditions', '["приоритизация идей по ценности", "ограничение числа активных экспериментов", "регулярные ревью гипотез"]'::jsonb
  ),
  jsonb_build_array(
    jsonb_build_object(
      'contrast_context', 'Gate 11 without Gate 56 narration',
      'how_it_would_read', 'May remain private ideation not translated into collective storytelling.',
      'why_current_context_is_different', 'Gate 56 gives verbal movement and social transmission to ideas.'
    )
  ),
  'draft'
),

-- GATE 12: Caution
(
  'gate', '12', 'Ворота 12', 'ru', 'v1',
  'Gate 12 — Caution: избирательное выражение, где важны настроение, уместность и точный момент речи.',
  'Человек умеет говорить так, чтобы сложная мысль прозвучала красиво и точно, но не любит говорить в неподходящую атмосферу. В его стиле есть пауза перед словом, и эта пауза часто защищает от лишних ошибок. В публичных коммуникациях полезен как голос тонкой настройки и вкуса.',
  'Gate 12 in Throat is cautious expression in the individual stream. Voice quality is mood-dependent and can be powerfully refined. With Gate 22, social grace and emotional tone shape transmission.',
  '["точная формулировка в нужный момент", "эстетика речи", "социальная чувствительность к контексту"]'::jsonb,
  '["замыкание при давлении", "резкость в неблагоприятном настроении", "пропуск важных моментов"]'::jsonb,
  '["согласовывать формат и время выступлений", "не давить на немедленный ответ", "использовать подготовленные тезисы"]'::jsonb,
  '["культура уважительного слушания", "возможность подготовки", "бережный ритм коммуникаций"]'::jsonb,
  '["сложно в агрессивных обсуждениях без правил"]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Говорит лучше всего, когда выбран подходящий момент и тон.',
    'work_manifestation', 'Повышает качество коммуникации: убирает лишнее и оставляет точный смысл.',
    'strengths', 'Чуткость к уместности; выразительность; точность подачи.',
    'risks', 'Чрезмерные паузы; уход в молчание; эмоциональная резкость при перегрузе.',
    'when_it_works_best', 'Когда есть время на настройку и уважение к темпу человека.',
    'when_talent_is_not_revealed', 'Когда требуют говорить быстро и много в токсичном фоне.'
  ),
  jsonb_build_object(
    'hd_meaning', 'Gate 12 is cautious individual expression through the Throat.',
    'mechanics', 'Mood-gated voice in individual circuitry; resonance depends on emotional timing.',
    'classical_keywords', '["caution", "expression", "timing", "refinement"]'::jsonb,
    'source_logic', 'Gate interpretation. Final reading depends on center, channel, line, planet activation, side personality/design and whole chart context.',
    'pro_not_self', 'Speech distortion when forcing expression against inner timing.'
  ),
  jsonb_build_object(
    'primary_context', '["center", "channel", "activation", "line"]'::jsonb,
    'secondary_context', '["type", "strategy", "authority", "profile", "definition"]'::jsonb,
    'depends_on', 'Gate meaning must be adjusted by center, channel completion, planet activation, line and whole chart mechanics.',
    'related_element_kinds', '["activation", "channel", "defined_center", "open_center", "type", "strategy", "authority", "profile"]'::jsonb,
    'context_note', 'Standalone gate reference is only a semantic building block. It is not a final personality conclusion.'
  ),
  jsonb_build_object(
    'base', 'Либо молчит из страха оценки, либо говорит слишком остро.',
    'pro', 'Not-Self caution: inhibition and reactive speech swings.',
    'warning_signals', '["долгое откладывание важных сообщений", "неудачные резкие реплики", "усталость от публичных форматов"]'::jsonb,
    'recovery_conditions', '["подготовка ключевых фраз", "право на паузу перед ответом", "согласование безопасного формата коммуникации"]'::jsonb
  ),
  jsonb_build_array(
    jsonb_build_object(
      'contrast_context', 'Gate 12 without Gate 22 emotional grace',
      'how_it_would_read', 'May read as selective caution without full emotional social impact.',
      'why_current_context_is_different', 'Gate 22 adds relational magnetism and mood coloration to expression.'
    )
  ),
  'draft'
),

-- GATE 13: Listener
(
  'gate', '13', 'Ворота 13', 'ru', 'v1',
  'Gate 13 — Listener: хранение историй и умение слышать опыт людей без поспешных выводов.',
  'Человек умеет внимательно слушать и собирать важные детали чужого опыта. Ему доверяют личные истории, потому что он не перебивает и не обесценивает переживания. В команде это ценный носитель контекста: помогает понимать, что уже происходило и почему это важно сейчас.',
  'Gate 13 in G Center is the listener and keeper of collective memory. It receives stories of the past and social experience. With Gate 33, memory can be articulated into reflective narrative.',
  '["глубокое слушание", "сохранение контекста", "эмпатичное сопровождение разговоров"]'::jsonb,
  '["перегруз чужими историями", "скрытая усталость от эмоционального веса", "задержка собственных решений"]'::jsonb,
  '["ограничивать количество тяжелых разговоров подряд", "использовать роль фасилитатора ретроспектив", "переводить услышанное в структурированные выводы"]'::jsonb,
  '["доверительная атмосфера", "конфиденциальность", "культура рефлексии"]'::jsonb,
  '["сложно в среде, где личный опыт высмеивается"]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Слышит людей глубоко и помогает команде помнить важный опыт.',
    'work_manifestation', 'Собирает истории, превращает их в полезный контекст для будущих решений.',
    'strengths', 'Эмпатия; внимание к деталям; надежность как собеседника.',
    'risks', 'Эмоциональное истощение; накопление чужого напряжения; отсрочка собственных шагов.',
    'when_it_works_best', 'Когда есть рамки конфиденциальности и регулярная переработка услышанного в выводы.',
    'when_talent_is_not_revealed', 'Когда нет доверия и разговоры сводятся к поверхностному обмену.'
  ),
  jsonb_build_object(
    'hd_meaning', 'Gate 13 listens and stores collective past narratives.',
    'mechanics', 'Abstract experiential stream receives memory; Gate 33 can frame retrospective meaning.',
    'classical_keywords', '["listener", "stories", "memory", "empathy"]'::jsonb,
    'source_logic', 'Gate interpretation. Final reading depends on center, channel, line, planet activation, side personality/design and whole chart context.',
    'pro_not_self', 'Identity confusion from carrying others'' stories without boundaries.'
  ),
  jsonb_build_object(
    'primary_context', '["center", "channel", "activation", "line"]'::jsonb,
    'secondary_context', '["type", "strategy", "authority", "profile", "definition"]'::jsonb,
    'depends_on', 'Gate meaning must be adjusted by center, channel completion, planet activation, line and whole chart mechanics.',
    'related_element_kinds', '["activation", "channel", "defined_center", "open_center", "type", "strategy", "authority", "profile"]'::jsonb,
    'context_note', 'Standalone gate reference is only a semantic building block. It is not a final personality conclusion.'
  ),
  jsonb_build_object(
    'base', 'Берет на себя чужую историю как личную ответственность.',
    'pro', 'Not-Self listener: absorbing collective burden without processing.',
    'warning_signals', '["хроническая усталость после разговоров", "растворение личных границ", "трудность отпускать услышанное"]'::jsonb,
    'recovery_conditions', '["ритуалы эмоциональной разгрузки", "четкие рамки роли слушателя", "выделенное время на рефлексию"]'::jsonb
  ),
  jsonb_build_array(
    jsonb_build_object(
      'contrast_context', 'Gate 13 without Gate 33 articulation',
      'how_it_would_read', 'May stay as receptive listening without clear retrospective output.',
      'why_current_context_is_different', 'Gate 33 enables selective expression and timing of the stored stories.'
    )
  ),
  'draft'
),

-- GATE 14: Power Skills
(
  'gate', '14', 'Ворота 14', 'ru', 'v1',
  'Gate 14 — Power Skills: энергия ресурсов и навыков, которая двигает реализацию значимых направлений.',
  'Человек умеет соединять навыки, усилия и ресурсы так, чтобы дело реально двигалось вперед. Он не только работает, но и создает ощущение «двигателя» в проекте. Особенно силен там, где нужна практическая отдача, а не только обсуждение стратегии.',
  'Gate 14 in Sacral is power skills and resource-driving force. It fuels direction when linked with Gate 2 in channel 2-14. Material and energetic support become purposeful output.',
  '["практическая продуктивность", "умение усиливать ресурс", "перевод потенциала в результат"]'::jsonb,
  '["переработка ради эффективности", "вложение сил в чужие цели", "перекос в пользу выгоды без смысла"]'::jsonb,
  '["связывать задачи с личной мотивацией", "давать автономию в способе реализации", "контролировать загрузку и восстановление"]'::jsonb,
  '["ясная ценность результата", "доступ к инструментам", "культура уважения к труду"]'::jsonb,
  '["снижается эффективность в проектах без понятной пользы"]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Сильнее всего проявляется в делах, где нужно запитать результат ресурсом и трудом.',
    'work_manifestation', 'Запускает устойчивую отдачу: превращает усилия команды в ощутимый прогресс.',
    'strengths', 'Работоспособность; практичность; умение усиливать ценность ресурсов.',
    'risks', 'Выгорание; работа «впустую»; подмена смысла голой производительностью.',
    'when_it_works_best', 'Когда цель ясна, вклад видим, а нагрузка распределена реалистично.',
    'when_talent_is_not_revealed', 'Когда энергия уходит на задачи без смысла и обратной связи по результату.'
  ),
  jsonb_build_object(
    'hd_meaning', 'Gate 14 channels Sacral power into materialized skills and resources.',
    'mechanics', 'In channel 2-14, energetic fuel aligns with directional intelligence.',
    'classical_keywords', '["power", "skills", "resources", "prosperity"]'::jsonb,
    'source_logic', 'Gate interpretation. Final reading depends on center, channel, line, planet activation, side personality/design and whole chart context.',
    'pro_not_self', 'Prosperity fixation without correct direction drains Sacral force.'
  ),
  jsonb_build_object(
    'primary_context', '["center", "channel", "activation", "line"]'::jsonb,
    'secondary_context', '["type", "strategy", "authority", "profile", "definition"]'::jsonb,
    'depends_on', 'Gate meaning must be adjusted by center, channel completion, planet activation, line and whole chart mechanics.',
    'related_element_kinds', '["activation", "channel", "defined_center", "open_center", "type", "strategy", "authority", "profile"]'::jsonb,
    'context_note', 'Standalone gate reference is only a semantic building block. It is not a final personality conclusion.'
  ),
  jsonb_build_object(
    'base', 'Много работает, но не чувствует, что это ведет к важному результату.',
    'pro', 'Not-Self power: labor intensity detached from inner direction.',
    'warning_signals', '["хронические переработки", "раздражение на «бессмысленные» задачи", "падение качества при усталости"]'::jsonb,
    'recovery_conditions', '["пересборка приоритетов по ценности", "ограничение сверхнагрузки", "возврат автономии в способе работы"]'::jsonb
  ),
  jsonb_build_array(
    jsonb_build_object(
      'contrast_context', 'Gate 14 without Gate 2 direction',
      'how_it_would_read', 'Can look like raw productivity without coherent trajectory.',
      'why_current_context_is_different', 'Gate 2 provides vector; Gate 14 supplies fuel for that vector.'
    )
  ),
  'draft'
),

-- GATE 15: Extremes
(
  'gate', '15', 'Ворота 15', 'ru', 'v1',
  'Gate 15 — Extremes: широкий диапазон ритмов и отношение к человеческому многообразию.',
  'Человек принимает разные темпы и стили жизни, не пытаясь подогнать всех под один стандарт. Он может работать то очень интенсивно, то размеренно, сохраняя человечность в отношении к другим. В команде часто становится носителем инклюзивной культуры и гибких правил.',
  'Gate 15 in G Center expresses love of humanity and rhythm extremes. It carries tolerance for diversity and natural variance. With Gate 5, it forms the rhythm channel balancing fixed and extreme flow.',
  '["инклюзивное мышление", "гибкость к разным ритмам", "человекоцентричный подход"]'::jsonb,
  '["непредсказуемый темп", "сложность с жесткими регламентами", "колебания производительности"]'::jsonb,
  '["согласовывать окна высокой и низкой интенсивности", "ставить результат вместо микроконтроля графика", "использовать в задачах культурной интеграции"]'::jsonb,
  '["разнообразная команда", "гибкие форматы работы", "уважение к индивидуальному ритму"]'::jsonb,
  '["сложно в среде тотального единообразия"]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Принимает разнообразие людей и естественную смену рабочих ритмов.',
    'work_manifestation', 'Помогает команде удерживать эффективность без давления на одинаковость.',
    'strengths', 'Толерантность; широкий диапазон адаптации; гуманная координация.',
    'risks', 'Колебания темпа; трудность в жесткой рутине; недооценка дедлайнов.',
    'when_it_works_best', 'Когда допускаются разные способы работы при четких критериях результата.',
    'when_talent_is_not_revealed', 'Когда всех принуждают к единому стилю и темпу без гибкости.'
  ),
  jsonb_build_object(
    'hd_meaning', 'Gate 15 holds extremes and love of humanity in identity field.',
    'mechanics', 'Interacts with Gate 5 to modulate rhythm polarity in collective flow.',
    'classical_keywords', '["extremes", "humanity", "rhythm range", "tolerance"]'::jsonb,
    'source_logic', 'Gate interpretation. Final reading depends on center, channel, line, planet activation, side personality/design and whole chart context.',
    'pro_not_self', 'Chaotic rhythm swings without grounded identity center.'
  ),
  jsonb_build_object(
    'primary_context', '["center", "channel", "activation", "line"]'::jsonb,
    'secondary_context', '["type", "strategy", "authority", "profile", "definition"]'::jsonb,
    'depends_on', 'Gate meaning must be adjusted by center, channel completion, planet activation, line and whole chart mechanics.',
    'related_element_kinds', '["activation", "channel", "defined_center", "open_center", "type", "strategy", "authority", "profile"]'::jsonb,
    'context_note', 'Standalone gate reference is only a semantic building block. It is not a final personality conclusion.'
  ),
  jsonb_build_object(
    'base', 'Кидается между крайностями графика и теряет устойчивость.',
    'pro', 'Not-Self extremes: performative variability without true alignment.',
    'warning_signals', '["скачки доступности", "нестабильная предсказуемость", "трение с операционными ролями"]'::jsonb,
    'recovery_conditions', '["рамки минимального ритма", "планирование по циклам энергии", "прозрачная коммуникация о доступности"]'::jsonb
  ),
  jsonb_build_array(
    jsonb_build_object(
      'contrast_context', 'Gate 15 without Gate 5 balancing',
      'how_it_would_read', 'May appear as broad tolerance but inconsistent timing.',
      'why_current_context_is_different', 'Gate 5 supplies patterning that stabilizes extreme rhythm range.'
    )
  ),
  'draft'
),

-- GATE 16: Skills
(
  'gate', '16', 'Ворота 16', 'ru', 'v1',
  'Gate 16 — Skills: энтузиазм и мастерство, растущее через практику и повторение.',
  'Человек быстро загорается темой и готов много тренироваться, чтобы довести навык до высокого уровня. Он умеет вдохновлять других на освоение сложных инструментов через живую демонстрацию. Результат приходит не от импровизации, а от регулярной отработки.',
  'Gate 16 in Throat is enthusiasm for skills and talent refinement. It seeks repeated practice to become expressive competence. With Gate 48, depth supports true mastery.',
  '["быстрое освоение навыков", "энергия обучения", "демонстрация практического мастерства"]'::jsonb,
  '["перегрев на старте", "поверхностность без глубины", "распыление на много дисциплин"]'::jsonb,
  '["ставить тренировочные циклы", "измерять прогресс по этапам", "связывать энтузиазм с глубокой проработкой"]'::jsonb,
  '["культура обучения", "доступ к наставничеству", "пространство для практики"]'::jsonb,
  '["слабее в среде, где нет времени на тренировку"]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Развивает сильные навыки через регулярную практику и вовлеченность.',
    'work_manifestation', 'Поднимает профессиональный уровень команды, превращая интерес в отточенное умение.',
    'strengths', 'Обучаемость; мотивация; выразительная подача компетенции.',
    'risks', 'Быстрый старт без системности; бросание темы до закрепления; переоценка таланта без тренировки.',
    'when_it_works_best', 'Когда есть цикл практика-обратная связь-коррекция.',
    'when_talent_is_not_revealed', 'Когда от человека ждут мгновенного мастерства без периода обучения.'
  ),
  jsonb_build_object(
    'hd_meaning', 'Gate 16 expresses enthusiasm and repetitive skill refinement.',
    'mechanics', 'Collective logic stream; Gate 48 depth transforms talent into mastery.',
    'classical_keywords', '["skills", "enthusiasm", "practice", "mastery"]'::jsonb,
    'source_logic', 'Gate interpretation. Final reading depends on center, channel, line, planet activation, side personality/design and whole chart context.',
    'pro_not_self', 'Showmanship without depth replaces real competence.'
  ),
  jsonb_build_object(
    'primary_context', '["center", "channel", "activation", "line"]'::jsonb,
    'secondary_context', '["type", "strategy", "authority", "profile", "definition"]'::jsonb,
    'depends_on', 'Gate meaning must be adjusted by center, channel completion, planet activation, line and whole chart mechanics.',
    'related_element_kinds', '["activation", "channel", "defined_center", "open_center", "type", "strategy", "authority", "profile"]'::jsonb,
    'context_note', 'Standalone gate reference is only a semantic building block. It is not a final personality conclusion.'
  ),
  jsonb_build_object(
    'base', 'Начинает ярко, но прекращает до появления устойчивого результата.',
    'pro', 'Not-Self skill: enthusiasm spikes without consistent practice architecture.',
    'warning_signals', '["много начатых курсов", "отсутствие закрепленного уровня", "демонстрация без результата"]'::jsonb,
    'recovery_conditions', '["план тренировок по неделям", "фокус на одной ключевой компетенции", "регулярная внешняя обратная связь"]'::jsonb
  ),
  jsonb_build_array(
    jsonb_build_object(
      'contrast_context', 'Gate 16 without Gate 48 depth',
      'how_it_would_read', 'May seem like enthusiasm and performance more than mastery.',
      'why_current_context_is_different', 'Gate 48 adds depth reservoir required for high-level competence.'
    )
  ),
  'draft'
),

-- GATE 17: Opinions
(
  'gate', '17', 'Ворота 17', 'ru', 'v1',
  'Gate 17 — Opinions: логические мнения и структурирование картины мира через паттерны.',
  'Человек умеет быстро выстраивать логическую позицию и объяснять, почему именно так. Он полезен в аналитике, приоритизации и формировании понятных критериев оценки. Максимальная польза появляется, когда мнение проверяется фактами, а не превращается в догму.',
  'Gate 17 in Ajna forms logical opinions and pattern projections. It organizes perception into coherent frameworks. With Gate 62, opinions become precise details and language.',
  '["логическое структурирование", "формирование критериев", "ясное обоснование позиции"]'::jsonb,
  '["жесткость мнения", "спор ради правоты", "преждевременные выводы"]'::jsonb,
  '["требовать доказательную базу", "вводить формат «гипотеза, а не приговор»", "разводить анализ и решение по этапам"]'::jsonb,
  '["данные и прозрачные метрики", "культура аргументов", "право пересматривать выводы"]'::jsonb,
  '["слабее там, где решения принимают только по интуитивному импульсу"]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Строит логичные мнения и помогает команде мыслить структурно.',
    'work_manifestation', 'Упорядочивает обсуждения, задает критерии и снижает хаос в оценке вариантов.',
    'strengths', 'Ясность логики; системность; аргументированная коммуникация.',
    'risks', 'Категоричность; спорность; закрытость к новым данным.',
    'when_it_works_best', 'Когда есть данные, дискуссия и возможность корректировать выводы.',
    'when_talent_is_not_revealed', 'Когда мнение нужно только подтверждать, а не проверять.'
  ),
  jsonb_build_object(
    'hd_meaning', 'Gate 17 projects logical opinions from Ajna patterning.',
    'mechanics', 'Collective logic seeks validation; Gate 62 supplies factual articulation.',
    'classical_keywords', '["opinions", "logic", "patterns", "organization"]'::jsonb,
    'source_logic', 'Gate interpretation. Final reading depends on center, channel, line, planet activation, side personality/design and whole chart context.',
    'pro_not_self', 'Opinion attachment creates rigid mental certainty.'
  ),
  jsonb_build_object(
    'primary_context', '["center", "channel", "activation", "line"]'::jsonb,
    'secondary_context', '["type", "strategy", "authority", "profile", "definition"]'::jsonb,
    'depends_on', 'Gate meaning must be adjusted by center, channel completion, planet activation, line and whole chart mechanics.',
    'related_element_kinds', '["activation", "channel", "defined_center", "open_center", "type", "strategy", "authority", "profile"]'::jsonb,
    'context_note', 'Standalone gate reference is only a semantic building block. It is not a final personality conclusion.'
  ),
  jsonb_build_object(
    'base', 'Защищает позицию даже после появления новых фактов.',
    'pro', 'Not-Self opinions: certainty without iterative validation.',
    'warning_signals', '["поляризующие споры", "игнор контрпримеров", "рост ментального напряжения в команде"]'::jsonb,
    'recovery_conditions', '["обязательная проверка гипотез", "встречи по пересмотру решений", "включение альтернативных аргументов"]'::jsonb
  ),
  jsonb_build_array(
    jsonb_build_object(
      'contrast_context', 'Gate 17 without Gate 62 detail voice',
      'how_it_would_read', 'May stay as broad pattern opinion without precise articulation.',
      'why_current_context_is_different', 'Gate 62 grounds opinions into concrete, testable details.'
    )
  ),
  'draft'
),

-- GATE 18: Correction
(
  'gate', '18', 'Ворота 18', 'ru', 'v1',
  'Gate 18 — Correction: видение ошибок и стремление улучшить качество через корректировку.',
  'Человек замечает, что работает плохо, и интуитивно понимает, как сделать лучше. Он полезен в аудите, QA и оптимизации процессов, где важны стандарты качества. Его критика становится ценностью, если направлена на улучшение, а не на обесценивание людей.',
  'Gate 18 in Spleen is corrective judgment and quality refinement. It detects distortions and seeks improvement patterns. With Gate 58, it powers vitality for continuous correction.',
  '["обнаружение дефектов", "улучшение качества", "системная корректировка процессов"]'::jsonb,
  '["критиканство", "перфекционистская жесткость", "перефокус на недостатках"]'::jsonb,
  '["задавать критерии конструктивной обратной связи", "фиксировать улучшения в процессе", "балансировать замечания признанием сильных сторон"]'::jsonb,
  '["культура качества", "прозрачные стандарты", "безопасность для обсуждения ошибок"]'::jsonb,
  '["сложно в среде, где критику воспринимают как личную атаку"]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Видит, что можно улучшить, и помогает поднять уровень качества.',
    'work_manifestation', 'Находит системные ошибки и предлагает практичные исправления без потери темпа.',
    'strengths', 'Наблюдательность; стандарт качества; ориентация на улучшение.',
    'risks', 'Избыточная придирчивость; демотивация окружающих; застревание в несовершенствах.',
    'when_it_works_best', 'Когда обратная связь структурирована и направлена на решение.',
    'when_talent_is_not_revealed', 'Когда замечания запрещают или высмеивают как «негатив».'
  ),
  jsonb_build_object(
    'hd_meaning', 'Gate 18 brings Spleenic correction and judgment for refinement.',
    'mechanics', 'Instinctive pattern detection; Gate 58 provides joy-pressure to improve.',
    'classical_keywords', '["correction", "quality", "judgment", "improvement"]'::jsonb,
    'source_logic', 'Gate interpretation. Final reading depends on center, channel, line, planet activation, side personality/design and whole chart context.',
    'pro_not_self', 'Projection of fault-finding without calibrated discernment.'
  ),
  jsonb_build_object(
    'primary_context', '["center", "channel", "activation", "line"]'::jsonb,
    'secondary_context', '["type", "strategy", "authority", "profile", "definition"]'::jsonb,
    'depends_on', 'Gate meaning must be adjusted by center, channel completion, planet activation, line and whole chart mechanics.',
    'related_element_kinds', '["activation", "channel", "defined_center", "open_center", "type", "strategy", "authority", "profile"]'::jsonb,
    'context_note', 'Standalone gate reference is only a semantic building block. It is not a final personality conclusion.'
  ),
  jsonb_build_object(
    'base', 'Критикует людей вместо того, чтобы улучшать систему.',
    'pro', 'Not-Self correction: compulsive fixing detached from timing and receptivity.',
    'warning_signals', '["рост защитных реакций в команде", "снижение инициативы из-за страха ошибок", "повторяющиеся конфликты по качеству"]'::jsonb,
    'recovery_conditions', '["формат «проблема-предложение-эффект»", "совместный план улучшений", "приоритет критичных дефектов"]'::jsonb
  ),
  jsonb_build_array(
    jsonb_build_object(
      'contrast_context', 'Gate 18 without Gate 58 pressure',
      'how_it_would_read', 'May read as selective criticism without sustained improvement drive.',
      'why_current_context_is_different', 'Gate 58 supplies vitality to continuously refine patterns.'
    )
  ),
  'draft'
),

-- GATE 19: Wanting
(
  'gate', '19', 'Ворота 19', 'ru', 'v1',
  'Gate 19 — Wanting: чувствительность к потребностям и поиск правильной формы сближения и поддержки.',
  'Человек тонко улавливает потребности людей и команды, включая те, о которых обычно не говорят вслух. Он хорошо выстраивает подход к взаимодействию: когда подойти, как попросить, как предложить помощь. Это важный талант для клиентских ролей, сервиса и партнерских отношений.',
  'Gate 19 in Root senses needs, resources, and approach thresholds. It is pressure toward bonding and support structures. With Gate 49, need sensitivity meets principled tribal contracts.',
  '["чуткость к потребностям", "бережный подход к контактам", "сервисная ориентация"]'::jsonb,
  '["зависимость от одобрения", "обидчивость при отказе", "размытые личные границы"]'::jsonb,
  '["фиксировать взаимные ожидания", "учить навыкам просьбы и отказа", "переводить потребности в конкретные договоренности"]'::jsonb,
  '["поддерживающая культура", "прозрачные договоры помощи", "уважительное общение"]'::jsonb,
  '["тяжело в среде эмоционально грубых взаимодействий"]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Быстро замечает потребности и помогает наладить экологичное взаимодействие.',
    'work_manifestation', 'Улучшает качество сервиса и партнерства через точную настройку ожиданий и помощи.',
    'strengths', 'Эмпатическая чувствительность; тактичность; внимание к взаимности.',
    'risks', 'Гиперзависимость от принятия; перегруз заботой; обида при несогласии.',
    'when_it_works_best', 'Когда потребности обсуждают явно и поддержка оформлена договоренностями.',
    'when_talent_is_not_revealed', 'Когда просьбы и границы считаются слабостью и игнорируются.'
  ),
  jsonb_build_object(
    'hd_meaning', 'Gate 19 is Root pressure toward need-attunement and tribal approach.',
    'mechanics', 'Senses resource and proximity thresholds; links to Gate 49 principles.',
    'classical_keywords', '["wanting", "needs", "approach", "sensitivity"]'::jsonb,
    'source_logic', 'Gate interpretation. Final reading depends on center, channel, line, planet activation, side personality/design and whole chart context.',
    'pro_not_self', 'Neediness and fear of rejection distort relational calibration.'
  ),
  jsonb_build_object(
    'primary_context', '["center", "channel", "activation", "line"]'::jsonb,
    'secondary_context', '["type", "strategy", "authority", "profile", "definition"]'::jsonb,
    'depends_on', 'Gate meaning must be adjusted by center, channel completion, planet activation, line and whole chart mechanics.',
    'related_element_kinds', '["activation", "channel", "defined_center", "open_center", "type", "strategy", "authority", "profile"]'::jsonb,
    'context_note', 'Standalone gate reference is only a semantic building block. It is not a final personality conclusion.'
  ),
  jsonb_build_object(
    'base', 'Старается заслужить принятие, игнорируя собственные границы.',
    'pro', 'Not-Self wanting: attachment to support without reciprocal clarity.',
    'warning_signals', '["тревога перед отказом", "слишком частые уступки", "истощение от роли «всегда помогающего»"]'::jsonb,
    'recovery_conditions', '["явные правила взаимности", "тренировка здорового отказа", "проверка собственных ресурсов перед согласием"]'::jsonb
  ),
  jsonb_build_array(
    jsonb_build_object(
      'contrast_context', 'Gate 19 without Gate 49 principle filter',
      'how_it_would_read', 'May appear as raw sensitivity to needs without contract boundaries.',
      'why_current_context_is_different', 'Gate 49 introduces principled criteria for inclusion and exchange.'
    )
  ),
  'draft'
),

-- GATE 20: Contemplation
(
  'gate', '20', 'Ворота 20', 'ru', 'v1',
  'Gate 20 — Contemplation: присутствие в текущем моменте и действие «здесь и сейчас».',
  'Человек быстро считывает ситуацию в настоящем и способен точно отреагировать без лишней задержки. Его сила в живом контакте с реальностью, а не в длинных прогнозах. Особенно ценен там, где важно оперативно озвучить суть и принять практичное решение на месте.',
  'Gate 20 in Throat is the now-voice: contemplation and immediate expression. It can manifest through multiple integration channels (10-20, 34-20, 57-20). Correctness depends on present awareness, not mental projection.',
  '["оперативная ясность", "точный ответ в моменте", "практичность в неопределенности"]'::jsonb,
  '["импульсивные высказывания", "недостаток долгого планирования", "обрыв контекста ради скорости"]'::jsonb,
  '["назначать роли для быстрого реагирования", "добавлять короткий пост-анализ после решений", "балансировать скорость и проверку рисков"]'::jsonb,
  '["динамичные процессы", "короткие циклы обратной связи", "доверие к оперативным решениям"]'::jsonb,
  '["слабо подходит для чрезмерно бюрократичных согласований"]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Действует и говорит из актуального момента, когда нужна быстрая ясность.',
    'work_manifestation', 'Помогает команде не зависать: фиксирует суть и переводит ее в действие.',
    'strengths', 'Скорость ориентации; собранность; прикладная точность в моменте.',
    'risks', 'Поспешность; недоучет дальних последствий; резкость в формулировке.',
    'when_it_works_best', 'Когда решения принимают короткими итерациями с последующей коррекцией.',
    'when_talent_is_not_revealed', 'Когда любое действие тормозится длинными формальными цепочками.'
  ),
  jsonb_build_object(
    'hd_meaning', 'Gate 20 voices consciousness in the present tense.',
    'mechanics', 'Integration stream pathways make now-awareness immediately actionable.',
    'classical_keywords', '["now", "presence", "voice", "immediacy"]'::jsonb,
    'source_logic', 'Gate interpretation. Final reading depends on center, channel, line, planet activation, side personality/design and whole chart context.',
    'pro_not_self', 'Speaking from pressure, not presence, creates misaligned action.'
  ),
  jsonb_build_object(
    'primary_context', '["center", "channel", "activation", "line"]'::jsonb,
    'secondary_context', '["type", "strategy", "authority", "profile", "definition"]'::jsonb,
    'depends_on', 'Gate meaning must be adjusted by center, channel completion, planet activation, line and whole chart mechanics.',
    'related_element_kinds', '["activation", "channel", "defined_center", "open_center", "type", "strategy", "authority", "profile"]'::jsonb,
    'context_note', 'Standalone gate reference is only a semantic building block. It is not a final personality conclusion.'
  ),
  jsonb_build_object(
    'base', 'Реагирует слишком быстро и позже исправляет последствия.',
    'pro', 'Not-Self now-voice: reactivity mistaken for awareness.',
    'warning_signals', '["частые откаты решений", "резкие реплики в стрессе", "пропуск важных вводных"]'::jsonb,
    'recovery_conditions', '["микропаузa перед ответом", "чеклист минимальных условий решения", "короткий разбор после действия"]'::jsonb
  ),
  jsonb_build_array(
    jsonb_build_object(
      'contrast_context', 'Gate 20 without integration support',
      'how_it_would_read', 'May read as momentary expressiveness, not stable present-time authority.',
      'why_current_context_is_different', 'Channel support determines whether now-awareness sustains reliable action.'
    )
  ),
  'draft'
),

-- GATE 21: Hunter
(
  'gate', '21', 'Ворота 21', 'ru', 'v1',
  'Gate 21 — Hunter: управление ресурсами, контроль процессов и способность «пробиваться» к результату.',
  'Человек стремится держать под контролем ресурсы, сроки и ответственность за выполнение. Он силен в ролях, где нужен хозяин процесса: закупки, операционное управление, бюджет. Важно, чтобы контроль служил общему делу, а не превращался в жесткое доминирование.',
  'Gate 21 in Heart/Ego is the controlling gate of material management. It bites through obstacles to secure resources and execution. In channel 21-45, authority and distribution are tribal themes.',
  '["ресурсное управление", "операционная дисциплина", "волевое доведение задач"]'::jsonb,
  '["гиперконтроль", "конфликты из-за полномочий", "жесткость в делегировании"]'::jsonb,
  '["четко определять зоны ответственности", "ставить прозрачные KPI по ресурсам", "разделять контроль и микроменеджмент"]'::jsonb,
  '["ясная иерархия полномочий", "финансовая прозрачность", "договоренности о правилах контроля"]'::jsonb,
  '["сложно в структурах с размытым владельцем решений"]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Управляет ресурсами и удерживает выполнение в заданных рамках.',
    'work_manifestation', 'Организует процесс так, чтобы обязательства выполнялись в срок и по стандарту.',
    'strengths', 'Воля; хозяйственность; высокая исполнительская дисциплина.',
    'risks', 'Авторитарность; недоверие к команде; конфликтность при неясных ролях.',
    'when_it_works_best', 'Когда полномочия и ответственность закреплены официально.',
    'when_talent_is_not_revealed', 'Когда нужно отвечать за результат без реальных рычагов управления.'
  ),
  jsonb_build_object(
    'hd_meaning', 'Gate 21 controls material resources through Ego authority.',
    'mechanics', 'Will center drives management pressure; 21-45 structures tribal distribution.',
    'classical_keywords', '["control", "resources", "management", "willpower"]'::jsonb,
    'source_logic', 'Gate interpretation. Final reading depends on center, channel, line, planet activation, side personality/design and whole chart context.',
    'pro_not_self', 'Control compulsion masks fear of losing value or authority.'
  ),
  jsonb_build_object(
    'primary_context', '["center", "channel", "activation", "line"]'::jsonb,
    'secondary_context', '["type", "strategy", "authority", "profile", "definition"]'::jsonb,
    'depends_on', 'Gate meaning must be adjusted by center, channel completion, planet activation, line and whole chart mechanics.',
    'related_element_kinds', '["activation", "channel", "defined_center", "open_center", "type", "strategy", "authority", "profile"]'::jsonb,
    'context_note', 'Standalone gate reference is only a semantic building block. It is not a final personality conclusion.'
  ),
  jsonb_build_object(
    'base', 'Пытается контролировать все, даже там, где это не его зона.',
    'pro', 'Not-Self control: coercive management without recognized mandate.',
    'warning_signals', '["конфликты за решения", "узкие горлышки из-за ручного контроля", "недоверие команды"]'::jsonb,
    'recovery_conditions', '["матрица полномочий", "делегирование с контрольными точками", "прозрачный отчет по ресурсам"]'::jsonb
  ),
  jsonb_build_array(
    jsonb_build_object(
      'contrast_context', 'Gate 21 without Gate 45 tribal voice',
      'how_it_would_read', 'May be experienced as private control drive without social mandate.',
      'why_current_context_is_different', 'Gate 45 provides recognized authority to allocate and command resources.'
    )
  ),
  'draft'
),

-- GATE 22: Openness
(
  'gate', '22', 'Ворота 22', 'ru', 'v1',
  'Gate 22 — Openness: социальная открытость, грация и эмоциональная выразительность в контакте.',
  'Человек тонко чувствует атмосферу общения и умеет создавать теплый, эстетичный контакт. Его влияние проявляется через манеру общения, вежливость и эмоциональный вкус. Важный фактор эффективности — уважение к его внутреннему состоянию и настроению.',
  'Gate 22 in Solar Plexus is social openness and grace. It colors expression with mood and emotional charisma. With Gate 12, emotional tone becomes refined voice transmission.',
  '["социальная грация", "эмоциональный такт", "создание теплой атмосферы"]'::jsonb,
  '["нестабильность коммуникации по настроению", "драматизация", "уязвимость к социальному неприятию"]'::jsonb,
  '["учитывать эмоциональный контекст встреч", "использовать в ролях клиентского контакта", "не требовать одинаковой интенсивности общения каждый день"]'::jsonb,
  '["этичная коммуникационная среда", "уважительное взаимодействие", "пространство для эмоциональной паузы"]'::jsonb,
  '["слабо проявляется в холодно-формальном и грубом общении"]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Создает качественный человеческий контакт через тонкость общения и открытость.',
    'work_manifestation', 'Смягчает напряжение в коммуникации и повышает уровень доверия в отношениях.',
    'strengths', 'Такт; обаяние; умение чувствовать эмоциональный фон.',
    'risks', 'Реактивность; зависимость от атмосферы; уход в обиду при резкости.',
    'when_it_works_best', 'Когда общение строится на уважении и есть право на эмоциональный темп.',
    'when_talent_is_not_revealed', 'Когда коммуникация сводится к грубому давлению и формальным приказам.'
  ),
  jsonb_build_object(
    'hd_meaning', 'Gate 22 transmits emotional openness and social grace.',
    'mechanics', 'Solar Plexus wave modulates social accessibility; links to Gate 12 voice.',
    'classical_keywords', '["openness", "grace", "social", "mood"]'::jsonb,
    'source_logic', 'Gate interpretation. Final reading depends on center, channel, line, planet activation, side personality/design and whole chart context.',
    'pro_not_self', 'Mood reactivity disrupts relational elegance and timing.'
  ),
  jsonb_build_object(
    'primary_context', '["center", "channel", "activation", "line"]'::jsonb,
    'secondary_context', '["type", "strategy", "authority", "profile", "definition"]'::jsonb,
    'depends_on', 'Gate meaning must be adjusted by center, channel completion, planet activation, line and whole chart mechanics.',
    'related_element_kinds', '["activation", "channel", "defined_center", "open_center", "type", "strategy", "authority", "profile"]'::jsonb,
    'context_note', 'Standalone gate reference is only a semantic building block. It is not a final personality conclusion.'
  ),
  jsonb_build_object(
    'base', 'Либо закрывается от людей, либо реагирует чрезмерно эмоционально.',
    'pro', 'Not-Self openness: theatrical swings without emotional clarity.',
    'warning_signals', '["социальная изоляция после конфликтов", "резкие эмоциональные пики", "нестабильность клиентского контакта"]'::jsonb,
    'recovery_conditions', '["бережная пауза перед ответом", "настройка формата общения", "регулярные практики эмоциональной стабилизации"]'::jsonb
  ),
  jsonb_build_array(
    jsonb_build_object(
      'contrast_context', 'Gate 22 without Gate 12 expression channel',
      'how_it_would_read', 'Can read as inner social mood without clear outward articulation.',
      'why_current_context_is_different', 'Gate 12 enables precise vocal expression of emotional openness.'
    )
  ),
  'draft'
),

-- GATE 23: Assimilation
(
  'gate', '23', 'Ворота 23', 'ru', 'v1',
  'Gate 23 — Assimilation: упрощение сложного до ясной формулы, понятной другим.',
  'Человек умеет брать запутанную идею и объяснять ее простыми словами без потери сути. Он особенно полезен в обучении, продуктовой коммуникации и презентации сложных решений. Главная сила — делать понятным то, что раньше казалось слишком сложным.',
  'Gate 23 in Throat is assimilation: breaking complexity into clear language. It voices individual knowing in digestible form. With Gate 43, breakthrough insight becomes understandable expression.',
  '["упрощение сложных тем", "ясное объяснение", "структурирование сообщения"]'::jsonb,
  '["слишком резкая прямота", "недооценка контекста слушателя", "отторжение при неподходящем тайминге"]'::jsonb,
  '["проверять уровень аудитории перед объяснением", "собирать обратную связь о понятности", "выбирать момент для ключевых сообщений"]'::jsonb,
  '["культура уточняющих вопросов", "время на объяснение", "уважение к экспертному языку и переводу в простой"]'::jsonb,
  '["сложно в среде, где новое отвергают автоматически"]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Переводит сложные идеи в понятные формулировки для команды.',
    'work_manifestation', 'Снижает барьер понимания: ускоряет внедрение новых подходов через ясное объяснение.',
    'strengths', 'Лаконичность; когнитивная ясность; обучающая подача.',
    'risks', 'Категоричность; нетерпение к медленному пониманию; риск быть неправильно услышанным.',
    'when_it_works_best', 'Когда есть готовность слушать и пространство для вопросов после объяснения.',
    'when_talent_is_not_revealed', 'Когда обратную связь блокируют, а новое заранее объявляют неверным.'
  ),
  jsonb_build_object(
    'hd_meaning', 'Gate 23 assimilates and verbalizes individual insight.',
    'mechanics', 'Gate 43 provides inner knowing; Gate 23 translates it into social language.',
    'classical_keywords', '["assimilation", "simplification", "explanation", "clarity"]'::jsonb,
    'source_logic', 'Gate interpretation. Final reading depends on center, channel, line, planet activation, side personality/design and whole chart context.',
    'pro_not_self', 'Blunt expression without timing causes rejection of valid insight.'
  ),
  jsonb_build_object(
    'primary_context', '["center", "channel", "activation", "line"]'::jsonb,
    'secondary_context', '["type", "strategy", "authority", "profile", "definition"]'::jsonb,
    'depends_on', 'Gate meaning must be adjusted by center, channel completion, planet activation, line and whole chart mechanics.',
    'related_element_kinds', '["activation", "channel", "defined_center", "open_center", "type", "strategy", "authority", "profile"]'::jsonb,
    'context_note', 'Standalone gate reference is only a semantic building block. It is not a final personality conclusion.'
  ),
  jsonb_build_object(
    'base', 'Говорит слишком резко и теряет контакт с аудиторией.',
    'pro', 'Not-Self assimilation: truth-dumping without transmission strategy.',
    'warning_signals', '["частая фраза «меня не поняли»", "напряжение после презентаций", "сопротивление команды новым идеям"]'::jsonb,
    'recovery_conditions', '["адаптация языка под аудиторию", "краткая структура «контекст-идея-польза»", "проверка понимания в диалоге"]'::jsonb
  ),
  jsonb_build_array(
    jsonb_build_object(
      'contrast_context', 'Gate 23 without Gate 43 breakthrough source',
      'how_it_would_read', 'May appear as communication simplification without deep mutative insight.',
      'why_current_context_is_different', 'Gate 43 contributes the original individual knowing to assimilate.'
    )
  ),
  'draft'
),

-- GATE 24: Rationalization
(
  'gate', '24', 'Ворота 24', 'ru', 'v1',
  'Gate 24 — Rationalization: возвращение к мысли для повторного осмысления и формулировки смысла.',
  'Человек склонен возвращаться к идеям и дорабатывать их до внутренней ясности. Он полезен там, где нужен повторный анализ после первой гипотезы. Его циклическое мышление часто дает зрелые выводы, если не требовать мгновенного финального ответа.',
  'Gate 24 in Ajna is rationalization and mental return. It revisits insights to integrate and explain them. In relation to Gate 61 pressure, it seeks conceptual closure through repetition.',
  '["глубокая переработка идей", "повторный анализ", "достижение интеллектуальной ясности"]'::jsonb,
  '["ментальное зацикливание", "задержка решений", "перерасход внимания на одну тему"]'::jsonb,
  '["ставить дедлайны на аналитические циклы", "фиксировать промежуточные выводы", "разделять этап размышления и этап действия"]'::jsonb,
  '["спокойная среда для мышления", "доступ к материалам для ревью", "уважение к аналитическим циклам"]'::jsonb,
  '["хуже в формате постоянных мгновенных решений"]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Возвращается к идеям, чтобы довести их до ясного и устойчивого понимания.',
    'work_manifestation', 'Повышает качество решений за счет повторной проверки логики и формулировок.',
    'strengths', 'Интеллектуальная настойчивость; глубина осмысления; аккуратность выводов.',
    'risks', 'Зацикливание; задержка темпа; переанализ без перехода к действию.',
    'when_it_works_best', 'Когда есть ограниченные по времени циклы ревью и критерии готовности решения.',
    'when_talent_is_not_revealed', 'Когда думать глубоко не дают и требуют мгновенной определенности.'
  ),
  jsonb_build_object(
    'hd_meaning', 'Gate 24 rationalizes by revisiting mental material repeatedly.',
    'mechanics', 'Transforms Head pressure into conceptual integration via cyclical return.',
    'classical_keywords', '["rationalization", "review", "mental return", "integration"]'::jsonb,
    'source_logic', 'Gate interpretation. Final reading depends on center, channel, line, planet activation, side personality/design and whole chart context.',
    'pro_not_self', 'Compulsive rumination replaces clear inner integration.'
  ),
  jsonb_build_object(
    'primary_context', '["center", "channel", "activation", "line"]'::jsonb,
    'secondary_context', '["type", "strategy", "authority", "profile", "definition"]'::jsonb,
    'depends_on', 'Gate meaning must be adjusted by center, channel completion, planet activation, line and whole chart mechanics.',
    'related_element_kinds', '["activation", "channel", "defined_center", "open_center", "type", "strategy", "authority", "profile"]'::jsonb,
    'context_note', 'Standalone gate reference is only a semantic building block. It is not a final personality conclusion.'
  ),
  jsonb_build_object(
    'base', 'Думает по кругу и откладывает практический шаг.',
    'pro', 'Not-Self rationalization: looping mind without resolution threshold.',
    'warning_signals', '["повтор одних и тех же аргументов", "усталость от незавершенных решений", "снижение скорости команды"]'::jsonb,
    'recovery_conditions', '["лимит времени на повторный анализ", "чеклист достаточности данных", "переход к тестовому действию"]'::jsonb
  ),
  jsonb_build_array(
    jsonb_build_object(
      'contrast_context', 'Gate 24 without stable Head pressure context',
      'how_it_would_read', 'May read as occasional reflection rather than persistent mental return.',
      'why_current_context_is_different', 'Pressure mechanics define frequency and urgency of rationalization loops.'
    )
  ),
  'draft'
),

-- GATE 25: Innocence
(
  'gate', '25', 'Ворота 25', 'ru', 'v1',
  'Gate 25 — Innocence: универсальная любовь, искренность и спонтанность сердца без циничного фильтра.',
  'Человек приносит в команду прямую доброжелательность и способность видеть в людях человеческое, а не только функциональное. Его стиль часто обезоруживает напряжение и возвращает к простым честным ценностям. Он особенно полезен в периодах конфликта и усталости, когда важно восстановить доверие.',
  'Gate 25 in G Center carries innocence and universal love frequency. It acts from spirit rather than strategic calculation. In channel 25-51, this innocence meets shock initiation dynamics.',
  '["искренняя доброжелательность", "этическое влияние", "восстановление доверия"]'::jsonb,
  '["наивность к манипуляциям", "эмоциональная ранимость", "игнор прагматических ограничений"]'::jsonb,
  '["использовать в медиации и восстановлении отношений", "добавлять прагматичного партнера для баланса", "защищать от токсичных взаимодействий"]'::jsonb,
  '["ценностно зрелая культура", "уважительное общение", "поддержка гуманного лидерства"]'::jsonb,
  '["сложно в циничной среде, где доброжелательность считают слабостью"]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Поддерживает атмосферу доверия через искреннее и человечное отношение к людям.',
    'work_manifestation', 'Смягчает конфликты, укрепляет командную сплоченность и возвращает смысл совместной работы.',
    'strengths', 'Открытость сердца; моральная чистота мотива; объединяющее влияние.',
    'risks', 'Излишняя доверчивость; уязвимость к жестким средам; недооценка рисков.',
    'when_it_works_best', 'Когда ценности команды выражены явно и подкреплены реальным поведением.',
    'when_talent_is_not_revealed', 'Когда доминируют цинизм, недоверие и инструментальное отношение к людям.'
  ),
  jsonb_build_object(
    'hd_meaning', 'Gate 25 radiates innocence and universal love from the G Center.',
    'mechanics', 'Spirit frequency can be initiated by Gate 51 shock in the 25-51 channel.',
    'classical_keywords', '["innocence", "universal love", "spirit", "spontaneity"]'::jsonb,
    'source_logic', 'Gate interpretation. Final reading depends on center, channel, line, planet activation, side personality/design and whole chart context.',
    'pro_not_self', 'Spiritual bypassing or naivety replaces embodied innocence.'
  ),
  jsonb_build_object(
    'primary_context', '["center", "channel", "activation", "line"]'::jsonb,
    'secondary_context', '["type", "strategy", "authority", "profile", "definition"]'::jsonb,
    'depends_on', 'Gate meaning must be adjusted by center, channel completion, planet activation, line and whole chart mechanics.',
    'related_element_kinds', '["activation", "channel", "defined_center", "open_center", "type", "strategy", "authority", "profile"]'::jsonb,
    'context_note', 'Standalone gate reference is only a semantic building block. It is not a final personality conclusion.'
  ),
  jsonb_build_object(
    'base', 'Идеализирует людей и игнорирует явные сигналы небезопасности.',
    'pro', 'Not-Self innocence: ungrounded openness without discernment.',
    'warning_signals', '["повторяющиеся разочарования в людях", "самопожертвование без взаимности", "эмоциональные провалы после предательства"]'::jsonb,
    'recovery_conditions', '["сочетать доброжелательность с границами", "проверять действия, а не только обещания", "держать опору на личные ценности"]'::jsonb
  ),
  jsonb_build_array(
    jsonb_build_object(
      'contrast_context', 'Gate 25 without Gate 51 initiation',
      'how_it_would_read', 'Can read as gentle goodwill without catalytic transformative impact.',
      'why_current_context_is_different', 'Gate 51 introduces shock-initiation that tests and activates innocence.'
    )
  ),
  'draft'
),

-- GATE 26: Egoist
(
  'gate', '26', 'Ворота 26', 'ru', 'v1',
  'Gate 26 — Egoist (The Taming Power of the Great): сила убеждения, продвижения и точной подачи ценности.',
  'Человек умеет презентовать идею так, чтобы в нее хотелось вложиться: выбирает верные акценты, говорит о выгоде и ведет к решению.',
  'Gate 26 in Heart/Ego Center — tribal salesmanship and memory-based persuasion; part of Channel 26-44.',
  '["переговорная убедительность", "умение упаковывать ценность", "сильная работа с возражениями"]'::jsonb,
  '["склонность приукрашивать факты", "эмоциональное давление в продаже", "истощение от постоянной гонки за результатом"]'::jsonb,
  '["фиксировать критерии честной коммуникации", "разделять подготовку и переговоры по времени", "проверять обещания до озвучивания"]'::jsonb,
  '["метрики, где видно реальную пользу", "культура этичных продаж", "доступ к качественным кейсам"]'::jsonb,
  '["снижается эффективность в среде, где нельзя влиять на решение"]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Сильная сторона — способность убеждать людей и переводить интерес в договоренность.',
    'work_manifestation', 'На работе это проявляется в точной аргументации, ясной подаче пользы и умении закрывать сделки.',
    'strengths', 'Харизма в общении, деловая смелость, высокая результативность в переговорах.',
    'risks', 'Можно увлечься внешним эффектом, пообещать лишнее или перегрузить себя обязательствами.',
    'when_it_works_best', 'Лучше раскрывается при прозрачных правилах, честной репутации продукта и понятных границах ответственности.',
    'when_talent_is_not_revealed', 'Ослабевает, когда нет доверия, ценность неочевидна, а коммуникация сводится к формальному давлению.'
  ),
  jsonb_build_object(
    'hd_meaning', 'Gate 26 carries the archetype of the tribal marketer in the Ego stream.',
    'mechanics', 'Works through willpower pulses and pattern memory; amplified in Channel 26-44 with Gate 44.',
    'classical_keywords', '["persuasion", "salesmanship", "ego", "influence"]'::jsonb,
    'source_logic', 'Gate interpretation. Final reading depends on center, channel, line, planet activation, side personality/design and whole chart context.',
    'pro_not_self', 'Not-Self distortion: manipulative persuasion to prove worth instead of transmitting real value.'
  ),
  jsonb_build_object(
    'primary_context', '["center", "channel", "activation", "line"]'::jsonb,
    'secondary_context', '["type", "strategy", "authority", "profile", "definition"]'::jsonb,
    'depends_on', 'Gate meaning must be adjusted by center, channel completion, planet activation, line and whole chart mechanics.',
    'related_element_kinds', '["activation", "channel", "defined_center", "open_center", "type", "strategy", "authority", "profile"]'::jsonb,
    'context_note', 'Standalone gate reference is only a semantic building block. It is not a final personality conclusion.'
  ),
  jsonb_build_object(
    'base', 'В искажении человек продает любой ценой и теряет уважение к качеству договоренностей.',
    'pro', 'Ego overcompensation: exaggeration, tactical half-truths, and fear-driven closing behavior.',
    'warning_signals', '["навязчивое желание дожать любой контакт", "раздражение при сомнениях клиента", "повторяющиеся претензии к обещаниям"]'::jsonb,
    'recovery_conditions', '["вернуть фактическую точность в аргументацию", "сократить обещания до выполнимого минимума", "строить сделки через долгосрочное доверие"]'::jsonb
  ),
  jsonb_build_array(
    jsonb_build_object(
      'contrast_context', 'Gate 26 active without complete tribal circuitry emphasis.',
      'how_it_would_read', 'Could read as personal rhetorical talent rather than stable tribal bargaining force.',
      'why_current_context_is_different', 'With full channel mechanics and proper transits, persuasion becomes a reliable resource function.'
    )
  ),
  'draft'
),

-- GATE 27: Caring
(
  'gate', '27', 'Ворота 27', 'ru', 'v1',
  'Gate 27 — Caring (Nourishment): питание, поддержка и ответственность за благополучие системы.',
  'Человек естественно берет на себя заботу о людях, процессах и ресурсе команды, чтобы никто не выпадал из общего ритма.',
  'Gate 27 in Sacral Center — preserving life-force through nourishment; part of Channel 27-50.',
  '["устойчивая поддержка команды", "внимание к реальным потребностям", "ответственное распределение заботы"]'::jsonb,
  '["гиперопека и контроль", "перегрузка чужими задачами", "обида, если заботу воспринимают как должное"]'::jsonb,
  '["явно согласовывать границы помощи", "распределять нагрузку по роли", "регулярно пересматривать приоритеты поддержки"]'::jsonb,
  '["команда, где ценят взаимность", "понятные правила ответственности", "ритм без постоянных авралов"]'::jsonb,
  '["трудно работать там, где помощь считается слабостью"]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Базовая тема — практичная забота и умение поддерживать людей в рабочем процессе.',
    'work_manifestation', 'В делах это видно как готовность подхватить, помочь восстановить ресурс и удержать команду в продуктивном состоянии.',
    'strengths', 'Надежность, человечность, высокая вовлеченность в общее благополучие.',
    'risks', 'Есть риск забывать о себе, тащить чужие обязанности и накапливать усталость.',
    'when_it_works_best', 'Лучше проявляется при честном обмене поддержкой и уважении к личным границам.',
    'when_talent_is_not_revealed', 'Снижается, когда заботой злоупотребляют и ответственность становится односторонней.'
  ),
  jsonb_build_object(
    'hd_meaning', 'Gate 27 is the sacrificial nourishment principle in tribal defense circuitry.',
    'mechanics', 'Sacral life-force is directed to protection and feeding; stabilized through Gate 50 resonance.',
    'classical_keywords', '["nourishment", "care", "responsibility", "sustainment"]'::jsonb,
    'source_logic', 'Gate interpretation. Final reading depends on center, channel, line, planet activation, side personality/design and whole chart context.',
    'pro_not_self', 'Not-Self: compulsive caregiving to earn love, leading to depletion and resentment.'
  ),
  jsonb_build_object(
    'primary_context', '["center", "channel", "activation", "line"]'::jsonb,
    'secondary_context', '["type", "strategy", "authority", "profile", "definition"]'::jsonb,
    'depends_on', 'Gate meaning must be adjusted by center, channel completion, planet activation, line and whole chart mechanics.',
    'related_element_kinds', '["activation", "channel", "defined_center", "open_center", "type", "strategy", "authority", "profile"]'::jsonb,
    'context_note', 'Standalone gate reference is only a semantic building block. It is not a final personality conclusion.'
  ),
  jsonb_build_object(
    'base', 'В искажении человек спасает всех подряд и не оставляет сил на собственные задачи.',
    'pro', 'Distortion of Gate 27: overfeeding the tribe without sustainable boundaries.',
    'warning_signals', '["постоянная усталость к концу дня", "внутреннее чувство несправедливости", "невозможность отказать даже в лишнем"]'::jsonb,
    'recovery_conditions', '["ввести лимит на объем помощи", "отделить поддержку от спасательства", "вернуть фокус на ключевые обязательства"]'::jsonb
  ),
  jsonb_build_array(
    jsonb_build_object(
      'contrast_context', 'Gate 27 highlighted without full 27-50 continuity.',
      'how_it_would_read', 'May appear as kindness trait, not as structured nourishment intelligence.',
      'why_current_context_is_different', 'Channel context defines whether care becomes strategic stewardship or situational empathy.'
    )
  ),
  'draft'
),

-- GATE 28: Game Player
(
  'gate', '28', 'Ворота 28', 'ru', 'v1',
  'Gate 28 — Game Player (The Struggle): борьба, риск и поиск подлинного смысла через вызов.',
  'Человека притягивают сложные задачи с высокой ставкой: ему важно чувствовать, что усилия направлены на действительно значимую цель.',
  'Gate 28 in Spleen Center — existential struggle and risk instinct; linked to Channel 28-38.',
  '["смелость идти в неопределенность", "стойкость в трудных проектах", "чувство ценности цели"]'::jsonb,
  '["поиск драмы ради остроты", "затяжная борьба без результата", "игнор сигналов переутомления"]'::jsonb,
  '["проверять, ради чего ведется борьба", "разбивать риск на этапы", "фиксировать критерий остановки"]'::jsonb,
  '["проекты с реальным вызовом", "культура зрелого риска", "команда, умеющая поддержать в кризис"]'::jsonb,
  '["теряет мотивацию в рутине без смысла"]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Ключевая тема — стремление преодолевать трудности ради стоящей цели.',
    'work_manifestation', 'В работе это дает готовность брать сложные направления и удерживаться там, где другие отступают.',
    'strengths', 'Мужество, настойчивость, способность не сдаваться в критические моменты.',
    'risks', 'Можно застрять в бесконечном преодолении и забыть оценивать полезность усилий.',
    'when_it_works_best', 'Лучше работает, когда цель ясно определена и риск осознанно рассчитан.',
    'when_talent_is_not_revealed', 'Не раскрывается, если человек воюет с обстоятельствами без понятного смысла и границ.'
  ),
  jsonb_build_object(
    'hd_meaning', 'Gate 28 channels fear of purposelessness into courageous engagement with challenge.',
    'mechanics', 'Spleenic awareness pushes toward meaningful struggle; completes with Gate 38 in opposition mechanics.',
    'classical_keywords', '["struggle", "risk", "purpose", "existential"]'::jsonb,
    'source_logic', 'Gate interpretation. Final reading depends on center, channel, line, planet activation, side personality/design and whole chart context.',
    'pro_not_self', 'Not-Self: dramatic risk-taking to feel alive while avoiding authentic purpose.'
  ),
  jsonb_build_object(
    'primary_context', '["center", "channel", "activation", "line"]'::jsonb,
    'secondary_context', '["type", "strategy", "authority", "profile", "definition"]'::jsonb,
    'depends_on', 'Gate meaning must be adjusted by center, channel completion, planet activation, line and whole chart mechanics.',
    'related_element_kinds', '["activation", "channel", "defined_center", "open_center", "type", "strategy", "authority", "profile"]'::jsonb,
    'context_note', 'Standalone gate reference is only a semantic building block. It is not a final personality conclusion.'
  ),
  jsonb_build_object(
    'base', 'В искажении человек выбирает тяжелое только потому, что спокойный путь кажется «слишком простым».',
    'pro', 'Distorted Gate 28 amplifies fear and turns purpose into compulsive survival theater.',
    'warning_signals', '["привычка усложнять даже ясные задачи", "чувство пустоты после победы", "повышенная тревожность перед отдыхом"]'::jsonb,
    'recovery_conditions', '["проверять связь задачи с личными ценностями", "снижать ненужный риск", "включать периоды восстановления после рывка"]'::jsonb
  ),
  jsonb_build_array(
    jsonb_build_object(
      'contrast_context', 'Gate 28 read apart from full individual mutation context.',
      'how_it_would_read', 'Could seem like generic appetite for challenge.',
      'why_current_context_is_different', 'Proper channel and line context clarifies whether struggle serves purpose or compensates fear.'
    )
  ),
  'draft'
),

-- GATE 29: Commitment
(
  'gate', '29', 'Ворота 29', 'ru', 'v1',
  'Gate 29 — Commitment (Perseverance): сила «да» и выносливость в долгом обязательстве.',
  'Человек умеет входить в процесс надолго и доводить начатое до результата, если внутренне согласен с задачей.',
  'Gate 29 in Sacral Center — perseverance through committed response; part of Channel 29-46.',
  '["долгая рабочая выносливость", "надежность в обязательствах", "умение завершать циклы"]'::jsonb,
  '["соглашаться из вежливости", "тащить лишние обязательства", "потеря качества из-за перегруза"]'::jsonb,
  '["проверять согласие до старта", "ограничивать число параллельных обязательств", "подводить промежуточные итоги"]'::jsonb,
  '["прозрачные сроки", "договоренности о приоритетах", "команда с дисциплиной исполнения"]'::jsonb,
  '["сложно там, где обязательства меняются ежедневно"]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Главная черта — способность сказать «да» важному делу и идти до конца.',
    'work_manifestation', 'В практике это проявляется как стабильное выполнение обещанного и устойчивый темп на длинной дистанции.',
    'strengths', 'Надежность, терпение, уважение к взятым обязательствам.',
    'risks', 'Есть риск соглашаться автоматически и перерабатывать в ущерб качеству жизни.',
    'when_it_works_best', 'Сильнее раскрывается при осознанном выборе задач и реалистичной нагрузке.',
    'when_talent_is_not_revealed', 'Теряется, когда человек говорит «да» всему подряд и лишается внутренней опоры.'
  ),
  jsonb_build_object(
    'hd_meaning', 'Gate 29 binds Sacral force to experiential commitment and sustained saying-yes.',
    'mechanics', 'Response-led endurance; in Channel 29-46 commitment is embodied through lived experience.',
    'classical_keywords', '["commitment", "perseverance", "yes", "endurance"]'::jsonb,
    'source_logic', 'Gate interpretation. Final reading depends on center, channel, line, planet activation, side personality/design and whole chart context.',
    'pro_not_self', 'Not-Self: overcommitting to prove value, then collapsing into frustration.'
  ),
  jsonb_build_object(
    'primary_context', '["center", "channel", "activation", "line"]'::jsonb,
    'secondary_context', '["type", "strategy", "authority", "profile", "definition"]'::jsonb,
    'depends_on', 'Gate meaning must be adjusted by center, channel completion, planet activation, line and whole chart mechanics.',
    'related_element_kinds', '["activation", "channel", "defined_center", "open_center", "type", "strategy", "authority", "profile"]'::jsonb,
    'context_note', 'Standalone gate reference is only a semantic building block. It is not a final personality conclusion.'
  ),
  jsonb_build_object(
    'base', 'В искажении человек раздает обещания быстрее, чем оценивает свои ресурсы.',
    'pro', 'Distortion: indiscriminate Sacral yes creates energetic debt and broken follow-through.',
    'warning_signals', '["слишком много открытых обязательств", "вина за невыполненные обещания", "чувство загнанности без пауз"]'::jsonb,
    'recovery_conditions', '["переоценить список обязательств", "снять второстепенные договоренности", "оставить только задачи с реальным согласием"]'::jsonb
  ),
  jsonb_build_array(
    jsonb_build_object(
      'contrast_context', 'Gate 29 viewed without full 29-46 embodiment dynamics.',
      'how_it_would_read', 'Can be interpreted as simple diligence trait.',
      'why_current_context_is_different', 'Full mechanics define whether commitment is truly responsive or socially conditioned.'
    )
  ),
  'draft'
),

-- GATE 30: Desire
(
  'gate', '30', 'Ворота 30', 'ru', 'v1',
  'Gate 30 — Desire (Clinging Fire): интенсивность чувств, желаний и эмоционального притяжения к опыту.',
  'Человек проживает сильные желания и способен зажигать команду внутренней мотивацией, когда видит вдохновляющую цель.',
  'Gate 30 in Solar Plexus Center — emotional desire pressure fueling experiential drive.',
  '["высокая эмоциональная вовлеченность", "мощный мотивационный импульс", "умение зажигать идеей"]'::jsonb,
  '["идеализация будущего", "эмоциональные качели ожиданий", "разочарование при несовпадении с реальностью"]'::jsonb,
  '["разделять желание и факт-план", "держать этапы проверки ожиданий", "поддерживать эмоциональную экологичность в команде"]'::jsonb,
  '["среда с уважением к чувствам", "пространство для честного диалога", "возможность корректировать курс"]'::jsonb,
  '["сложнее в холодной культуре, где эмоции запрещены"]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Суть — сильное внутреннее желание прожить насыщенный и значимый опыт.',
    'work_manifestation', 'В работе это дает страстную вовлеченность и способность вдохновлять на амбициозные шаги.',
    'strengths', 'Эмоциональная энергия, притягательность целей, глубокая искренность в мотивации.',
    'risks', 'Можно перегреть ожидания и тяжело переносить реальность, если она развивается медленнее мечты.',
    'when_it_works_best', 'Лучше раскрывается, когда амбиции подкреплены поэтапным планом и зрелой обратной связью.',
    'when_talent_is_not_revealed', 'Слабеет, если желания подавляются или, наоборот, превращаются в хаотичную импульсивность.'
  ),
  jsonb_build_object(
    'hd_meaning', 'Gate 30 modulates emotional wave toward longing, passion, and destiny-charged experience.',
    'mechanics', 'Solar Plexus pressure seeks feeling-depth; channel context determines expression range and timing.',
    'classical_keywords', '["desire", "feelings", "intensity", "experience"]'::jsonb,
    'source_logic', 'Gate interpretation. Final reading depends on center, channel, line, planet activation, side personality/design and whole chart context.',
    'pro_not_self', 'Not-Self: attachment to imagined outcomes produces emotional volatility.'
  ),
  jsonb_build_object(
    'primary_context', '["center", "channel", "activation", "line"]'::jsonb,
    'secondary_context', '["type", "strategy", "authority", "profile", "definition"]'::jsonb,
    'depends_on', 'Gate meaning must be adjusted by center, channel completion, planet activation, line and whole chart mechanics.',
    'related_element_kinds', '["activation", "channel", "defined_center", "open_center", "type", "strategy", "authority", "profile"]'::jsonb,
    'context_note', 'Standalone gate reference is only a semantic building block. It is not a final personality conclusion.'
  ),
  jsonb_build_object(
    'base', 'В искажении человек живет ожиданиями и теряет контакт с тем, что возможно сделать прямо сейчас.',
    'pro', 'Distorted Gate 30 amplifies fantasy desire and treats uncertainty as personal rejection.',
    'warning_signals', '["резкие перепады настроения по проекту", "завышенные обещания в момент вдохновения", "обесценивание достигнутого результата"]'::jsonb,
    'recovery_conditions', '["синхронизировать ожидания с фактами", "снизить темп до устойчивого", "фиксировать маленькие реальные победы"]'::jsonb
  ),
  jsonb_build_array(
    jsonb_build_object(
      'contrast_context', 'Gate 30 assessed outside complete emotional channel architecture.',
      'how_it_would_read', 'May look like temperament only.',
      'why_current_context_is_different', 'Wave mechanics and circuitry reveal whether desire becomes creation fuel or reactive turbulence.'
    )
  ),
  'draft'
),

-- GATE 31: Leading
(
  'gate', '31', 'Ворота 31', 'ru', 'v1',
  'Gate 31 — Leading (Influence): демократическое влияние и голос лидера от имени группы.',
  'Человек умеет представлять общую позицию так, чтобы люди чувствовали справедливость, ясность и направление движения.',
  'Gate 31 in Throat Center — elected influence voice in collective logic expression.',
  '["убедительная публичная речь", "умение представлять интересы группы", "ясное формулирование курса"]'::jsonb,
  '["авторитарный тон", "зависимость от одобрения", "подмена голоса команды личной повесткой"]'::jsonb,
  '["фиксировать мандат роли", "собирать обратную связь перед ключевыми заявлениями", "держать прозрачность аргументов"]'::jsonb,
  '["культура открытых обсуждений", "понятные правила принятия решений", "уважение к коллективной ответственности"]'::jsonb,
  '["малополезно в среде, где мнение команды не учитывается"]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Главный ресурс — способность говорить от лица группы и направлять общее движение.',
    'work_manifestation', 'В деятельности это выражается в точной коммуникации решений и удержании доверия между людьми.',
    'strengths', 'Политическая зрелость, ясность речи, ответственность за последствия слов.',
    'risks', 'Есть риск давить статусом, уходить в риторику и терять контакт с реальными запросами команды.',
    'when_it_works_best', 'Раскрывается, когда лидерство подтверждено доверием, а диалог остается двусторонним.',
    'when_talent_is_not_revealed', 'Ослабевает, если коммуникация превращается в монолог без обратной связи и совместности.'
  ),
  jsonb_build_object(
    'hd_meaning', 'Gate 31 is the archetype of democratic leadership through voiced influence.',
    'mechanics', 'Collective logic seeks representation; in proper mechanics the voice is authorized by group recognition.',
    'classical_keywords', '["leadership", "influence", "democracy", "voice"]'::jsonb,
    'source_logic', 'Gate interpretation. Final reading depends on center, channel, line, planet activation, side personality/design and whole chart context.',
    'pro_not_self', 'Not-Self: speaking to dominate rather than to represent collective direction.'
  ),
  jsonb_build_object(
    'primary_context', '["center", "channel", "activation", "line"]'::jsonb,
    'secondary_context', '["type", "strategy", "authority", "profile", "definition"]'::jsonb,
    'depends_on', 'Gate meaning must be adjusted by center, channel completion, planet activation, line and whole chart mechanics.',
    'related_element_kinds', '["activation", "channel", "defined_center", "open_center", "type", "strategy", "authority", "profile"]'::jsonb,
    'context_note', 'Standalone gate reference is only a semantic building block. It is not a final personality conclusion.'
  ),
  jsonb_build_object(
    'base', 'В искажении человек говорит «за всех», не проверяя, разделяют ли люди его позицию.',
    'pro', 'Distortion: pseudo-leadership through rhetorical control without election dynamics.',
    'warning_signals', '["напряжение после публичных выступлений", "частые недопонимания с командой", "потребность постоянно доказывать правоту"]'::jsonb,
    'recovery_conditions', '["вернуть практику слушания", "сверять формулировки с реальными ожиданиями группы", "укреплять доверие через последовательные действия"]'::jsonb
  ),
  jsonb_build_array(
    jsonb_build_object(
      'contrast_context', 'Gate 31 activated without full group resonance mechanics.',
      'how_it_would_read', 'Could appear as communication confidence only.',
      'why_current_context_is_different', 'True leadership expression depends on recognition, timing, and circuitry integration.'
    )
  ),
  'draft'
),

-- GATE 32: Continuity
(
  'gate', '32', 'Ворота 32', 'ru', 'v1',
  'Gate 32 — Continuity (Duration): инстинкт сохранения жизнеспособного и устойчивой трансформации.',
  'Человек чувствует, что стоит продолжать, а что пора отпустить, поэтому помогает менять систему без потери ее основы.',
  'Gate 32 in Spleen Center — instinct for continuity, survival value, and sustainable mutation.',
  '["оценка долгосрочной жизнеспособности", "бережная эволюция процессов", "чутье на устойчивые решения"]'::jsonb,
  '["страх потери и излишняя осторожность", "удерживание устаревшего", "затягивание необходимых изменений"]'::jsonb,
  '["разделять ценное и устаревшее по критериям", "проводить изменения поэтапно", "фиксировать признаки устойчивости после внедрения"]'::jsonb,
  '["культура ответственных изменений", "доступ к истории решений", "горизонт планирования дольше квартала"]'::jsonb,
  '["сложно в среде постоянных резких разворотов"]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Ключевая способность — сохранять рабочее ядро и развивать его без разрушительных скачков.',
    'work_manifestation', 'В задачах это проявляется как трезвая оценка, какие практики можно масштабировать, а какие пора закрыть.',
    'strengths', 'Стратегическая устойчивость, аккуратность в переходах, уважение к накопленному опыту.',
    'risks', 'Можно слишком держаться за привычное и тормозить рост из-за страха ошибиться.',
    'when_it_works_best', 'Лучше работает при четких показателях качества и возможности тестировать изменения без паники.',
    'when_talent_is_not_revealed', 'Снижается, когда решения принимаются хаотично и ценность прошлого опыта полностью игнорируется.'
  ),
  jsonb_build_object(
    'hd_meaning', 'Gate 32 governs splenic continuity and fear of failure within material evolution streams.',
    'mechanics', 'Survival intelligence evaluates what can endure; harmonizes with Gate 54 for transformation trajectory.',
    'classical_keywords', '["continuity", "instinct", "transformation", "survival"]'::jsonb,
    'source_logic', 'Gate interpretation. Final reading depends on center, channel, line, planet activation, side personality/design and whole chart context.',
    'pro_not_self', 'Not-Self: clinging to status continuity while avoiding necessary mutation.'
  ),
  jsonb_build_object(
    'primary_context', '["center", "channel", "activation", "line"]'::jsonb,
    'secondary_context', '["type", "strategy", "authority", "profile", "definition"]'::jsonb,
    'depends_on', 'Gate meaning must be adjusted by center, channel completion, planet activation, line and whole chart mechanics.',
    'related_element_kinds', '["activation", "channel", "defined_center", "open_center", "type", "strategy", "authority", "profile"]'::jsonb,
    'context_note', 'Standalone gate reference is only a semantic building block. It is not a final personality conclusion.'
  ),
  jsonb_build_object(
    'base', 'В искажении человек удерживает привычные схемы просто потому, что боится потерять контроль.',
    'pro', 'Distorted Gate 32 overweights failure anxiety and blocks organic adaptation.',
    'warning_signals', '["регулярное откладывание назревших решений", "повтор одних и тех же мер без эффекта", "напряжение при обсуждении перемен"]'::jsonb,
    'recovery_conditions', '["перевести страх в проверяемые гипотезы", "запустить пилот ограниченного масштаба", "оценивать результат по фактам, а не по тревоге"]'::jsonb
  ),
  jsonb_build_array(
    jsonb_build_object(
      'contrast_context', 'Gate 32 interpreted without full 32-54 transformational circuitry.',
      'how_it_would_read', 'May look like conservative personality trait.',
      'why_current_context_is_different', 'Complete mechanics show whether continuity protects growth or resists evolution.'
    )
  ),
  'draft'
),

-- GATE 33: Retreat
(
  'gate', '33', 'Ворота 33', 'ru', 'v1',
  'Gate 33 — Retreat (Privacy): уединение, отступление и осмысление опыта перед публичной речью.',
  'Человеку нужны паузы и личное пространство, чтобы перевести прожитое в выводы и говорить по делу, а не на эмоциях момента.',
  'Gate 33 in Throat Center — privacy-driven recollection voice; memory released by timing.',
  '["глубокая рефлексия опыта", "точное извлечение уроков", "спокойная осмысленная коммуникация"]'::jsonb,
  '["уход в изоляцию на слишком долгий срок", "задержка важных сообщений", "закрытость в периоды стресса"]'::jsonb,
  '["уважать право на паузу после интенсивных этапов", "согласовывать сроки обратной связи", "разделять личное и публичное пространство"]'::jsonb,
  '["тихие зоны для концентрации", "культура конфиденциальности", "ритм, где есть время на осмысление"]'::jsonb,
  '["сложно в режиме непрерывной публичности без пауз"]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Основная тема — сначала отойти, понять, и только затем делиться выводами.',
    'work_manifestation', 'В работе это дает качественные разборы и аккуратные решения, основанные на прожитом опыте.',
    'strengths', 'Трезвость суждений, глубина выводов, бережность к личным границам.',
    'risks', 'Можно слишком затянуть паузу и потерять момент для полезной коммуникации.',
    'when_it_works_best', 'Лучше раскрывается, когда есть право на тишину и понятный формат итогового отчета.',
    'when_talent_is_not_revealed', 'Слабеет в среде, где требуется постоянная немедленная реакция без времени на размышление.'
  ),
  jsonb_build_object(
    'hd_meaning', 'Gate 33 protects memory and controls disclosure timing in the Throat expression stream.',
    'mechanics', 'Retreat phase stores experiential data; articulation emerges when timing and context align.',
    'classical_keywords', '["retreat", "privacy", "reflection", "memory"]'::jsonb,
    'source_logic', 'Gate interpretation. Final reading depends on center, channel, line, planet activation, side personality/design and whole chart context.',
    'pro_not_self', 'Not-Self: defensive withdrawal and narrative withholding out of fear of exposure.'
  ),
  jsonb_build_object(
    'primary_context', '["center", "channel", "activation", "line"]'::jsonb,
    'secondary_context', '["type", "strategy", "authority", "profile", "definition"]'::jsonb,
    'depends_on', 'Gate meaning must be adjusted by center, channel completion, planet activation, line and whole chart mechanics.',
    'related_element_kinds', '["activation", "channel", "defined_center", "open_center", "type", "strategy", "authority", "profile"]'::jsonb,
    'context_note', 'Standalone gate reference is only a semantic building block. It is not a final personality conclusion.'
  ),
  jsonb_build_object(
    'base', 'В искажении человек замолкает не ради ясности, а из-за внутреннего напряжения и недоверия.',
    'pro', 'Distorted Gate 33 converts restorative retreat into avoidant secrecy.',
    'warning_signals', '["пропуски важных синхронизаций", "чувство отдаленности от команды", "накопление недосказанности"]'::jsonb,
    'recovery_conditions', '["заранее обозначать время возвращения к диалогу", "фиксировать выводы письменно", "обсуждать границы приватности открыто"]'::jsonb
  ),
  jsonb_build_array(
    jsonb_build_object(
      'contrast_context', 'Gate 33 read apart from complete memory/voice circuitry.',
      'how_it_would_read', 'Could be seen as introversion rather than functional retreat mechanic.',
      'why_current_context_is_different', 'Channel and line context define whether withdrawal serves integration or avoidance.'
    )
  ),
  'draft'
),

-- GATE 34: Power
(
  'gate', '34', 'Ворота 34', 'ru', 'v1',
  'Gate 34 — Power (The Power of the Great): большая жизненная сила, автономная мощь и скорость действия.',
  'Человек способен быстро выполнять большой объем работы самостоятельно, когда есть понятная цель и свобода в реализации.',
  'Gate 34 in Sacral Center — raw sacral power and independent force; key in Manifesting Generator dynamics.',
  '["высокая работоспособность", "быстрое практическое исполнение", "автономность в задачах"]'::jsonb,
  '["перегруз из-за постоянного форсажа", "игнор ограничений команды", "нетерпение к более медленному темпу других"]'::jsonb,
  '["давать четкий результат вместо микроконтроля", "согласовывать точки синхронизации", "планировать обязательные окна восстановления"]'::jsonb,
  '["пространство для самостоятельной работы", "задачи с видимым практическим выходом", "минимум бюрократических задержек"]'::jsonb,
  '["низкая эффективность в мелком согласовательном процессе"]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Ключевой ресурс — мощная энергия действия и способность быстро делать сложное.',
    'work_manifestation', 'В деле это видно как резкое ускорение прогресса, когда человеку не мешают лишними переключениями.',
    'strengths', 'Скорость, выносливость, ориентация на реальный результат.',
    'risks', 'Можно переоценить запас сил, идти в перегруз и терять качество на длинной дистанции.',
    'when_it_works_best', 'Лучше раскрывается при свободе исполнения, ясной цели и разумных паузах восстановления.',
    'when_talent_is_not_revealed', 'Ослабевает, когда энергию постоянно дробят микрозадачами и бесконечными согласованиями.'
  ),
  jsonb_build_object(
    'hd_meaning', 'Gate 34 is pure Sacral power, often expressing as independent life-force output.',
    'mechanics', 'Force is response-driven; circuit context determines whether it manifests as power, charisma, or busyness.',
    'classical_keywords', '["power", "sacral", "force", "independence"]'::jsonb,
    'source_logic', 'Gate interpretation. Final reading depends on center, channel, line, planet activation, side personality/design and whole chart context.',
    'pro_not_self', 'Not-Self: compulsive doing to prove potency, disconnected from correct response.'
  ),
  jsonb_build_object(
    'primary_context', '["center", "channel", "activation", "line"]'::jsonb,
    'secondary_context', '["type", "strategy", "authority", "profile", "definition"]'::jsonb,
    'depends_on', 'Gate meaning must be adjusted by center, channel completion, planet activation, line and whole chart mechanics.',
    'related_element_kinds', '["activation", "channel", "defined_center", "open_center", "type", "strategy", "authority", "profile"]'::jsonb,
    'context_note', 'Standalone gate reference is only a semantic building block. It is not a final personality conclusion.'
  ),
  jsonb_build_object(
    'base', 'В искажении человек работает без остановки, пока не сталкивается с резким истощением.',
    'pro', 'Distortion: uncontrolled Sacral discharge mistaken for aligned power.',
    'warning_signals', '["невозможность замедлиться даже вечером", "раздражение на любые задержки", "качели между рывком и упадком сил"]'::jsonb,
    'recovery_conditions', '["вернуть приоритет отклика перед действием", "убрать лишние параллельные задачи", "жестко закрепить время отдыха"]'::jsonb
  ),
  jsonb_build_array(
    jsonb_build_object(
      'contrast_context', 'Gate 34 observed without full channel completion context.',
      'how_it_would_read', 'May read as generic productivity trait.',
      'why_current_context_is_different', 'Mechanics reveal if power is aligned force or non-stop compensatory activity.'
    )
  ),
  'draft'
),

-- GATE 35: Change
(
  'gate', '35', 'Ворота 35', 'ru', 'v1',
  'Gate 35 — Change (Progress): стремление к новому опыту, движению и обновлению маршрута.',
  'Человеку важно развивать процессы через реальные эксперименты: он оживляет застой и помогает команде двигаться дальше.',
  'Gate 35 in Throat Center — experiential progression voice; seeks change through lived narratives.',
  '["инициирование обновлений", "быстрое освоение нового опыта", "умение переводить опыт в практические шаги"]'::jsonb,
  '["погоня за новизной без закрепления", "скука в стабильных циклах", "поверхностные эксперименты ради эффекта"]'::jsonb,
  '["фиксировать цель каждого изменения", "проводить ретро после эксперимента", "балансировать новизну и стабильность"]'::jsonb,
  '["культура пилотов", "безопасное пространство для тестов", "команда, открытая к итерациям"]'::jsonb,
  '["сложнее в сверхрегламентированной среде"]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Базовая тема — тянуть систему к развитию через новый практический опыт.',
    'work_manifestation', 'В работе это дает импульс к изменениям, проверке гипотез и ускорению обучения команды.',
    'strengths', 'Адаптивность, живой интерес к развитию, смелость пробовать непривычное.',
    'risks', 'Можно начинать слишком много нового и не доводить улучшения до устойчивого стандарта.',
    'when_it_works_best', 'Лучше работает, когда эксперименты имеют критерии успеха и этап закрепления результата.',
    'when_talent_is_not_revealed', 'Снижается, если любые изменения блокируются или, наоборот, происходят без дисциплины и выводов.'
  ),
  jsonb_build_object(
    'hd_meaning', 'Gate 35 speaks the language of progress through collected experience.',
    'mechanics', 'Throat expression seeks movement; in emotional circuitry, timing of disclosure matters greatly.',
    'classical_keywords', '["change", "progress", "experience", "variety"]'::jsonb,
    'source_logic', 'Gate interpretation. Final reading depends on center, channel, line, planet activation, side personality/design and whole chart context.',
    'pro_not_self', 'Not-Self: restlessness and experience-chasing to avoid inner dissatisfaction.'
  ),
  jsonb_build_object(
    'primary_context', '["center", "channel", "activation", "line"]'::jsonb,
    'secondary_context', '["type", "strategy", "authority", "profile", "definition"]'::jsonb,
    'depends_on', 'Gate meaning must be adjusted by center, channel completion, planet activation, line and whole chart mechanics.',
    'related_element_kinds', '["activation", "channel", "defined_center", "open_center", "type", "strategy", "authority", "profile"]'::jsonb,
    'context_note', 'Standalone gate reference is only a semantic building block. It is not a final personality conclusion.'
  ),
  jsonb_build_object(
    'base', 'В искажении человек меняет курс ради ощущения движения, а не ради пользы.',
    'pro', 'Distorted Gate 35 produces novelty addiction without integration.',
    'warning_signals', '["частые развороты приоритетов", "утомление команды от непрерывных новшеств", "незавершенные инициативы"]'::jsonb,
    'recovery_conditions', '["сократить число одновременных экспериментов", "доводить каждый цикл до измеримого итога", "закреплять удачные практики в стандарте"]'::jsonb
  ),
  jsonb_build_array(
    jsonb_build_object(
      'contrast_context', 'Gate 35 considered outside complete experiential channel mechanics.',
      'how_it_would_read', 'Can appear as extroverted curiosity only.',
      'why_current_context_is_different', 'Context shows whether change drive serves maturation or escapes emotional discomfort.'
    )
  ),
  'draft'
),

-- GATE 36: Crisis
(
  'gate', '36', 'Ворота 36', 'ru', 'v1',
  'Gate 36 — Crisis (Darkening of the Light): прохождение эмоциональных кризисов и трансформаций в турбулентности.',
  'Человек может сохранять рабочую собранность в нестабильных фазах и помогать другим пройти напряженный переходный период.',
  'Gate 36 in Solar Plexus Center — emotional crisis gate; intensity before experiential maturation.',
  '["устойчивость в неопределенности", "смелость в сложных разговорах", "способность вести через переход"]'::jsonb,
  '["драматизация событий", "импульсивные решения на пике эмоций", "переутомление от постоянной кризисной роли"]'::jsonb,
  '["вводить протоколы действий на кризис", "разделять факты и эмоциональные реакции", "назначать время на восстановление после пиков"]'::jsonb,
  '["психологически безопасная коммуникация", "четкие роли в кризисе", "доступ к поддержке после интенсивных этапов"]'::jsonb,
  '["трудно в среде, где проблемы замалчиваются"]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Суть — умение проходить периоды нестабильности и превращать их в точку роста.',
    'work_manifestation', 'В рабочем контексте это дает способность удерживать фокус и действовать, когда вокруг много напряжения.',
    'strengths', 'Антикризисная устойчивость, эмоциональная смелость, готовность брать ответственность в трудный момент.',
    'risks', 'Есть риск жить в режиме постоянной тревоги и принимать решения слишком резко.',
    'when_it_works_best', 'Раскрывается при ясном плане действий, поддержке команды и уважении к границам нагрузки.',
    'when_talent_is_not_revealed', 'Слабеет, когда напряжение игнорируется, а люди остаются без структуры и опоры.'
  ),
  jsonb_build_object(
    'hd_meaning', 'Gate 36 carries the emotional turbulence that precedes experiential wisdom.',
    'mechanics', 'Wave-driven intensification seeks transformation; channel resonance defines expression depth.',
    'classical_keywords', '["crisis", "emotions", "transition", "darkening"]'::jsonb,
    'source_logic', 'Gate interpretation. Final reading depends on center, channel, line, planet activation, side personality/design and whole chart context.',
    'pro_not_self', 'Not-Self: creating unnecessary crises to feel intensity and significance.'
  ),
  jsonb_build_object(
    'primary_context', '["center", "channel", "activation", "line"]'::jsonb,
    'secondary_context', '["type", "strategy", "authority", "profile", "definition"]'::jsonb,
    'depends_on', 'Gate meaning must be adjusted by center, channel completion, planet activation, line and whole chart mechanics.',
    'related_element_kinds', '["activation", "channel", "defined_center", "open_center", "type", "strategy", "authority", "profile"]'::jsonb,
    'context_note', 'Standalone gate reference is only a semantic building block. It is not a final personality conclusion.'
  ),
  jsonb_build_object(
    'base', 'В искажении человек реагирует на трудности как на личную катастрофу и теряет управляемость.',
    'pro', 'Distorted Gate 36 loops emotional escalation instead of metabolizing experience.',
    'warning_signals', '["обострение конфликтов из мелких поводов", "частое ощущение «все рушится»", "истощение после каждого напряженного эпизода"]'::jsonb,
    'recovery_conditions', '["вернуть опору на пошаговый план", "перенести решение с пика эмоций на более спокойный момент", "включить восстановительный режим после кризиса"]'::jsonb
  ),
  jsonb_build_array(
    jsonb_build_object(
      'contrast_context', 'Gate 36 interpreted outside full emotional stream context.',
      'how_it_would_read', 'Could look like situational impulsivity.',
      'why_current_context_is_different', 'Mechanics clarify whether crisis energy is transformative catalyst or unmanaged emotional wave.'
    )
  ),
  'draft'
),

-- GATE 37: Friendship
(
  'gate', '37', 'Ворота 37', 'ru', 'v1',
  'Gate 37 — Friendship (The Family): союз, общинность, договоренности и взаимная поддержка.',
  'Человек естественно строит теплые рабочие связи, держит атмосферу сотрудничества и помогает оформлять справедливые договоренности.',
  'Gate 37 in Solar Plexus Center — tribal bonding, family values, and covenant energy.',
  '["укрепление командного доверия", "лояльность в партнерстве", "умение договариваться о взаимной поддержке"]'::jsonb,
  '["смешение личного и рабочего", "чрезмерная зависимость от одобрения группы", "избегание жестких решений ради мира"]'::jsonb,
  '["формализовывать договоренности письменно", "проговаривать ожидания сторон", "разделять эмпатию и обязательства"]'::jsonb,
  '["культура взаимоуважения", "ритуалы командной сплоченности", "прозрачные правила взаимодействия"]'::jsonb,
  '["сложно в среде циничной конкуренции"]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Ключевая способность — создавать устойчивые человеческие связи и поддерживать чувство общности.',
    'work_manifestation', 'В делах это проявляется как забота о командном климате и ясных взаимных обязательствах.',
    'strengths', 'Теплота, дипломатичность, умение объединять людей вокруг общих правил.',
    'risks', 'Можно жертвовать объективностью ради сохранения хороших отношений.',
    'when_it_works_best', 'Лучше раскрывается, когда доверие подкреплено прозрачными договоренностями и ответственностью.',
    'when_talent_is_not_revealed', 'Ослабевает в атмосфере, где партнерство подменяется скрытой борьбой за влияние.'
  ),
  jsonb_build_object(
    'hd_meaning', 'Gate 37 sustains tribal emotional contracts and family-style cohesion.',
    'mechanics', 'Solar wave bonds the tribe; channel dynamics define distribution of support and duty.',
    'classical_keywords', '["friendship", "family", "bonds", "community"]'::jsonb,
    'source_logic', 'Gate interpretation. Final reading depends on center, channel, line, planet activation, side personality/design and whole chart context.',
    'pro_not_self', 'Not-Self: people-pleasing loyalty that suppresses truth to avoid disconnection.'
  ),
  jsonb_build_object(
    'primary_context', '["center", "channel", "activation", "line"]'::jsonb,
    'secondary_context', '["type", "strategy", "authority", "profile", "definition"]'::jsonb,
    'depends_on', 'Gate meaning must be adjusted by center, channel completion, planet activation, line and whole chart mechanics.',
    'related_element_kinds', '["activation", "channel", "defined_center", "open_center", "type", "strategy", "authority", "profile"]'::jsonb,
    'context_note', 'Standalone gate reference is only a semantic building block. It is not a final personality conclusion.'
  ),
  jsonb_build_object(
    'base', 'В искажении человек соглашается на неудобные условия, лишь бы не потерять принадлежность.',
    'pro', 'Distorted Gate 37 binds through guilt and emotional debt instead of clean agreements.',
    'warning_signals', '["страх прямого разговора о границах", "накопление скрытых обид", "перегруженность чужими ожиданиями"]'::jsonb,
    'recovery_conditions', '["пересмотреть условия сотрудничества", "называть потребности без обвинений", "укреплять отношения через ясные взаимные обязательства"]'::jsonb
  ),
  jsonb_build_array(
    jsonb_build_object(
      'contrast_context', 'Gate 37 analyzed apart from full tribal channel context.',
      'how_it_would_read', 'May read as sociability trait only.',
      'why_current_context_is_different', 'Mechanical context distinguishes emotional bonding from contractual tribal cohesion.'
    )
  ),
  'draft'
),

-- GATE 38: Fighter
(
  'gate', '38', 'Ворота 38', 'ru', 'v1',
  'Gate 38 — Fighter (Opposition): борьба за принцип, сопротивление бессмысленному давлению, поиск достойной цели.',
  'Человек не боится идти в конфронтацию, если видит, что поставлен на кону важный смысл или базовая справедливость.',
  'Gate 38 in Root Center — pressure to fight for purpose; opposition mechanics with Gate 28.',
  '["стойкость под давлением", "принципиальность в сложных решениях", "умение защищать важное"]'::jsonb,
  '["конфликт ради конфликта", "жесткость в переговорах", "истощение от постоянного сопротивления"]'::jsonb,
  '["определять, за что действительно стоит бороться", "выбирать формат конфронтации осознанно", "завершать спор после достижения цели"]'::jsonb,
  '["среда, где ценят прямоту", "четкие правила разрешения споров", "пространство для отстаивания позиции"]'::jsonb,
  '["неподходяще там, где требуется постоянная дипломатическая мягкость"]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Главная тема — защищать значимые принципы даже под внешним давлением.',
    'work_manifestation', 'В работе это дает готовность выдерживать сопротивление и не отступать, когда на кону важный результат.',
    'strengths', 'Смелость, внутренний стержень, умение держать позицию в трудной ситуации.',
    'risks', 'Можно излишне заострять противоречия и тратить силы на второстепенные битвы.',
    'when_it_works_best', 'Раскрывается, когда борьба направлена на конкретный ценный итог, а не на самоутверждение.',
    'when_talent_is_not_revealed', 'Слабеет, если энергия уходит в постоянное противостояние без измеримой пользы.'
  ),
  jsonb_build_object(
    'hd_meaning', 'Gate 38 drives existential opposition and purposeful combat under Root pressure.',
    'mechanics', 'Adrenal pressure seeks meaningful resistance; with Gate 28 forms purpose-through-struggle polarity.',
    'classical_keywords', '["fighter", "opposition", "purpose", "struggle"]'::jsonb,
    'source_logic', 'Gate interpretation. Final reading depends on center, channel, line, planet activation, side personality/design and whole chart context.',
    'pro_not_self', 'Not-Self: compulsive opposition to avoid inner emptiness.'
  ),
  jsonb_build_object(
    'primary_context', '["center", "channel", "activation", "line"]'::jsonb,
    'secondary_context', '["type", "strategy", "authority", "profile", "definition"]'::jsonb,
    'depends_on', 'Gate meaning must be adjusted by center, channel completion, planet activation, line and whole chart mechanics.',
    'related_element_kinds', '["activation", "channel", "defined_center", "open_center", "type", "strategy", "authority", "profile"]'::jsonb,
    'context_note', 'Standalone gate reference is only a semantic building block. It is not a final personality conclusion.'
  ),
  jsonb_build_object(
    'base', 'В искажении человек спорит по инерции и перестает различать важное и второстепенное.',
    'pro', 'Distorted Gate 38 weaponizes pressure, replacing purpose with perpetual antagonism.',
    'warning_signals', '["частые жесткие столкновения с коллегами", "сильная раздражительность без явной причины", "усталость от ощущения постоянной войны"]'::jsonb,
    'recovery_conditions', '["сузить поле борьбы до ключевых вопросов", "переводить конфликт в предметный диалог", "восстанавливать ресурс после напряженных этапов"]'::jsonb
  ),
  jsonb_build_array(
    jsonb_build_object(
      'contrast_context', 'Gate 38 viewed without full 28-38 purpose dynamics.',
      'how_it_would_read', 'Could seem like stubborn temperament.',
      'why_current_context_is_different', 'Context reveals whether opposition protects meaning or masks unprocessed pressure.'
    )
  ),
  'draft'
),

-- GATE 39: Provocateur
(
  'gate', '39', 'Ворота 39', 'ru', 'v1',
  'Gate 39 — Provocateur (Provocation): давление-провокация для пробуждения духа и подлинной реакции.',
  'Человек умеет выводить скрытое на поверхность: задает неудобные вопросы и провоцирует честный контакт с реальностью.',
  'Gate 39 in Root Center — provocative pressure aimed at awakening spirit response.',
  '["точная провокация к росту", "умение вскрывать самообман", "энергия оживления команды"]'::jsonb,
  '["провокация без цели", "эмоциональное задевание людей", "напряженный фон в коммуникации"]'::jsonb,
  '["объяснять намерение провокации", "выбирать безопасный формат обратной связи", "останавливать давление после получения ответа"]'::jsonb,
  '["культура зрелого диалога", "пространство для несогласия", "команда, готовая к честным разговорам"]'::jsonb,
  '["трудно в среде, где любое напряжение табуировано"]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Базовый дар — запускать честную реакцию и будить внутреннюю энергию через точный вызов.',
    'work_manifestation', 'В рабочем процессе это помогает разрушать формальность и возвращать людям живую включенность в задачу.',
    'strengths', 'Смелость говорить неудобное, острый социальный радар, способность встряхнуть застой.',
    'risks', 'Можно переусердствовать и создавать лишнее напряжение вместо полезного импульса.',
    'when_it_works_best', 'Лучше проявляется, когда провокация направлена на развитие, а не на личную разрядку.',
    'when_talent_is_not_revealed', 'Ослабевает, если давление становится бессистемным и разрушает доверие в команде.'
  ),
  jsonb_build_object(
    'hd_meaning', 'Gate 39 applies Root pressure to trigger spirit expression and emotional honesty.',
    'mechanics', 'Provocation is a mechanic of awakening; channel context determines constructive or disruptive output.',
    'classical_keywords', '["provocation", "spirit", "pressure", "awakening"]'::jsonb,
    'source_logic', 'Gate interpretation. Final reading depends on center, channel, line, planet activation, side personality/design and whole chart context.',
    'pro_not_self', 'Not-Self: provoking to discharge pressure, not to serve truth or growth.'
  ),
  jsonb_build_object(
    'primary_context', '["center", "channel", "activation", "line"]'::jsonb,
    'secondary_context', '["type", "strategy", "authority", "profile", "definition"]'::jsonb,
    'depends_on', 'Gate meaning must be adjusted by center, channel completion, planet activation, line and whole chart mechanics.',
    'related_element_kinds', '["activation", "channel", "defined_center", "open_center", "type", "strategy", "authority", "profile"]'::jsonb,
    'context_note', 'Standalone gate reference is only a semantic building block. It is not a final personality conclusion.'
  ),
  jsonb_build_object(
    'base', 'В искажении человек задевает других просто чтобы почувствовать контроль над ситуацией.',
    'pro', 'Distorted Gate 39 misuses provocation as reactive pressure venting.',
    'warning_signals', '["саркастичный стиль общения", "эскалация мелких споров", "ощущение одиночества после конфликтов"]'::jsonb,
    'recovery_conditions', '["проверять цель каждого острого комментария", "формулировать вызов через заботу о результате", "снижать давление паузой перед ответом"]'::jsonb
  ),
  jsonb_build_array(
    jsonb_build_object(
      'contrast_context', 'Gate 39 considered without complete spirit channel resonance.',
      'how_it_would_read', 'May appear as mere rebelliousness.',
      'why_current_context_is_different', 'Full context shows whether provocation awakens authenticity or perpetuates tension loops.'
    )
  ),
  'draft'
),

-- GATE 40: Aloneness
(
  'gate', '40', 'Ворота 40', 'ru', 'v1',
  'Gate 40 — Aloneness (Deliverance): воля к труду, ответственность за результат и потребность в уединенном восстановлении.',
  'Человек надежно выполняет обещанное и особенно продуктивен, когда может чередовать периоды интенсивной работы и спокойного одиночества.',
  'Gate 40 in Heart/Ego Center — willpower labor and tribal delivery requiring periodic withdrawal.',
  '["личная надежность", "сильная трудовая дисциплина", "умение автономно закрывать задачи"]'::jsonb,
  '["работа до истощения", "закрытость после перегруза", "жесткий контроль вместо делегирования"]'::jsonb,
  '["фиксировать объем обязательств заранее", "планировать обязательные паузы восстановления", "уважать потребность в одиночной работе"]'::jsonb,
  '["прозрачный контракт по роли", "возможность работать автономно", "культура уважения к личному времени"]'::jsonb,
  '["сложно в режиме бесконечных синхронизаций без тишины"]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Ключевая тема — держать слово в работе и восстанавливаться через личное пространство.',
    'work_manifestation', 'На практике это проявляется как высокий уровень ответственности и качество исполнения в самостоятельных задачах.',
    'strengths', 'Надежность, самоорганизация, умение доводить до финального результата.',
    'risks', 'Есть риск перегружаться, замыкаться и терять эмоциональный контакт после интенсивной фазы.',
    'when_it_works_best', 'Лучше раскрывается при честных договоренностях по нагрузке и праве на восстановление.',
    'when_talent_is_not_revealed', 'Снижается, когда человека постоянно дергают и не дают завершать работу в собственном ритме.'
  ),
  jsonb_build_object(
    'hd_meaning', 'Gate 40 represents Ego labor contract and cyclical retreat from tribal demand.',
    'mechanics', 'Willpower commits, then must rest; channeling with Gate 37 structures support/obligation exchange.',
    'classical_keywords', '["aloneness", "will", "deliverance", "work"]'::jsonb,
    'source_logic', 'Gate interpretation. Final reading depends on center, channel, line, planet activation, side personality/design and whole chart context.',
    'pro_not_self', 'Not-Self: proving worth through overwork while rejecting needed restoration.'
  ),
  jsonb_build_object(
    'primary_context', '["center", "channel", "activation", "line"]'::jsonb,
    'secondary_context', '["type", "strategy", "authority", "profile", "definition"]'::jsonb,
    'depends_on', 'Gate meaning must be adjusted by center, channel completion, planet activation, line and whole chart mechanics.',
    'related_element_kinds', '["activation", "channel", "defined_center", "open_center", "type", "strategy", "authority", "profile"]'::jsonb,
    'context_note', 'Standalone gate reference is only a semantic building block. It is not a final personality conclusion.'
  ),
  jsonb_build_object(
    'base', 'В искажении человек берет все на себя и отрезает себя от поддержки.',
    'pro', 'Distorted Gate 40 over-identifies with duty and turns rest into guilt.',
    'warning_signals', '["резкое истощение после рабочих рывков", "сухость в коммуникации", "трудность просить помощь"]'::jsonb,
    'recovery_conditions', '["пересобрать баланс труда и отдыха", "согласовать реальные границы доступности", "возвращать поддержку через партнерские договоренности"]'::jsonb
  ),
  jsonb_build_array(
    jsonb_build_object(
      'contrast_context', 'Gate 40 isolated from full tribal exchange channel context.',
      'how_it_would_read', 'Could look like simple introverted work ethic.',
      'why_current_context_is_different', 'Mechanics define the labor-rest covenant and its role in collective reliability.'
    )
  ),
  'draft'
),

-- GATE 41: Fantasy
(
  'gate', '41', 'Ворота 41', 'ru', 'v1',
  'Gate 41 — Fantasy (Decrease): воображение, старт нового цикла и внутренняя «затравка» опыта.',
  'Человек приносит образ будущего, который запускает новый этап: идея сначала рождается как мечта, а затем становится маршрутом.',
  'Gate 41 in Root Center — pressure to begin experiential cycles through imagination.',
  '["создание вдохновляющих образов будущего", "инициация новых циклов", "умение задавать направление через сценарий"]'::jsonb,
  '["уход в фантазии без реализации", "нетерпеливый старт без подготовки", "разочарование при первом препятствии"]'::jsonb,
  '["переводить видение в конкретный первый шаг", "проверять реалистичность ресурсов", "поддерживать дисциплину цикла после запуска"]'::jsonb,
  '["среда, где ценят творческое мышление", "пространство для прототипирования", "команда, готовая превращать идеи в действия"]'::jsonb,
  '["снижается в рутине без пространства для нового"]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Основной дар — видеть возможность нового этапа и зажигать интерес к его запуску.',
    'work_manifestation', 'В работе это проявляется как способность предложить образ результата и начать движение к нему.',
    'strengths', 'Креативность, инициатива, умение формировать привлекательный вектор развития.',
    'risks', 'Можно увлечься картинкой будущего и недооценить объем практической подготовки.',
    'when_it_works_best', 'Лучше раскрывается, когда вдохновение быстро переводится в реалистичный план первого шага.',
    'when_talent_is_not_revealed', 'Ослабевает, если идеи не получают поддержки в реализации или тонут в бесконечных обсуждениях.'
  ),
  jsonb_build_object(
    'hd_meaning', 'Gate 41 is the codon of beginning in abstract experiential circuitry.',
    'mechanics', 'Root pressure contracts possibility into a seed fantasy that starts emotional experience streams.',
    'classical_keywords', '["fantasy", "imagination", "beginning", "cycle"]'::jsonb,
    'source_logic', 'Gate interpretation. Final reading depends on center, channel, line, planet activation, side personality/design and whole chart context.',
    'pro_not_self', 'Not-Self: chasing imagined futures while avoiding present commitments.'
  ),
  jsonb_build_object(
    'primary_context', '["center", "channel", "activation", "line"]'::jsonb,
    'secondary_context', '["type", "strategy", "authority", "profile", "definition"]'::jsonb,
    'depends_on', 'Gate meaning must be adjusted by center, channel completion, planet activation, line and whole chart mechanics.',
    'related_element_kinds', '["activation", "channel", "defined_center", "open_center", "type", "strategy", "authority", "profile"]'::jsonb,
    'context_note', 'Standalone gate reference is only a semantic building block. It is not a final personality conclusion.'
  ),
  jsonb_build_object(
    'base', 'В искажении человек постоянно мечтает о новом старте, но не закрепляет ни один путь.',
    'pro', 'Distorted Gate 41 loops desire projections without embodied cycle entry.',
    'warning_signals', '["частая смена вдохновляющих идей", "мало завершенных запусков", "разрыв между обещаниями и действиями"]'::jsonb,
    'recovery_conditions', '["выбрать один приоритетный сценарий", "зафиксировать минимальный практический шаг", "держать ритм выполнения до первого результата"]'::jsonb
  ),
  jsonb_build_array(
    jsonb_build_object(
      'contrast_context', 'Gate 41 read outside full abstract-emotional cycle context.',
      'how_it_would_read', 'Can look like daydreaming tendency.',
      'why_current_context_is_different', 'Mechanics determine whether fantasy is a true cycle seed or escapist projection.'
    )
  ),
  'draft'
),

-- GATE 42: Growth
(
  'gate', '42', 'Ворота 42', 'ru', 'v1',
  'Gate 42 — Growth (Increase): рост через завершение циклов и созревание опыта.',
  'Человек хорошо доводит этапы до финала, собирает уроки и превращает завершение в основу для следующего уровня.',
  'Gate 42 in Sacral Center — increase through completion; maturation in abstract cycle streams.',
  '["сильное чувство завершения", "терпение на длинной дистанции", "умение капитализировать опыт"]'::jsonb,
  '["затягивание финала из перфекционизма", "усталость к концу цикла", "нежелание отпускать завершенное"]'::jsonb,
  '["определять критерии готовности заранее", "планировать завершающий ресурс", "фиксировать извлеченные уроки после финиша"]'::jsonb,
  '["культура завершения, а не вечного старта", "видимые вехи прогресса", "возможность подвести итоги цикла"]'::jsonb,
  '["слабее в хаосе с постоянными незавершенками"]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Ключевая способность — доводить начатое до завершения и получать из этого реальный рост.',
    'work_manifestation', 'В работе это выражается в устойчивом закрытии задач и превращении опыта в более зрелую практику.',
    'strengths', 'Последовательность, обучаемость на практике, зрелое отношение к финальному этапу.',
    'risks', 'Можно перегружать конец цикла лишними правками и терять момент своевременного завершения.',
    'when_it_works_best', 'Раскрывается, когда есть ясная точка финиша и процедура передачи результатов дальше.',
    'when_talent_is_not_revealed', 'Снижается, если циклы регулярно обрываются до финала и выводы не фиксируются.'
  ),
  jsonb_build_object(
    'hd_meaning', 'Gate 42 drives expansion by completing abstract experiential processes.',
    'mechanics', 'Sacral force sustains through arc completion; resonance with Gate 53 frames full cycle growth.',
    'classical_keywords', '["growth", "increase", "completion", "cycles"]'::jsonb,
    'source_logic', 'Gate interpretation. Final reading depends on center, channel, line, planet activation, side personality/design and whole chart context.',
    'pro_not_self', 'Not-Self: clinging to familiar cycles out of fear of closure.'
  ),
  jsonb_build_object(
    'primary_context', '["center", "channel", "activation", "line"]'::jsonb,
    'secondary_context', '["type", "strategy", "authority", "profile", "definition"]'::jsonb,
    'depends_on', 'Gate meaning must be adjusted by center, channel completion, planet activation, line and whole chart mechanics.',
    'related_element_kinds', '["activation", "channel", "defined_center", "open_center", "type", "strategy", "authority", "profile"]'::jsonb,
    'context_note', 'Standalone gate reference is only a semantic building block. It is not a final personality conclusion.'
  ),
  jsonb_build_object(
    'base', 'В искажении человек бесконечно дорабатывает уже готовое и не позволяет циклу закрыться.',
    'pro', 'Distorted Gate 42 converts maturation pressure into completion anxiety.',
    'warning_signals', '["хвосты задач на финальной стадии", "сложность поставить точку", "напряжение перед передачей результата"]'::jsonb,
    'recovery_conditions', '["объявить объективный критерий «достаточно хорошо»", "закрывать этапы по календарю", "делать короткий итоговый разбор сразу после завершения"]'::jsonb
  ),
  jsonb_build_array(
    jsonb_build_object(
      'contrast_context', 'Gate 42 interpreted without complete 53-42 cycle mechanics.',
      'how_it_would_read', 'May read as generic diligence and persistence.',
      'why_current_context_is_different', 'Full context reveals whether completion feeds growth trajectory or supports repetitive loops.'
    )
  ),
  'draft'
),

-- GATE 43: Insight
(
  'gate', '43', 'Ворота 43', 'ru', 'v1',
  'Gate 43 — Insight (Breakthrough): прорывное ментальное знание и нестандартное видение решения.',
  'Человек способен внезапно увидеть ясный ответ там, где другие пока видят тупик, и предложить новый ход мысли.',
  'Gate 43 in Ajna Center — individual breakthrough knowing; mutative insight dynamics.',
  '["оригинальные интеллектуальные решения", "быстрое распознавание нестандартных связей", "смелость мыслить вне привычной схемы"]'::jsonb,
  '["слишком ранняя подача идеи", "ощущение непонятости", "жесткость в защите инсайта"]'::jsonb,
  '["проверять готовность аудитории к новой идее", "давать примеры для приземления инсайта", "сохранять пространство для вопросов и уточнений"]'::jsonb,
  '["культура интеллектуального эксперимента", "уважение к нестандартному мышлению", "время на проработку сложных концепций"]'::jsonb,
  '["сложно в среде, где ценится только привычное"]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Главный ресурс — видеть неожиданные решения и предлагать новый взгляд на проблему.',
    'work_manifestation', 'В задачах это проявляется как интеллектуальные прорывы, которые меняют подход к работе команды.',
    'strengths', 'Независимость мышления, глубина анализа, способность открывать новые траектории.',
    'risks', 'Можно сталкиваться с непониманием и торопиться с выводами без достаточного объяснения контекста.',
    'when_it_works_best', 'Лучше раскрывается, когда идее дают время созреть и формат для ясной передачи.',
    'when_talent_is_not_revealed', 'Снижается, если нестандартные мысли обесцениваются до проверки их практической полезности.'
  ),
  jsonb_build_object(
    'hd_meaning', 'Gate 43 carries individual inner knowing that precedes collective comprehension.',
    'mechanics', 'Insight emerges discontinuously; expression quality depends on timing and communication bridge.',
    'classical_keywords', '["insight", "breakthrough", "ajna", "mutation"]'::jsonb,
    'source_logic', 'Gate interpretation. Final reading depends on center, channel, line, planet activation, side personality/design and whole chart context.',
    'pro_not_self', 'Not-Self: forcing breakthrough statements to prove uniqueness.'
  ),
  jsonb_build_object(
    'primary_context', '["center", "channel", "activation", "line"]'::jsonb,
    'secondary_context', '["type", "strategy", "authority", "profile", "definition"]'::jsonb,
    'depends_on', 'Gate meaning must be adjusted by center, channel completion, planet activation, line and whole chart mechanics.',
    'related_element_kinds', '["activation", "channel", "defined_center", "open_center", "type", "strategy", "authority", "profile"]'::jsonb,
    'context_note', 'Standalone gate reference is only a semantic building block. It is not a final personality conclusion.'
  ),
  jsonb_build_object(
    'base', 'В искажении человек выдает сырой инсайт как окончательную истину и закрывается от диалога.',
    'pro', 'Distorted Gate 43 confuses mutative flashes with universally valid conclusions.',
    'warning_signals', '["частые конфликты вокруг формулировок", "чувство изоляции в обсуждениях", "раздражение при уточняющих вопросах"]'::jsonb,
    'recovery_conditions', '["проверять гипотезу на малом масштабе", "добавлять примеры и структуру объяснения", "давать идее время перед публичной подачей"]'::jsonb
  ),
  jsonb_build_array(
    jsonb_build_object(
      'contrast_context', 'Gate 43 analyzed without full individual expression channel context.',
      'how_it_would_read', 'Could appear as eccentric opinion pattern.',
      'why_current_context_is_different', 'Mechanics distinguish true mutative insight from reactive contrarian thought.'
    )
  ),
  'draft'
),

-- GATE 44: Alertness
(
  'gate', '44', 'Ворота 44', 'ru', 'v1',
  'Gate 44 — Alertness (Coming to Meet): распознавание паттернов, память на прошлый опыт и инстинкт настороженности.',
  'Человек быстро считывает повторяющиеся сигналы поведения людей и процессов, заранее замечая, где может быть выгода или риск.',
  'Gate 44 in Spleen Center — pattern-recognition instinct and memory of past interactions.',
  '["быстрое распознавание рабочих паттернов", "раннее предупреждение рисков", "точная оценка надежности партнерств"]'::jsonb,
  '["подозрительность без фактов", "застревание в старых сценариях", "поспешные выводы по первому сигналу"]'::jsonb,
  '["сопоставлять интуицию с данными", "обновлять картину паттернов регулярно", "проверять гипотезы перед решением"]'::jsonb,
  '["доступ к истории взаимодействий", "культура анализа сигналов", "возможность обсуждать риски заранее"]'::jsonb,
  '["сложнее в среде с полной непрозрачностью данных"]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Суть — замечать повторяющиеся модели и использовать прошлый опыт для более точных решений.',
    'work_manifestation', 'В работе это дает способность предвидеть развитие ситуации и заранее корректировать курс команды.',
    'strengths', 'Наблюдательность, оперативное предупреждение, практичная осторожность в выборе партнерств.',
    'risks', 'Можно чрезмерно опираться на прошлый опыт и недооценивать новые обстоятельства.',
    'when_it_works_best', 'Лучше раскрывается, когда интуитивные сигналы проверяются фактами и не игнорируются командой.',
    'when_talent_is_not_revealed', 'Снижается, если предупреждения не слышат, а анализ подменяется хаотичными реакциями.'
  ),
  jsonb_build_object(
    'hd_meaning', 'Gate 44 stores splenic memory and detects recurring tribal/relational pattern signatures.',
    'mechanics', 'Instinct references past imprinting; in Channel 26-44 it supports strategic transmission.',
    'classical_keywords', '["alertness", "patterns", "memory", "instinct"]'::jsonb,
    'source_logic', 'Gate interpretation. Final reading depends on center, channel, line, planet activation, side personality/design and whole chart context.',
    'pro_not_self', 'Not-Self: fear-based suspicion and overgeneralization from old failures.'
  ),
  jsonb_build_object(
    'primary_context', '["center", "channel", "activation", "line"]'::jsonb,
    'secondary_context', '["type", "strategy", "authority", "profile", "definition"]'::jsonb,
    'depends_on', 'Gate meaning must be adjusted by center, channel completion, planet activation, line and whole chart mechanics.',
    'related_element_kinds', '["activation", "channel", "defined_center", "open_center", "type", "strategy", "authority", "profile"]'::jsonb,
    'context_note', 'Standalone gate reference is only a semantic building block. It is not a final personality conclusion.'
  ),
  jsonb_build_object(
    'base', 'В искажении человек видит угрозу почти в каждом повторе и теряет объективность.',
    'pro', 'Distorted Gate 44 amplifies defensive pattern bias over present-moment discernment.',
    'warning_signals', '["избыточная настороженность в партнерствах", "частые ошибочные «красные флаги»", "сложность доверять после прошлых сбоев"]'::jsonb,
    'recovery_conditions', '["разделять факт, интерпретацию и эмоцию", "проводить верификацию сигналов вторым мнением", "обновлять оценку по текущим данным"]'::jsonb
  ),
  jsonb_build_array(
    jsonb_build_object(
      'contrast_context', 'Gate 44 viewed without full 26-44 tribal transmission context.',
      'how_it_would_read', 'May look like cautious personality trait.',
      'why_current_context_is_different', 'Complete mechanics reveal whether pattern memory serves strategic foresight or defensive looping.'
    )
  ),
  'draft'
),

-- GATE 45: Gatherer
(
  'gate', '45', 'Ворота 45', 'ru', 'v1',
  'Gate 45 — Gatherer (Gathering Together): сбор материальных ресурсов, управление доступом и распределением.',
  'Человек естественно берет на себя роль координатора ресурсов: понимает, что есть в распоряжении команды и как этим распорядиться справедливо.',
  'Gate 45 in Throat Center — material rulership voice, gathering and distributing tribal resources.',
  '["системное распределение ресурсов", "умение обозначать приоритеты доступа", "координация общего материального потока"]'::jsonb,
  '["излишняя централизация контроля", "жесткий тон в вопросах владения", "конфликты из-за непрозрачного распределения"]'::jsonb,
  '["делать правила распределения публичными", "привязывать доступ к четким критериям", "регулярно ревизовать справедливость баланса"]'::jsonb,
  '["понятная структура полномочий", "прозрачный учет ресурсов", "культура ответственности за общее имущество"]'::jsonb,
  '["снижается эффективность при полном отсутствии управленческого контура"]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Ключевой дар — собирать ресурсы и направлять их туда, где они дают наибольший эффект для общего дела.',
    'work_manifestation', 'В рабочей среде это проявляется как организация доступа, приоритизация потребностей и контроль целевого использования.',
    'strengths', 'Стратегичность в управлении, ясность распоряжений, способность держать материальную устойчивость команды.',
    'risks', 'Можно уйти в избыточный контроль и создать напряжение вокруг распределения.',
    'when_it_works_best', 'Лучше раскрывается при прозрачных правилах, подотчетности и понятной логике принятия решений.',
    'when_talent_is_not_revealed', 'Ослабевает, когда ресурсы распределяются хаотично или по неочевидным личным предпочтениям.'
  ),
  jsonb_build_object(
    'hd_meaning', 'Gate 45 is the Throat voice of rulership: gathering, possession, and distribution.',
    'mechanics', 'Tribal material management requires recognized authority; channel context defines stewardship quality.',
    'classical_keywords', '["gatherer", "resources", "distribution", "authority"]'::jsonb,
    'source_logic', 'Gate interpretation. Final reading depends on center, channel, line, planet activation, side personality/design and whole chart context.',
    'pro_not_self', 'Not-Self: controlling access to resources to secure status and dominance.'
  ),
  jsonb_build_object(
    'primary_context', '["center", "channel", "activation", "line"]'::jsonb,
    'secondary_context', '["type", "strategy", "authority", "profile", "definition"]'::jsonb,
    'depends_on', 'Gate meaning must be adjusted by center, channel completion, planet activation, line and whole chart mechanics.',
    'related_element_kinds', '["activation", "channel", "defined_center", "open_center", "type", "strategy", "authority", "profile"]'::jsonb,
    'context_note', 'Standalone gate reference is only a semantic building block. It is not a final personality conclusion.'
  ),
  jsonb_build_object(
    'base', 'В искажении человек удерживает ресурсы ради власти, а не ради общего результата.',
    'pro', 'Distorted Gate 45 turns stewardship into territorial command behavior.',
    'warning_signals', '["частые споры о справедливости распределения", "напряжение при запросе доступа", "недоверие к мотивам управленческих решений"]'::jsonb,
    'recovery_conditions', '["ввести открытый регламент распределения", "разделить контроль и подотчетность между ролями", "привязывать решения к измеримой пользе для команды"]'::jsonb
  ),
  jsonb_build_array(
    jsonb_build_object(
      'contrast_context', 'Gate 45 considered without full tribal voice-to-resource circuitry.',
      'how_it_would_read', 'Could be interpreted as managerial assertiveness only.',
      'why_current_context_is_different', 'Mechanics determine whether authority serves collective provisioning or egoic control.'
    )
  ),
  'draft'
),

-- GATE 46: Determination
(
  'gate', '46', 'Ворота 46', 'ru', 'v1',
  'Gate 46 — Determination: embodiment, serendipity и любовь к телесной жизни, ведущие к правильному месту и времени.',
  'Человек лучше раскрывается, когда действует не из теорий, а через живое присутствие в деле. Он словно чувствует, где стоит быть физически: в нужной команде, на нужной задаче, в подходящий момент.',
  'Gate 46 in G Center — embodiment and serendipity. Correct direction unfolds through body intelligence and being in the right place.',
  '["практичная включенность", "чувство своевременности", "умение находить удачные возможности"]'::jsonb,
  '["уход в пассивное ожидание удачи", "игнор сигналов усталости", "импульсивные развороты без проверки"]'::jsonb,
  '["давать задачи с реальным действием, а не только обсуждениями", "учитывать ритм нагрузки тела", "позволять проверять гипотезы через практику"]'::jsonb,
  '["динамичная рабочая среда", "доступ к полю и людям", "пространство для тестов на месте"]'::jsonb,
  '["проседает в роли чистого теоретика без практики"]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Сила проявляется через участие в реальных действиях и внимание к телесным ощущениям.',
    'work_manifestation', 'В работе это видно как точный выбор момента и места для шага, который приносит результат.',
    'strengths', 'Практичность, живой контакт с происходящим, хорошее чувство времени.',
    'risks', 'Переутомление при перегрузе, надежда на случай вместо подготовки, скачки курса.',
    'when_it_works_best', 'Лучше всего работает там, где можно проверять решения на практике и быстро получать обратную связь.',
    'when_talent_is_not_revealed', 'Труднее раскрывается в изоляции от реальных задач и при длительном отрыве от действий.'
  ),
  jsonb_build_object(
    'hd_meaning', 'Gate 46 — Love of the Body, Determination through embodiment.',
    'mechanics', 'In HD mechanics, Gate 46 aligns direction via embodied correctness; line, activation and channel context refine expression.',
    'classical_keywords', '["determination", "embodiment", "serendipity", "body love"]'::jsonb,
    'source_logic', 'Gate interpretation. Final reading depends on center, channel, line, planet activation, side personality/design and whole chart context.',
    'pro_not_self', 'Not-Self pattern: chasing ''luck'' mentally while ignoring embodied correctness.'
  ),
  jsonb_build_object(
    'primary_context', '["center", "channel", "activation", "line"]'::jsonb,
    'secondary_context', '["type", "strategy", "authority", "profile", "definition"]'::jsonb,
    'depends_on', 'Gate meaning must be adjusted by center, channel completion, planet activation, line and whole chart mechanics.',
    'related_element_kinds', '["activation", "channel", "defined_center", "open_center", "type", "strategy", "authority", "profile"]'::jsonb,
    'context_note', 'Standalone gate reference is only a semantic building block. It is not a final personality conclusion.'
  ),
  jsonb_build_object(
    'base', 'В искажении человек метается между вариантами, не чувствуя, где ему реально подходит быть.',
    'pro', 'Distortion of Gate 46: detached from embodiment, seeking direction through mind pressure.',
    'warning_signals', '["хроническая усталость от неправильного темпа", "ощущение, что везде ''не на своем месте''", "частые сожаления о сделанных шагах"]'::jsonb,
    'recovery_conditions', '["вернуться к простому практическому шагу", "восстановить режим сна и нагрузки", "перепроверить решение через опыт, а не через догадки"]'::jsonb
  ),
  jsonb_build_array(
    jsonb_build_object(
      'contrast_context', 'Gate 46 активирован без устойчивой связки и при слабой телесной включенности.',
      'how_it_would_read', 'В таком контексте это выглядит как эпизодическое везение, а не как стабильная стратегия.',
      'why_current_context_is_different', 'При корректной механике воплощения тема становится повторяемым способом находить верное направление.'
    )
  ),
  'draft'
),

-- GATE 47: Realizing
(
  'gate', '47', 'Ворота 47', 'ru', 'v1',
  'Gate 47 — Realizing: oppression в уме, который перерабатывает давление в осознание и ментальное прозрение.',
  'Сильная сторона — превращать путаницу мыслей в ясный смысл. Сначала может быть внутреннее давление и тяжесть, но затем рождается понятное объяснение, которое помогает другим.',
  'Gate 47 in Ajna — mental oppression transformed into realization. Pressure resolves through structured insight.',
  '["смысловая сборка сложного", "терпение к неясности", "способность формулировать вывод"]'::jsonb,
  '["застревание в мрачных интерпретациях", "самокритика до паралича", "ранние выводы без проверки"]'::jsonb,
  '["разбивать задачу на этапы осмысления", "фиксировать промежуточные гипотезы", "давать время на переработку информации"]'::jsonb,
  '["спокойная аналитическая среда", "доступ к качественным данным", "культура проверки гипотез"]'::jsonb,
  '["сложнее в потоке постоянных переключений"]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Умеет превращать внутреннее давление от сложной информации в полезное понимание.',
    'work_manifestation', 'В работе это проявляется как способность собрать разбросанные факты в ясную концепцию.',
    'strengths', 'Глубина анализа, выдержка, точная формулировка смысла.',
    'risks', 'Перегруз от мыслей, склонность к негативному чтению ситуации, усталость от неопределенности.',
    'when_it_works_best', 'Раскрывается, когда есть время на осмысление и возможность сверить выводы с фактами.',
    'when_talent_is_not_revealed', 'Снижается под давлением срочных ответов и при информационном шуме.'
  ),
  jsonb_build_object(
    'hd_meaning', 'Gate 47 — realization through transforming mental pressure.',
    'mechanics', 'Ajna processing pressure from Head stream; insight quality depends on timing, line and full circuit context.',
    'classical_keywords', '["realizing", "oppression", "mental", "clarity"]'::jsonb,
    'source_logic', 'Gate interpretation. Final reading depends on center, channel, line, planet activation, side personality/design and whole chart context.',
    'pro_not_self', 'Not-Self: interpreting pressure as personal failure instead of process toward realization.'
  ),
  jsonb_build_object(
    'primary_context', '["center", "channel", "activation", "line"]'::jsonb,
    'secondary_context', '["type", "strategy", "authority", "profile", "definition"]'::jsonb,
    'depends_on', 'Gate meaning must be adjusted by center, channel completion, planet activation, line and whole chart mechanics.',
    'related_element_kinds', '["activation", "channel", "defined_center", "open_center", "type", "strategy", "authority", "profile"]'::jsonb,
    'context_note', 'Standalone gate reference is only a semantic building block. It is not a final personality conclusion.'
  ),
  jsonb_build_object(
    'base', 'В искажении человек тонет в мыслях и видит больше тупиков, чем вариантов.',
    'pro', 'Distorted Gate 47 loops in oppression without completing realization.',
    'warning_signals', '["ощущение ментального тупика", "повтор одних и тех же мыслей", "пессимистичные трактовки без данных"]'::jsonb,
    'recovery_conditions', '["вынести мысли в структурные заметки", "сверить выводы с фактами", "сократить входящий шум на время фокуса"]'::jsonb
  ),
  jsonb_build_array(
    jsonb_build_object(
      'contrast_context', 'Gate 47 проявлена под сильным внешним давлением сроков.',
      'how_it_would_read', 'Это может читаться как тревожность, а не как ресурс глубокого осмысления.',
      'why_current_context_is_different', 'В корректном контексте то же давление становится топливом для зрелой ментальной ясности.'
    )
  ),
  'draft'
),

-- GATE 48: Depth
(
  'gate', '48', 'Ворота 48', 'ru', 'v1',
  'Gate 48 — Depth: the Well, глубина и поиск практичных решений из компетентности.',
  'Человек стремится понять суть вопроса, а не закрыть его поверхностно. Он полезен там, где нужно докопаться до причины и предложить рабочее решение, которое выдерживает проверку.',
  'Gate 48 in Spleen — the Well of depth. Instinctive concern for adequacy drives practical solutions.',
  '["профессиональная глубина", "точное диагностирование причин", "решения с запасом надежности"]'::jsonb,
  '["страх ''недостаточности'' и перфекционизм", "затягивание из-за допроверок", "резкость к поверхностным подходам"]'::jsonb,
  '["выделять время на исследование корня проблемы", "оценивать качество, а не скорость любой ценой", "поручать сложные участки с высокой ценой ошибки"]'::jsonb,
  '["культура мастерства", "доступ к экспертам и знаниям", "уважение к тщательности"]'::jsonb,
  '["теряет форму в среде, где важен только быстрый эффект"]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Ориентирован на глубокое понимание и качественное решение сложных задач.',
    'work_manifestation', 'На практике находит корневые причины и предлагает меры, которые работают не только сегодня.',
    'strengths', 'Надежность решений, профессиональная точность, устойчивость к поверхностным выводам.',
    'risks', 'Избыточная самокритика, затяжные проверки, напряжение от недоработок вокруг.',
    'when_it_works_best', 'Лучше всего проявляется в задачах, где критично качество и долгосрочная работоспособность.',
    'when_talent_is_not_revealed', 'Слабеет, когда нет времени на анализ и требуется только быстрый внешний результат.'
  ),
  jsonb_build_object(
    'hd_meaning', 'Gate 48 — The Well: depth and instinctive intelligence for solutions.',
    'mechanics', 'Spleen awareness stream grounds depth in immediate pattern recognition; channel context determines delivery style.',
    'classical_keywords', '["depth", "the well", "solutions", "adequacy"]'::jsonb,
    'source_logic', 'Gate interpretation. Final reading depends on center, channel, line, planet activation, side personality/design and whole chart context.',
    'pro_not_self', 'Not-Self: fear of inadequacy blocks contribution despite real depth.'
  ),
  jsonb_build_object(
    'primary_context', '["center", "channel", "activation", "line"]'::jsonb,
    'secondary_context', '["type", "strategy", "authority", "profile", "definition"]'::jsonb,
    'depends_on', 'Gate meaning must be adjusted by center, channel completion, planet activation, line and whole chart mechanics.',
    'related_element_kinds', '["activation", "channel", "defined_center", "open_center", "type", "strategy", "authority", "profile"]'::jsonb,
    'context_note', 'Standalone gate reference is only a semantic building block. It is not a final personality conclusion.'
  ),
  jsonb_build_object(
    'base', 'В искажении человек или замолкает из-за сомнений, или критикует всё без конструктивного выхода.',
    'pro', 'Distorted Gate 48 oscillates between underconfidence and defensive overanalysis.',
    'warning_signals', '["чувство ''я недостаточно готов''", "бесконечная доработка без выпуска", "резкая критика чужих черновиков"]'::jsonb,
    'recovery_conditions', '["выделить минимально достаточный стандарт", "сделать версию решения и проверить в деле", "получить обратную связь от практиков"]'::jsonb
  ),
  jsonb_build_array(
    jsonb_build_object(
      'contrast_context', 'Gate 48 включена в проекте с низкой ценой ошибки.',
      'how_it_would_read', 'Здесь глубина может выглядеть как излишняя тщательность.',
      'why_current_context_is_different', 'В критичных задачах та же тщательность становится источником безопасности и качества.'
    )
  ),
  'draft'
),

-- GATE 49: Principles
(
  'gate', '49', 'Ворота 49', 'ru', 'v1',
  'Gate 49 — Principles: revolution of principles, чувствительность к нарушению ценностей и смена правил.',
  'Сильная тема — верность принципам в партнерствах и командах. Если договор становится несправедливым, человек инициирует пересмотр условий и способен запустить важные перемены.',
  'Gate 49 in Solar Plexus — principles and emotional revolution. Sensitivity tests the integrity of bonds and agreements.',
  '["ценностная ясность", "смелость пересобирать договоренности", "чуткость к скрытой несправедливости"]'::jsonb,
  '["резкие разрывы в аффекте", "категоричность в споре", "перенос личной боли в рабочие решения"]'::jsonb,
  '["фиксировать правила взаимодействия заранее", "проводить регулярный пересмотр договоренностей", "разделять эмоцию момента и итоговое решение"]'::jsonb,
  '["прозрачные договоры", "культура уважительных границ", "безопасное поле для сложных разговоров"]'::jsonb,
  '["сложно в среде двойных стандартов", "высокая чувствительность к нечестным правилам"]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Ориентирован на честные правила и устойчивые соглашения между людьми.',
    'work_manifestation', 'В работе поднимает вопрос пересмотра норм, если они перестают быть справедливыми и рабочими.',
    'strengths', 'Верность принципам, смелость в реформе, способность защищать уязвимые стороны.',
    'risks', 'Жесткие реакции в напряжении, поляризация позиций, импульсивные разрывы сотрудничества.',
    'when_it_works_best', 'Лучше раскрывается, когда правила прозрачны и есть процедура их цивилизованного изменения.',
    'when_talent_is_not_revealed', 'Снижается в культуре недоговоренностей, где неудобные темы замалчиваются.'
  ),
  jsonb_build_object(
    'hd_meaning', 'Gate 49 — Principles with potential for emotional revolution.',
    'mechanics', 'Solar Plexus wave colors judgment of agreements; correct timing is essential before decisive change.',
    'classical_keywords', '["principles", "revolution", "sensitivity", "values"]'::jsonb,
    'source_logic', 'Gate interpretation. Final reading depends on center, channel, line, planet activation, side personality/design and whole chart context.',
    'pro_not_self', 'Not-Self: breaking bonds reactively from wave peaks instead of principled clarity.'
  ),
  jsonb_build_object(
    'primary_context', '["center", "channel", "activation", "line"]'::jsonb,
    'secondary_context', '["type", "strategy", "authority", "profile", "definition"]'::jsonb,
    'depends_on', 'Gate meaning must be adjusted by center, channel completion, planet activation, line and whole chart mechanics.',
    'related_element_kinds', '["activation", "channel", "defined_center", "open_center", "type", "strategy", "authority", "profile"]'::jsonb,
    'context_note', 'Standalone gate reference is only a semantic building block. It is not a final personality conclusion.'
  ),
  jsonb_build_object(
    'base', 'В искажении человек борется не за суть, а против людей, обостряя конфликт.',
    'pro', 'Distorted Gate 49 confuses emotional intensity with true principled action.',
    'warning_signals', '["жесткие ультиматумы", "частые ''точки невозврата'' в диалогах", "послевкусие сожаления после решений"]'::jsonb,
    'recovery_conditions', '["взять паузу до стабилизации эмоций", "переформулировать требования в конкретные условия", "подключить нейтрального фасилитатора"]'::jsonb
  ),
  jsonb_build_array(
    jsonb_build_object(
      'contrast_context', 'Gate 49 проявлена в момент коллективного кризиса доверия.',
      'how_it_would_read', 'Реакция может выглядеть как избыточная резкость.',
      'why_current_context_is_different', 'Но в широком контексте именно эта реакция запускает пересборку правил и оздоровление системы.'
    )
  ),
  'draft'
),

-- GATE 50: Values
(
  'gate', '50', 'Ворота 50', 'ru', 'v1',
  'Gate 50 — Values: the Cauldron, ценности, законы и ответственная защита целостности сообщества.',
  'Человек естественно держит рамку качества и ответственности. Он замечает, когда правила перестают защищать людей и результат, и старается вернуть работающие нормы.',
  'Gate 50 in Spleen — values and custodianship. The Cauldron preserves viable laws for collective continuity.',
  '["этика практических решений", "поддержка надежных стандартов", "ответственное лидерство в нормах"]'::jsonb,
  '["морализаторский тон", "жесткость к ошибкам новичков", "перегруз чужой ответственностью"]'::jsonb,
  '["ясно описывать стандарты и последствия", "разделять роли ответственности", "поощрять обучение вместо стыда за промах"]'::jsonb,
  '["культура надежности", "прозрачные правила качества", "уважение к роли хранителя стандартов"]'::jsonb,
  '["сложно в хаосе без договоренностей"]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Склонен поддерживать устойчивые нормы, которые защищают людей и общее дело.',
    'work_manifestation', 'В задачах задает понятные правила качества и следит, чтобы они работали на практике.',
    'strengths', 'Надежность, зрелое чувство ответственности, внимание к долгосрочной устойчивости.',
    'risks', 'Чрезмерная строгость, обвинительный стиль, перегруз контролем.',
    'when_it_works_best', 'Сильнее всего проявляется в командах, где ценят порядок, безопасность и последовательность.',
    'when_talent_is_not_revealed', 'Тускнеет в среде, где нормы меняются стихийно и никто не держит рамку.'
  ),
  jsonb_build_object(
    'hd_meaning', 'Gate 50 — Values, the Cauldron of tribal laws.',
    'mechanics', 'Spleenic awareness protects what sustains the tribe; expression depends on network dynamics and timing.',
    'classical_keywords', '["values", "cauldron", "laws", "responsibility"]'::jsonb,
    'source_logic', 'Gate interpretation. Final reading depends on center, channel, line, planet activation, side personality/design and whole chart context.',
    'pro_not_self', 'Not-Self: enforcing rules from fear, not from living values.'
  ),
  jsonb_build_object(
    'primary_context', '["center", "channel", "activation", "line"]'::jsonb,
    'secondary_context', '["type", "strategy", "authority", "profile", "definition"]'::jsonb,
    'depends_on', 'Gate meaning must be adjusted by center, channel completion, planet activation, line and whole chart mechanics.',
    'related_element_kinds', '["activation", "channel", "defined_center", "open_center", "type", "strategy", "authority", "profile"]'::jsonb,
    'context_note', 'Standalone gate reference is only a semantic building block. It is not a final personality conclusion.'
  ),
  jsonb_build_object(
    'base', 'В искажении человек либо всех контролирует, либо отказывается от ответственности совсем.',
    'pro', 'Distorted Gate 50 alternates between rigid judgment and value collapse.',
    'warning_signals', '["частые претензии к людям", "чувство, что ''все держится только на мне''", "выгорание от постоянного надзора"]'::jsonb,
    'recovery_conditions', '["пересобрать стандарты в короткий рабочий набор", "делегировать ответственность по ролям", "добавить цикл регулярного обучения"]'::jsonb
  ),
  jsonb_build_array(
    jsonb_build_object(
      'contrast_context', 'Gate 50 в молодой команде без устоявшихся норм.',
      'how_it_would_read', 'Может восприниматься как избыточная требовательность.',
      'why_current_context_is_different', 'Со временем именно эта требовательность формирует базовую надежность и культуру качества.'
    )
  ),
  'draft'
),

-- GATE 51: Shock
(
  'gate', '51', 'Ворота 51', 'ru', 'v1',
  'Gate 51 — Shock: the Arousing, конкурентный импульс и пробуждение через неожиданный толчок.',
  'Тема проявляется как смелость входить туда, где другие медлят. Человек способен встряхнуть систему и запустить движение, особенно когда нужен прорыв из инерции.',
  'Gate 51 in Heart Center — shock initiation and competitive spirit. Awakening happens through impact events.',
  '["смелый старт в критический момент", "мобилизация команды из застоя", "волевой импульс к действию"]'::jsonb,
  '["действие ради адреналина", "излишняя конкуренция", "травмирующая резкость коммуникации"]'::jsonb,
  '["оговаривать рамки допустимого давления", "направлять импульс в конкретный результат", "добавлять этап стабилизации после рывка"]'::jsonb,
  '["среда с высокой динамикой", "понятные правила соперничества", "поддержка после интенсивных фаз"]'::jsonb,
  '["плохо переносит затяжную бюрократическую стагнацию"]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Способен запускать движение резким, но своевременным действием.',
    'work_manifestation', 'В работе берет на себя роль инициатора в трудных моментах и помогает выйти из ступора.',
    'strengths', 'Храбрость, энергичный старт, готовность брать удар на себя.',
    'risks', 'Перегрев команды, конфликтность, решения на пике напряжения.',
    'when_it_works_best', 'Лучше работает там, где нужен старт после долгой паузы и есть ясная цель рывка.',
    'when_talent_is_not_revealed', 'Почти не проявляется в среде, где любое энергичное действие блокируется.'
  ),
  jsonb_build_object(
    'hd_meaning', 'Gate 51 — The Arousing: initiation through shock in Heart/Ego dynamics.',
    'mechanics', 'Ego-driven ignition can awaken spirit; correct context and timing prevent unnecessary disruption.',
    'classical_keywords', '["shock", "arousing", "competition", "initiation"]'::jsonb,
    'source_logic', 'Gate interpretation. Final reading depends on center, channel, line, planet activation, side personality/design and whole chart context.',
    'pro_not_self', 'Not-Self: provoking shock to prove worth rather than to serve the process.'
  ),
  jsonb_build_object(
    'primary_context', '["center", "channel", "activation", "line"]'::jsonb,
    'secondary_context', '["type", "strategy", "authority", "profile", "definition"]'::jsonb,
    'depends_on', 'Gate meaning must be adjusted by center, channel completion, planet activation, line and whole chart mechanics.',
    'related_element_kinds', '["activation", "channel", "defined_center", "open_center", "type", "strategy", "authority", "profile"]'::jsonb,
    'context_note', 'Standalone gate reference is only a semantic building block. It is not a final personality conclusion.'
  ),
  jsonb_build_object(
    'base', 'В искажении человек путает смелость с давлением и вредит отношениям.',
    'pro', 'Distorted Gate 51 seeks victory signals instead of authentic initiation.',
    'warning_signals', '["острые конфликты после рывков", "усталость команды от постоянной мобилизации", "чувство, что нужно всегда ''доказывать''"]'::jsonb,
    'recovery_conditions', '["отделить цель от эго-реакции", "согласовать темп с командой", "восстановить доверие через прямой диалог"]'::jsonb
  ),
  jsonb_build_array(
    jsonb_build_object(
      'contrast_context', 'Gate 51 активирована в период высокой турбулентности.',
      'how_it_would_read', 'Поведение может выглядеть как избыточная резкость и соревновательность.',
      'why_current_context_is_different', 'Но в правильной задаче этот импульс становится точкой запуска зрелых изменений.'
    )
  ),
  'draft'
),

-- GATE 52: Stillness
(
  'gate', '52', 'Ворота 52', 'ru', 'v1',
  'Gate 52 — Stillness: keeping still, корневая неподвижность для концентрации внимания.',
  'Это способность не суетиться под давлением. Человек удерживает фокус на одной задаче и сохраняет внутреннюю неподвижность, пока работа не выйдет на нужную глубину.',
  'Gate 52 in Root — stillness and concentration. Root pressure is stabilized into sustained focus.',
  '["длительная концентрация", "спокойствие под давлением", "последовательная проработка"]'::jsonb,
  '["застой без решения", "уход в пассивность", "раздражение на внешнюю спешку"]'::jsonb,
  '["защищать блоки глубокой работы", "задавать критерии завершения фокуса", "снижать шум и переключения"]'::jsonb,
  '["тихое рабочее пространство", "понятные приоритеты", "культура уважения к фокусу"]'::jsonb,
  '["проседает в среде постоянных прерываний"]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Сила в умении сохранять внутреннюю неподвижность и не распыляться.',
    'work_manifestation', 'В работе это дает глубокое погружение в задачу и аккуратное доведение до качества.',
    'strengths', 'Собранность, устойчивое внимание, высокое качество проработки.',
    'risks', 'Промедление с решением, закрытость к обратной связи, утомление от перегрузки.',
    'when_it_works_best', 'Лучше проявляется в задачах, требующих длительного фокуса и точности.',
    'when_talent_is_not_revealed', 'Слабеет, когда рабочий день дробится на бесконечные срочные мелочи.'
  ),
  jsonb_build_object(
    'hd_meaning', 'Gate 52 — Keeping Still: concentration under Root pressure.',
    'mechanics', 'Root pressure can become still focus instead of restless movement when correctly directed.',
    'classical_keywords', '["stillness", "keeping still", "concentration", "focus"]'::jsonb,
    'source_logic', 'Gate interpretation. Final reading depends on center, channel, line, planet activation, side personality/design and whole chart context.',
    'pro_not_self', 'Not-Self: frozen tension masquerading as focus.'
  ),
  jsonb_build_object(
    'primary_context', '["center", "channel", "activation", "line"]'::jsonb,
    'secondary_context', '["type", "strategy", "authority", "profile", "definition"]'::jsonb,
    'depends_on', 'Gate meaning must be adjusted by center, channel completion, planet activation, line and whole chart mechanics.',
    'related_element_kinds', '["activation", "channel", "defined_center", "open_center", "type", "strategy", "authority", "profile"]'::jsonb,
    'context_note', 'Standalone gate reference is only a semantic building block. It is not a final personality conclusion.'
  ),
  jsonb_build_object(
    'base', 'В искажении человек или застывает, или резко срывается в хаотичную суету.',
    'pro', 'Distorted Gate 52 oscillates between paralysis and restless overcompensation.',
    'warning_signals', '["трудно начать после долгой подготовки", "скачки от замирания к авралу", "потеря ясности при переключениях"]'::jsonb,
    'recovery_conditions', '["сформулировать один главный фокус", "разбить задачу на видимые этапы", "вернуть ритм работы через короткие циклы"]'::jsonb
  ),
  jsonb_build_array(
    jsonb_build_object(
      'contrast_context', 'Gate 52 активирована в роли, где поощряется постоянная реактивность.',
      'how_it_would_read', 'Может ошибочно считываться как медлительность.',
      'why_current_context_is_different', 'При корректном применении это источник глубины и точности, а не замедление ради замедления.'
    )
  ),
  'draft'
),

-- GATE 53: Beginnings
(
  'gate', '53', 'Ворота 53', 'ru', 'v1',
  'Gate 53 — Beginnings: development through starting cycles, давление на старт нового цикла.',
  'Человек ощущает момент, когда пора начинать. Он хорошо запускает инициативы, формирует первый шаг и задает темп старта, если есть реалистичные рамки развития.',
  'Gate 53 in Root — pressure to begin developmental cycles. Proper starts require timing and support for completion.',
  '["инициация новых циклов", "быстрый старт без лишней инерции", "видение первой траектории развития"]'::jsonb,
  '["запуск слишком многих проектов", "недооценка ресурсов продолжения", "потеря интереса после старта"]'::jsonb,
  '["ограничивать число параллельных запусков", "сразу назначать владельца продолжения", "оценивать ресурсы на весь цикл"]'::jsonb,
  '["культура пилотов", "понятный процесс передачи в реализацию", "поддержка стадии масштабирования"]'::jsonb,
  '["слабее в монотонном сопровождении без новых стартов"]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Сильная сторона — запускать новый цикл и обозначать его рабочую стартовую рамку.',
    'work_manifestation', 'В задачах помогает команде перейти от идеи к первому реальному шагу.',
    'strengths', 'Энергия начала, живой темп, умение открыть новое направление.',
    'risks', 'Перезапуск без завершения, расфокус на множестве стартов, быстрый спад мотивации.',
    'when_it_works_best', 'Раскрывается там, где старт дополняется дисциплиной продолжения и понятной последовательностью.',
    'when_talent_is_not_revealed', 'Снижается, когда запуск есть, а системы поддержки цикла нет.'
  ),
  jsonb_build_object(
    'hd_meaning', 'Gate 53 — beginnings and developmental pressure in Root.',
    'mechanics', 'Root pulse initiates cycles; full developmental arc depends on mechanics beyond initial pressure.',
    'classical_keywords', '["beginnings", "development", "cycles", "start"]'::jsonb,
    'source_logic', 'Gate interpretation. Final reading depends on center, channel, line, planet activation, side personality/design and whole chart context.',
    'pro_not_self', 'Not-Self: compulsive starting without honoring lifecycle capacity.'
  ),
  jsonb_build_object(
    'primary_context', '["center", "channel", "activation", "line"]'::jsonb,
    'secondary_context', '["type", "strategy", "authority", "profile", "definition"]'::jsonb,
    'depends_on', 'Gate meaning must be adjusted by center, channel completion, planet activation, line and whole chart mechanics.',
    'related_element_kinds', '["activation", "channel", "defined_center", "open_center", "type", "strategy", "authority", "profile"]'::jsonb,
    'context_note', 'Standalone gate reference is only a semantic building block. It is not a final personality conclusion.'
  ),
  jsonb_build_object(
    'base', 'В искажении человек постоянно начинает заново и редко фиксирует устойчивый результат.',
    'pro', 'Distorted Gate 53 confuses initiation impulse with sustainable development.',
    'warning_signals', '["много начатых и мало завершенных задач", "частая смена приоритетов", "усталость команды от перезапусков"]'::jsonb,
    'recovery_conditions', '["закрыть лишние инициативы", "договориться о критериях завершения цикла", "оставить один главный старт на период"]'::jsonb
  ),
  jsonb_build_array(
    jsonb_build_object(
      'contrast_context', 'Gate 53 проявляется в команде без зрелых процессов продолжения.',
      'how_it_would_read', 'Это может выглядеть как хаотичная инициативность.',
      'why_current_context_is_different', 'При выстроенном цикле та же энергия становится мотором осмысленного роста.'
    )
  ),
  'draft'
),

-- GATE 54: Ambition
(
  'gate', '54', 'Ворота 54', 'ru', 'v1',
  'Gate 54 — Ambition: marrying maiden, социальная амбиция и трансформация через восхождение.',
  'Здесь много стремления к росту статуса и влияния через результат. Человек умеет строить траекторию продвижения, объединяя личную цель с пользой для системы.',
  'Gate 54 in Root — ambition and transformation. Drive seeks elevation through alliances and material progression.',
  '["долгий вектор карьерного роста", "умение строить полезные союзы", "высокая мотивация к результату"]'::jsonb,
  '["цель любой ценой", "сделки без внутреннего согласия", "переоценка статуса над смыслом"]'::jsonb,
  '["связывать амбицию с прозрачными критериями ценности", "проверять этичность партнерств", "добавлять метрики долгосрочной устойчивости"]'::jsonb,
  '["среда с понятными карьерными треками", "культура наставничества", "прозрачные правила продвижения"]'::jsonb,
  '["трудно в системе, где рост зависит от неясных договоренностей"]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Сильный внутренний импульс к росту и повышению уровня ответственности.',
    'work_manifestation', 'В работе превращает амбицию в план шагов, партнерств и измеримого результата.',
    'strengths', 'Настойчивость, стратегическое мышление, высокая трудовая отдача.',
    'risks', 'Перегиб в гонку за признанием, утрата баланса, ошибки выбора союзов.',
    'when_it_works_best', 'Лучше раскрывается, когда рост связан с реальной пользой команде и прозрачной этикой действий.',
    'when_talent_is_not_revealed', 'Снижается, когда система закрыта для честного развития и удерживает инициативу.'
  ),
  jsonb_build_object(
    'hd_meaning', 'Gate 54 — ambition toward transformation and elevation.',
    'mechanics', 'Root pressure seeks upward movement; quality of transformation depends on integrity of alliances.',
    'classical_keywords', '["ambition", "transformation", "drive", "ascension"]'::jsonb,
    'source_logic', 'Gate interpretation. Final reading depends on center, channel, line, planet activation, side personality/design and whole chart context.',
    'pro_not_self', 'Not-Self: ambition hijacked by status anxiety and comparison loops.'
  ),
  jsonb_build_object(
    'primary_context', '["center", "channel", "activation", "line"]'::jsonb,
    'secondary_context', '["type", "strategy", "authority", "profile", "definition"]'::jsonb,
    'depends_on', 'Gate meaning must be adjusted by center, channel completion, planet activation, line and whole chart mechanics.',
    'related_element_kinds', '["activation", "channel", "defined_center", "open_center", "type", "strategy", "authority", "profile"]'::jsonb,
    'context_note', 'Standalone gate reference is only a semantic building block. It is not a final personality conclusion.'
  ),
  jsonb_build_object(
    'base', 'В искажении человек живет в сравнении и теряет контакт с реальной ценностью своей работы.',
    'pro', 'Distorted Gate 54 overdrives ambition while disconnecting from authentic purpose.',
    'warning_signals', '["навязчивая конкуренция", "усталость от постоянной гонки", "сделки, после которых остается внутренний конфликт"]'::jsonb,
    'recovery_conditions', '["вернуться к личным критериям успеха", "проверить партнерства на взаимную выгоду", "сбалансировать темп роста и восстановление"]'::jsonb
  ),
  jsonb_build_array(
    jsonb_build_object(
      'contrast_context', 'Gate 54 проявлена в среде с быстрыми карьерными изменениями.',
      'how_it_would_read', 'Внешне это может выглядеть как чрезмерная жесткость к себе и другим.',
      'why_current_context_is_different', 'В корректном контексте та же энергия дает устойчивую трансформацию и зрелое лидерство.'
    )
  ),
  'draft'
),

-- GATE 55: Spirit
(
  'gate', '55', 'Ворота 55', 'ru', 'v1',
  'Gate 55 — Spirit: abundance, эмоциональный дух и волны переживания, влияющие на качество выражения.',
  'Тема связана с внутренней наполненностью: в хорошем состоянии человек щедр, вдохновляющ и создает атмосферу живости. При спаде может резко терять тонус и интерес.',
  'Gate 55 in Solar Plexus — spirit and emotional abundance. Mood waves modulate creative and social expression.',
  '["эмоциональная глубина", "вдохновляющее присутствие", "умение оживлять пространство"]'::jsonb,
  '["качели настроения", "решения на пике эмоций", "закрытость при внутреннем спаде"]'::jsonb,
  '["не требовать одинаковой продуктивности на любой волне", "планировать важные решения после стабилизации", "разрешать паузы для восстановления ресурса"]'::jsonb,
  '["эмпатичная команда", "пространство для эмоциональной экологичности", "гибкий ритм в периодах спада"]'::jsonb,
  '["сложно в культуре, где эмоции считаются ''лишними''"]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Качество вклада сильно зависит от внутреннего эмоционального наполнения.',
    'work_manifestation', 'В работе это проявляется как умение заряжать людей и идеи, когда есть внутренний ресурс.',
    'strengths', 'Живость, харизма, способность придавать смысл и эмоциональный вес задачам.',
    'risks', 'Нестабильность темпа, резкие смены вовлеченности, трудность решений в острых состояниях.',
    'when_it_works_best', 'Лучше раскрывается в среде, где признают волнообразность состояния и строят гибкий ритм.',
    'when_talent_is_not_revealed', 'Снижается при постоянном давлении ''быть одинаковым'' независимо от внутреннего состояния.'
  ),
  jsonb_build_object(
    'hd_meaning', 'Gate 55 — Spirit and emotional abundance in Solar Plexus.',
    'mechanics', 'Emotional wave timing is central; correctness appears after clarity rather than in the wave peak.',
    'classical_keywords', '["spirit", "abundance", "emotional wave", "mood"]'::jsonb,
    'source_logic', 'Gate interpretation. Final reading depends on center, channel, line, planet activation, side personality/design and whole chart context.',
    'pro_not_self', 'Not-Self: defining truth by temporary mood states.'
  ),
  jsonb_build_object(
    'primary_context', '["center", "channel", "activation", "line"]'::jsonb,
    'secondary_context', '["type", "strategy", "authority", "profile", "definition"]'::jsonb,
    'depends_on', 'Gate meaning must be adjusted by center, channel completion, planet activation, line and whole chart mechanics.',
    'related_element_kinds', '["activation", "channel", "defined_center", "open_center", "type", "strategy", "authority", "profile"]'::jsonb,
    'context_note', 'Standalone gate reference is only a semantic building block. It is not a final personality conclusion.'
  ),
  jsonb_build_object(
    'base', 'В искажении человек то раздает обещания на подъеме, то исчезает на спаде.',
    'pro', 'Distorted Gate 55 identifies with the wave and loses stable orientation.',
    'warning_signals', '["эмоциональные обещания без ресурса", "откаты после периодов подъема", "ощущение бессмысленности в спаде"]'::jsonb,
    'recovery_conditions', '["перенести важные решения на ясное состояние", "снизить нагрузку в эмоциональной яме", "поддержать контакт с базовыми ритуалами устойчивости"]'::jsonb
  ),
  jsonb_build_array(
    jsonb_build_object(
      'contrast_context', 'Gate 55 проявляется в фазе сильной командной турбулентности.',
      'how_it_would_read', 'Это может считываться как непредсказуемость.',
      'why_current_context_is_different', 'Но при уважении к ритму волны возникает глубокий, вдохновляющий и зрелый вклад.'
    )
  ),
  'draft'
),

-- GATE 56: Stimulation
(
  'gate', '56', 'Ворота 56', 'ru', 'v1',
  'Gate 56 — Stimulation: the Wanderer, стимуляция через истории, опыт и смысловые связки.',
  'Сильная сторона — рассказывать так, чтобы люди понимали и чувствовали идею. Человек оживляет сухую информацию, связывает факты с примерами и вовлекает аудиторию.',
  'Gate 56 in Throat — stimulation via storytelling. The Wanderer translates experience into engaging narrative.',
  '["яркая подача смыслов", "связка опыта и теории", "вовлечение аудитории через истории"]'::jsonb,
  '["драматизация ради эффекта", "уход в развлечение без сути", "рассеивание фокуса на детали сюжета"]'::jsonb,
  '["задавать цель каждой коммуникации", "проверять фактичность примеров", "ограничивать формат, сохраняя живую подачу"]'::jsonb,
  '["публичные форматы обмена", "пространство для обучения через кейсы", "аудитория, открытая диалогу"]'::jsonb,
  '["слабее в полностью безличной и сухой коммуникации"]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Умеет передавать идеи через живой рассказ, делая их понятными и запоминающимися.',
    'work_manifestation', 'В работе превращает данные и опыт в историю, которая помогает команде действовать.',
    'strengths', 'Коммуникационная выразительность, образность, умение удерживать внимание.',
    'risks', 'Эффект важнее сути, увод в лишние детали, усталость от постоянной стимуляции.',
    'when_it_works_best', 'Лучше раскрывается там, где нужно обучать, объяснять и вдохновлять через примеры.',
    'when_talent_is_not_revealed', 'Снижается, когда коммуникация сведена к формальным шаблонам без живого контакта.'
  ),
  jsonb_build_object(
    'hd_meaning', 'Gate 56 — Stimulation through the voice of the Wanderer.',
    'mechanics', 'Throat expression channels experiential meaning; timing and audience receptivity shape impact.',
    'classical_keywords', '["stimulation", "wanderer", "storytelling", "experience"]'::jsonb,
    'source_logic', 'Gate interpretation. Final reading depends on center, channel, line, planet activation, side personality/design and whole chart context.',
    'pro_not_self', 'Not-Self: speaking for stimulation itself, not for meaningful transmission.'
  ),
  jsonb_build_object(
    'primary_context', '["center", "channel", "activation", "line"]'::jsonb,
    'secondary_context', '["type", "strategy", "authority", "profile", "definition"]'::jsonb,
    'depends_on', 'Gate meaning must be adjusted by center, channel completion, planet activation, line and whole chart mechanics.',
    'related_element_kinds', '["activation", "channel", "defined_center", "open_center", "type", "strategy", "authority", "profile"]'::jsonb,
    'context_note', 'Standalone gate reference is only a semantic building block. It is not a final personality conclusion.'
  ),
  jsonb_build_object(
    'base', 'В искажении человек говорит много, но после разговора мало что становится яснее.',
    'pro', 'Distorted Gate 56 chases attention spikes instead of coherent meaning.',
    'warning_signals', '["перегруженные выступления", "снижение точности в погоне за эффектом", "обратная связь ''интересно, но непонятно что делать''"]'::jsonb,
    'recovery_conditions', '["сформулировать один главный вывод", "сократить историю до нужных примеров", "добавить четкий следующий шаг для слушателя"]'::jsonb
  ),
  jsonb_build_array(
    jsonb_build_object(
      'contrast_context', 'Gate 56 проявляется в перегруженном инфополе.',
      'how_it_would_read', 'Может выглядеть как поверхностная болтливость.',
      'why_current_context_is_different', 'В корректном формате это становится мощным инструментом обучения и передачи смысла.'
    )
  ),
  'draft'
),

-- GATE 57: Intuitive Clarity
(
  'gate', '57', 'Ворота 57', 'ru', 'v1',
  'Gate 57 — Intuitive Clarity: gentle intuition in the now, тонкая ясность момента.',
  'Тема — тихое мгновенное знание о том, что безопасно и уместно сейчас. Человек часто замечает риск или верное действие раньше, чем это становится очевидно логически.',
  'Gate 57 in Spleen — intuitive clarity in the now. A subtle, immediate awareness of what is correct.',
  '["быстрая сенсорная оценка ситуации", "точное предупреждение рисков", "мягкая ориентировка в неопределенности"]'::jsonb,
  '["игнор собственных ранних сигналов", "тревожность при перегрузе", "переобъяснение интуитивных выводов"]'::jsonb,
  '["учитывать ранние предупреждения в оценке рисков", "создавать пространство для спокойной проверки ощущений", "не требовать мгновенного логического обоснования каждому сигналу"]'::jsonb,
  '["тихая рабочая атмосфера", "оперативная обратная связь", "культура внимательности к слабым сигналам"]'::jsonb,
  '["сложно проявляется в шумной и агрессивной среде"]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Сильная способность быстро считывать тонкие сигналы ситуации в настоящем моменте.',
    'work_manifestation', 'В работе это помогает заранее замечать риски и выбирать аккуратное действие без лишней суеты.',
    'strengths', 'Точность наблюдения, своевременные предупреждения, спокойная практичность.',
    'risks', 'Сомнение в себе, перегруз от шума, напряжение от постоянной настороженности.',
    'when_it_works_best', 'Лучше раскрывается там, где важны безопасность, качество решений и внимание к нюансам.',
    'when_talent_is_not_revealed', 'Снижается, когда темп и шум не оставляют места прислушаться к ранним сигналам.'
  ),
  jsonb_build_object(
    'hd_meaning', 'Gate 57 — intuitive clarity of the now in splenic awareness.',
    'mechanics', 'Spleen transmits instantaneous survival intelligence; correctness decays if delayed or over-mentalized.',
    'classical_keywords', '["intuition", "clarity", "now", "gentle"]'::jsonb,
    'source_logic', 'Gate interpretation. Final reading depends on center, channel, line, planet activation, side personality/design and whole chart context.',
    'pro_not_self', 'Not-Self: dismissing intuition until external proof arrives too late.'
  ),
  jsonb_build_object(
    'primary_context', '["center", "channel", "activation", "line"]'::jsonb,
    'secondary_context', '["type", "strategy", "authority", "profile", "definition"]'::jsonb,
    'depends_on', 'Gate meaning must be adjusted by center, channel completion, planet activation, line and whole chart mechanics.',
    'related_element_kinds', '["activation", "channel", "defined_center", "open_center", "type", "strategy", "authority", "profile"]'::jsonb,
    'context_note', 'Standalone gate reference is only a semantic building block. It is not a final personality conclusion.'
  ),
  jsonb_build_object(
    'base', 'В искажении человек не доверяет первым сигналам и регулярно реагирует с опозданием.',
    'pro', 'Distorted Gate 57 replaces immediate clarity with anxious mental loops.',
    'warning_signals', '["фраза ''я же чувствовал это заранее''", "повторяющиеся ошибки из-за поздней реакции", "избыточная тревожность при неопределенности"]'::jsonb,
    'recovery_conditions', '["фиксировать ранние сигналы письменно", "проверять их на малом безопасном шаге", "уменьшать информационный шум перед важными решениями"]'::jsonb
  ),
  jsonb_build_array(
    jsonb_build_object(
      'contrast_context', 'Gate 57 действует в команде с доминированием формальной аналитики.',
      'how_it_would_read', 'Может восприниматься как субъективность без доказательств.',
      'why_current_context_is_different', 'На практике эти ранние сигналы часто дают выигрыш во времени и предотвращают ошибки.'
    )
  ),
  'draft'
),

-- GATE 58: Vitality
(
  'gate', '58', 'Ворота 58', 'ru', 'v1',
  'Gate 58 — Vitality: joyous drive toward improvement, энергия радости и совершенствования.',
  'Человек оживает, когда видит, как систему можно сделать лучше. Он приносит конструктивный импульс улучшений, если цель ясна и изменения реально внедряются.',
  'Gate 58 in Root — vitality and joy of correction. Root pressure fuels iterative improvement.',
  '["энергия непрерывных улучшений", "видение точек роста качества", "позитивный импульс к оптимизации"]'::jsonb,
  '["перегиб в бесконечные правки", "недовольство ''достаточно хорошим'' результатом", "критика без учета ресурсов"]'::jsonb,
  '["определять приоритетные зоны улучшений", "фиксировать критерий ''достаточно хорошо''", "привязывать улучшения к бизнес-эффекту"]'::jsonb,
  '["культура итераций", "доступ к метрикам качества", "готовность команды внедрять изменения"]'::jsonb,
  '["сложно в среде, где нет права менять процесс"]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Много жизненной энергии направлено на поиск и реализацию улучшений.',
    'work_manifestation', 'В рабочем процессе это выражается как постоянное повышение качества через небольшие практичные шаги.',
    'strengths', 'Оптимизм, системное улучшение, высокая вовлеченность в результат.',
    'risks', 'Переутомление от перфекционизма, давление на других, фокус на правках вместо завершения.',
    'when_it_works_best', 'Лучше проявляется в командах, где ценят поэтапное улучшение и видимый прогресс.',
    'when_talent_is_not_revealed', 'Снижается там, где инициативы по улучшению игнорируются или блокируются.'
  ),
  jsonb_build_object(
    'hd_meaning', 'Gate 58 — joy-driven vitality for refinement.',
    'mechanics', 'Root pressure seeks expression through correction and optimization; proper pacing avoids burnout.',
    'classical_keywords', '["vitality", "joy", "improvement", "correction"]'::jsonb,
    'source_logic', 'Gate interpretation. Final reading depends on center, channel, line, planet activation, side personality/design and whole chart context.',
    'pro_not_self', 'Not-Self: compulsive fixing without honoring timing or capacity.'
  ),
  jsonb_build_object(
    'primary_context', '["center", "channel", "activation", "line"]'::jsonb,
    'secondary_context', '["type", "strategy", "authority", "profile", "definition"]'::jsonb,
    'depends_on', 'Gate meaning must be adjusted by center, channel completion, planet activation, line and whole chart mechanics.',
    'related_element_kinds', '["activation", "channel", "defined_center", "open_center", "type", "strategy", "authority", "profile"]'::jsonb,
    'context_note', 'Standalone gate reference is only a semantic building block. It is not a final personality conclusion.'
  ),
  jsonb_build_object(
    'base', 'В искажении человек видит только недостатки и теряет радость от уже достигнутого.',
    'pro', 'Distorted Gate 58 turns vitality into chronic dissatisfaction.',
    'warning_signals', '["постоянные замечания без паузы на закрепление", "усталость от улучшений ''без конца''", "раздражение, когда другие не поспевают"]'::jsonb,
    'recovery_conditions', '["выделить 1-2 главных улучшения на цикл", "отпраздновать достигнутый прогресс", "согласовать реальный темп внедрения"]'::jsonb
  ),
  jsonb_build_array(
    jsonb_build_object(
      'contrast_context', 'Gate 58 проявлена в проекте на этапе стабилизации.',
      'how_it_would_read', 'Может читаться как ненужная турбулентность после запуска.',
      'why_current_context_is_different', 'Однако в стабильной фазе именно точечные улучшения дают долговременный рост качества.'
    )
  ),
  'draft'
),

-- GATE 59: Sexuality
(
  'gate', '59', 'Ворота 59', 'ru', 'v1',
  'Gate 59 — Sexuality: dispersion of barriers, интимность и снятие дистанции для сближения.',
  'Тема о быстром создании близкого рабочего контакта. Человек умеет убирать лишние барьеры между людьми, помогая перейти от формальности к настоящему сотрудничеству.',
  'Gate 59 in Sacral — sexuality/intimacy, dispersing barriers for bonding and fertility of collaboration.',
  '["быстрое построение доверия", "теплая коммуникация без лишней дистанции", "синхронизация людей в партнерстве"]'::jsonb,
  '["размытые личные границы", "чрезмерная откровенность", "путаница ролей в близком контакте"]'::jsonb,
  '["согласовывать границы взаимодействия", "разделять личное и рабочие решения", "поддерживать прозрачность ожиданий в партнерстве"]'::jsonb,
  '["безопасная культура доверия", "понятные нормы общения", "пространство для честного диалога"]'::jsonb,
  '["сложнее в холодной формальной среде"]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Легко создает близкий контакт и снижает ненужную дистанцию между людьми.',
    'work_manifestation', 'В работе это помогает быстро формировать рабочие связи и запускать кооперацию.',
    'strengths', 'Теплота, контактность, способность объединять людей вокруг общей задачи.',
    'risks', 'Смещение границ, эмоциональные недопонимания, зависимость от качества отношений.',
    'when_it_works_best', 'Лучше раскрывается при ясных договоренностях о ролях и уважении личного пространства.',
    'when_talent_is_not_revealed', 'Снижается в среде недоверия, где любые попытки сближения трактуются как риск.'
  ),
  jsonb_build_object(
    'hd_meaning', 'Gate 59 — sexuality and intimacy in Sacral bonding mechanics.',
    'mechanics', 'Sacral life-force dissolves barriers for connection; quality depends on consent, timing and relational context.',
    'classical_keywords', '["sexuality", "dispersion", "intimacy", "barriers"]'::jsonb,
    'source_logic', 'Gate interpretation. Final reading depends on center, channel, line, planet activation, side personality/design and whole chart context.',
    'pro_not_self', 'Not-Self: forcing closeness to secure validation or control.'
  ),
  jsonb_build_object(
    'primary_context', '["center", "channel", "activation", "line"]'::jsonb,
    'secondary_context', '["type", "strategy", "authority", "profile", "definition"]'::jsonb,
    'depends_on', 'Gate meaning must be adjusted by center, channel completion, planet activation, line and whole chart mechanics.',
    'related_element_kinds', '["activation", "channel", "defined_center", "open_center", "type", "strategy", "authority", "profile"]'::jsonb,
    'context_note', 'Standalone gate reference is only a semantic building block. It is not a final personality conclusion.'
  ),
  jsonb_build_object(
    'base', 'В искажении человек либо вторгается в чужие границы, либо закрывается после неудачного сближения.',
    'pro', 'Distorted Gate 59 alternates between overexposure and withdrawal.',
    'warning_signals', '["частые недоразумения из-за неоговоренных границ", "эмоциональное выгорание от плотных контактов", "напряжение в партнерствах"]'::jsonb,
    'recovery_conditions', '["проговорить правила взаимодействия", "вернуть ясность ролей и ожиданий", "дозировать глубину контакта по готовности сторон"]'::jsonb
  ),
  jsonb_build_array(
    jsonb_build_object(
      'contrast_context', 'Gate 59 проявлена в новой межфункциональной команде.',
      'how_it_would_read', 'Может восприниматься как слишком быстрый темп сближения.',
      'why_current_context_is_different', 'При корректных границах именно эта скорость контакта ускоряет сотрудничество и результат.'
    )
  ),
  'draft'
),

-- GATE 60: Acceptance
(
  'gate', '60', 'Ворота 60', 'ru', 'v1',
  'Gate 60 — Acceptance: limitation and mutation, принятие ограничений как основа обновления.',
  'Сильная сторона — работать с реальностью такой, какая она есть, а не с идеальной картинкой. Человек умеет использовать ограничения как рамку для зрелых изменений.',
  'Gate 60 in Root — limitation accepted as the container for mutation and new form.',
  '["реализм в условиях ограничений", "дисциплина рамок", "запуск изменений из доступных ресурсов"]'::jsonb,
  '["излишний фатализм", "жесткость к альтернативам", "сужение горизонта из-за страха риска"]'::jsonb,
  '["фиксировать реальные ограничения заранее", "искать варианты внутри рамки, а не вопреки ей", "пересматривать рамку по мере роста ресурсов"]'::jsonb,
  '["прозрачные ресурсные лимиты", "зрелая культура приоритизации", "терпимость к постепенной эволюции"]'::jsonb,
  '["слабеет при хаотичном управлении ожиданиями"]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Умеет принимать рамки и превращать их в опору для развития.',
    'work_manifestation', 'В работе строит реалистичный план изменений, который учитывает ресурсы и ограничения.',
    'strengths', 'Трезвость, устойчивость, способность делать прогресс в непростых условиях.',
    'risks', 'Склонность к пессимизму, недоверие к новым вариантам, чрезмерная жесткость курса.',
    'when_it_works_best', 'Лучше раскрывается там, где цели амбициозны, но рамки ресурсов четко обозначены.',
    'when_talent_is_not_revealed', 'Снижается, когда ограничения скрываются, а от команды ждут невозможного.'
  ),
  jsonb_build_object(
    'hd_meaning', 'Gate 60 — acceptance of limitation as a precondition for mutation.',
    'mechanics', 'Root pressure mutates form only through correct constraints; channel context determines scale of change.',
    'classical_keywords', '["acceptance", "limitation", "mutation", "realism"]'::jsonb,
    'source_logic', 'Gate interpretation. Final reading depends on center, channel, line, planet activation, side personality/design and whole chart context.',
    'pro_not_self', 'Not-Self: resisting limits and burning energy against immutable conditions.'
  ),
  jsonb_build_object(
    'primary_context', '["center", "channel", "activation", "line"]'::jsonb,
    'secondary_context', '["type", "strategy", "authority", "profile", "definition"]'::jsonb,
    'depends_on', 'Gate meaning must be adjusted by center, channel completion, planet activation, line and whole chart mechanics.',
    'related_element_kinds', '["activation", "channel", "defined_center", "open_center", "type", "strategy", "authority", "profile"]'::jsonb,
    'context_note', 'Standalone gate reference is only a semantic building block. It is not a final personality conclusion.'
  ),
  jsonb_build_object(
    'base', 'В искажении человек либо воюет с фактом ограничений, либо сдается раньше времени.',
    'pro', 'Distorted Gate 60 swings between rebellion against limits and rigid resignation.',
    'warning_signals', '["планы без связи с ресурсами", "частые срывы сроков из-за нереалистичных ожиданий", "чувство бессилия перед рамками"]'::jsonb,
    'recovery_conditions', '["пересобрать задачу под доступные ресурсы", "определить минимально работающий шаг изменения", "обозначить, какие ограничения постоянны, а какие временные"]'::jsonb
  ),
  jsonb_build_array(
    jsonb_build_object(
      'contrast_context', 'Gate 60 активирована в период сокращения ресурсов.',
      'how_it_would_read', 'Может выглядеть как чрезмерная осторожность.',
      'why_current_context_is_different', 'В реальности это создает жизнеспособную стратегию, которая переживает кризис и ведет к обновлению.'
    )
  ),
  'draft'
),

-- GATE 61: Mystery
(
  'gate', '61', 'Ворота 61', 'ru', 'v1',
  'Gate 61 — Mystery: inner truth, давление на познание внутренней истины и тайны.',
  'Человек тянется к вопросам, на которые нет мгновенного ответа. Он способен долго удерживать исследовательский интерес и приносить глубокие инсайты, когда другие уже потеряли нить.',
  'Gate 61 in Head — pressure toward inner truth and mystery. Inspiration seeks conceptual revelation.',
  '["глубокая исследовательская мотивация", "способность держать сложный вопрос", "оригинальные смысловые прозрения"]'::jsonb,
  '["ментальная перегрузка", "изоляция в абстракции", "поспешное объявление ''истины'' без проверки"]'::jsonb,
  '["оговаривать границы исследовательского цикла", "добавлять этап практической проверки идей", "сочетать глубину вопросов с рабочим приоритетом"]'::jsonb,
  '["интеллектуально насыщенная среда", "время на глубокое мышление", "культура уважения к сложным вопросам"]'::jsonb,
  '["сложно в исключительно утилитарной среде без пространства для исследований"]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Сильный внутренний интерес к глубинным вопросам и поиску подлинного смысла.',
    'work_manifestation', 'В работе помогает находить нестандартные объяснения и новые рамки понимания сложных тем.',
    'strengths', 'Интеллектуальная глубина, выдержка в неопределенности, оригинальность выводов.',
    'risks', 'Переутомление от мыслей, отрыв от практики, склонность к ментальной одержимости.',
    'when_it_works_best', 'Лучше проявляется при сочетании исследовательской свободы и проверки идей на практике.',
    'when_talent_is_not_revealed', 'Снижается, когда на сложные вопросы не дают времени и требуют только быстрых ответов.'
  ),
  jsonb_build_object(
    'hd_meaning', 'Gate 61 — mystery and inner truth pressure in Head Center.',
    'mechanics', 'Head inspiration pressure seeks resolution through downstream processing; not every pressure needs immediate answer.',
    'classical_keywords', '["mystery", "inner truth", "inspiration", "head pressure"]'::jsonb,
    'source_logic', 'Gate interpretation. Final reading depends on center, channel, line, planet activation, side personality/design and whole chart context.',
    'pro_not_self', 'Not-Self: mistaking mental pressure for a demand to prove certainty.'
  ),
  jsonb_build_object(
    'primary_context', '["center", "channel", "activation", "line"]'::jsonb,
    'secondary_context', '["type", "strategy", "authority", "profile", "definition"]'::jsonb,
    'depends_on', 'Gate meaning must be adjusted by center, channel completion, planet activation, line and whole chart mechanics.',
    'related_element_kinds', '["activation", "channel", "defined_center", "open_center", "type", "strategy", "authority", "profile"]'::jsonb,
    'context_note', 'Standalone gate reference is only a semantic building block. It is not a final personality conclusion.'
  ),
  jsonb_build_object(
    'base', 'В искажении человек застревает в бесконечных вопросах и теряет контакт с действиями.',
    'pro', 'Distorted Gate 61 amplifies existential pressure without grounded integration.',
    'warning_signals', '["навязчивое прокручивание вопросов", "усталость от недостижимой определенности", "падение продуктивности в практических задачах"]'::jsonb,
    'recovery_conditions', '["выделить один приоритетный исследовательский вопрос", "перевести идею в проверяемую гипотезу", "ограничить время глубокой рефлексии рабочим окном"]'::jsonb
  ),
  jsonb_build_array(
    jsonb_build_object(
      'contrast_context', 'Gate 61 проявлена в команде с высоким спросом на быстрые решения.',
      'how_it_would_read', 'Может восприниматься как ''слишком философский'' стиль мышления.',
      'why_current_context_is_different', 'При правильной настройке процесса это становится источником прорывных смысловых рамок.'
    )
  ),
  'draft'
),

-- GATE 62: Detail
(
  'gate', '62', 'Ворота 62', 'ru', 'v1',
  'Gate 62 — Detail: preponderance of the small, внимание к фактам, названиям и точности формулировки.',
  'Сильная сторона — делать сложное конкретным и проверяемым. Человек отлично работает с деталями: уточняет термины, убирает двусмысленность, собирает фактическую ясность.',
  'Gate 62 in Ajna — detail, naming and factual precision. Organizes thought into concrete expression.',
  '["точная фактологическая речь", "структурирование деталей", "умение убирать двусмысленность"]'::jsonb,
  '["утопание в мелочах", "потеря общей картины", "перегруз команды уточнениями"]'::jsonb,
  '["разделять этапы детализации и стратегического обзора", "давать явный уровень требуемой точности", "использовать чек-листы фактов для релизов"]'::jsonb,
  '["культура доказательности", "доступ к первичным данным", "уважение к аккуратной документации"]'::jsonb,
  '["слабее в задачах, где нет запроса на точность"]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Фокусируется на точности деталей и ясности формулировок.',
    'work_manifestation', 'В работе проверяет факты, уточняет определения и повышает качество коммуникации.',
    'strengths', 'Внимательность, ясный язык, надежная проверка мелких, но критичных элементов.',
    'risks', 'Чрезмерная детализация, замедление решений, потеря масштаба задачи.',
    'when_it_works_best', 'Лучше раскрывается там, где цена фактической ошибки высока и важна точная терминология.',
    'when_talent_is_not_revealed', 'Снижается в среде, где детали считаются второстепенными и не проверяются.'
  ),
  jsonb_build_object(
    'hd_meaning', 'Gate 62 — factual detail and naming in Ajna logic.',
    'mechanics', 'Supports logical articulation by turning abstractions into precise language and verifiable units.',
    'classical_keywords', '["detail", "facts", "naming", "precision"]'::jsonb,
    'source_logic', 'Gate interpretation. Final reading depends on center, channel, line, planet activation, side personality/design and whole chart context.',
    'pro_not_self', 'Not-Self: using detail to control narrative rather than clarify truth.'
  ),
  jsonb_build_object(
    'primary_context', '["center", "channel", "activation", "line"]'::jsonb,
    'secondary_context', '["type", "strategy", "authority", "profile", "definition"]'::jsonb,
    'depends_on', 'Gate meaning must be adjusted by center, channel completion, planet activation, line and whole chart mechanics.',
    'related_element_kinds', '["activation", "channel", "defined_center", "open_center", "type", "strategy", "authority", "profile"]'::jsonb,
    'context_note', 'Standalone gate reference is only a semantic building block. It is not a final personality conclusion.'
  ),
  jsonb_build_object(
    'base', 'В искажении человек правит формулировки бесконечно и задерживает выход результата.',
    'pro', 'Distorted Gate 62 weaponizes details, losing practical timing.',
    'warning_signals', '["бесконечные микро-правки", "долгие споры о терминах без движения", "усталость команды от объема уточнений"]'::jsonb,
    'recovery_conditions', '["согласовать достаточный уровень точности", "вернуть фокус на цель решения", "разделить ''критичные'' и ''желательные'' детали"]'::jsonb
  ),
  jsonb_build_array(
    jsonb_build_object(
      'contrast_context', 'Gate 62 активирована в ранней фазе гипотез без данных.',
      'how_it_would_read', 'Может выглядеть как избыточная требовательность к фактам.',
      'why_current_context_is_different', 'Когда данные появляются, эта требовательность резко повышает качество итоговых выводов.'
    )
  ),
  'draft'
),

-- GATE 63: Doubt
(
  'gate', '63', 'Ворота 63', 'ru', 'v1',
  'Gate 63 — Doubt: after completion, логическое сомнение и давление на проверку гипотез.',
  'Это полезный скепсис, который не дает системе принимать слабые решения. Человек задает точные вопросы, находит уязвимости в логике и укрепляет выводы через проверку.',
  'Gate 63 in Head — logical doubt pressure. Questions test consistency before commitment.',
  '["критическая проверка гипотез", "выявление логических дыр", "устойчивость к наивной уверенности"]'::jsonb,
  '["паралич из-за бесконечных проверок", "недоверие ко всему новому", "тревожность при недостатке доказательств"]'::jsonb,
  '["вводить ограниченное окно скептической проверки", "фиксировать критерии достаточного доказательства", "разделять этап исследования и этап решения"]'::jsonb,
  '["культура вопросов", "доступ к метрикам и тестам", "уважение к роли конструктивного скептика"]'::jsonb,
  '["проседает в среде, где сомнение воспринимают как личную атаку"]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Сильный навык сомневаться конструктивно и проверять устойчивость решений.',
    'work_manifestation', 'В работе это проявляется как точные вопросы, которые делают итоговое решение надежнее.',
    'strengths', 'Критичность, интеллектуальная честность, снижение риска ошибок.',
    'risks', 'Затяжные проверки, повышенная тревожность, торможение запуска при недостатке уверенности.',
    'when_it_works_best', 'Лучше раскрывается в процессах, где проверка встроена в цикл принятия решений.',
    'when_talent_is_not_revealed', 'Снижается там, где вопросы запрещены и ценится только видимость уверенности.'
  ),
  jsonb_build_object(
    'hd_meaning', 'Gate 63 — pressure of logical doubt in Head Center.',
    'mechanics', 'Doubt drives pattern testing; resolution quality depends on coherent evidence chain.',
    'classical_keywords', '["doubt", "logical", "testing", "questions"]'::jsonb,
    'source_logic', 'Gate interpretation. Final reading depends on center, channel, line, planet activation, side personality/design and whole chart context.',
    'pro_not_self', 'Not-Self: identifying with doubt and never moving to tested conclusion.'
  ),
  jsonb_build_object(
    'primary_context', '["center", "channel", "activation", "line"]'::jsonb,
    'secondary_context', '["type", "strategy", "authority", "profile", "definition"]'::jsonb,
    'depends_on', 'Gate meaning must be adjusted by center, channel completion, planet activation, line and whole chart mechanics.',
    'related_element_kinds', '["activation", "channel", "defined_center", "open_center", "type", "strategy", "authority", "profile"]'::jsonb,
    'context_note', 'Standalone gate reference is only a semantic building block. It is not a final personality conclusion.'
  ),
  jsonb_build_object(
    'base', 'В искажении человек сомневается ради сомнения и разрушает рабочий темп.',
    'pro', 'Distorted Gate 63 sustains uncertainty even after sufficient validation.',
    'warning_signals', '["бесконечные круги перепроверки", "подрыв доверия к уже проверенным шагам", "избегание финальных решений"]'::jsonb,
    'recovery_conditions', '["заранее согласовать критерий ''доказано достаточно''", "закрывать проверку по дедлайну", "фиксировать решение и план пост-проверки"]'::jsonb
  ),
  jsonb_build_array(
    jsonb_build_object(
      'contrast_context', 'Gate 63 проявлена в новой области с высоким уровнем неизвестности.',
      'how_it_would_read', 'Сомнение может казаться избыточным торможением.',
      'why_current_context_is_different', 'В действительности это страхует команду от дорогих ошибок на раннем этапе.'
    )
  ),
  'draft'
),

-- GATE 64: Confusion
(
  'gate', '64', 'Ворота 64', 'ru', 'v1',
  'Gate 64 — Confusion: before completion, ментальная путаница образов перед ясностью.',
  'Сначала возникает поток фрагментов и несвязанных картин, из которых позже складывается целое. Человек полезен там, где важно выдержать неопределенность до появления зрелого понимания.',
  'Gate 64 in Head — pressure of confusion before completion. Imagery stream seeks coherent patterning.',
  '["удержание неопределенности без паники", "сбор разрозненных сигналов", "появление целостной картины после инкубации"]'::jsonb,
  '["спешка с ранним объяснением", "ментальный перегрев", "коммуникация сырого вывода как финального"]'::jsonb,
  '["давать время на инкубацию сложных тем", "разделять черновое и итоговое объяснение", "фиксировать промежуточные наблюдения без преждевременных выводов"]'::jsonb,
  '["пространство для глубокого мышления", "умеренный информационный поток", "культура терпимости к промежуточной неясности"]'::jsonb,
  '["сложно в режиме постоянной немедленной отчетности"]'::jsonb,
  jsonb_build_object(
    'plain_meaning', 'Сильная способность выдерживать период неясности, пока не сложится цельная картина.',
    'work_manifestation', 'В работе собирает фрагменты информации и со временем формирует зрелое, связное понимание.',
    'strengths', 'Терпение к сложному, богатое ассоциативное мышление, глубина итоговой синтезации.',
    'risks', 'Поспешные интерпретации, усталость от перегруза, трудность объяснить процесс до ясности.',
    'when_it_works_best', 'Лучше раскрывается, когда есть этап инкубации и возможность вернуться с оформленным выводом.',
    'when_talent_is_not_revealed', 'Снижается, если требуется немедленная определенность по сырому материалу.'
  ),
  jsonb_build_object(
    'hd_meaning', 'Gate 64 — confusion pressure that precedes conceptual completion.',
    'mechanics', 'Head imagery pressure resolves downstream; meaning emerges through process, not instant certainty.',
    'classical_keywords', '["confusion", "before completion", "mental pressure", "imagery"]'::jsonb,
    'source_logic', 'Gate interpretation. Final reading depends on center, channel, line, planet activation, side personality/design and whole chart context.',
    'pro_not_self', 'Not-Self: forcing premature coherence to relieve mental pressure.'
  ),
  jsonb_build_object(
    'primary_context', '["center", "channel", "activation", "line"]'::jsonb,
    'secondary_context', '["type", "strategy", "authority", "profile", "definition"]'::jsonb,
    'depends_on', 'Gate meaning must be adjusted by center, channel completion, planet activation, line and whole chart mechanics.',
    'related_element_kinds', '["activation", "channel", "defined_center", "open_center", "type", "strategy", "authority", "profile"]'::jsonb,
    'context_note', 'Standalone gate reference is only a semantic building block. It is not a final personality conclusion.'
  ),
  jsonb_build_object(
    'base', 'В искажении человек путает временную неясность с провалом и начинает метаться.',
    'pro', 'Distorted Gate 64 seeks quick certainty and loses the value of incubation.',
    'warning_signals', '["частые ранние смены версии объяснения", "ощущение перегруженности мыслями", "трудно отличить наблюдение от вывода"]'::jsonb,
    'recovery_conditions', '["зафиксировать черновые наблюдения отдельно от выводов", "дать теме время на созревание", "вернуться к задаче после паузы с чистой структурой"]'::jsonb
  ),
  jsonb_build_array(
    jsonb_build_object(
      'contrast_context', 'Gate 64 проявлена в проекте с большим объемом несвязанной информации.',
      'how_it_would_read', 'Может выглядеть как хаотичное мышление.',
      'why_current_context_is_different', 'При уважении к фазе созревания именно эта ''путаница'' рождает целостное понимание.'
    )
  ),
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
