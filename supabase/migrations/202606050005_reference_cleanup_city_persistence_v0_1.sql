-- Stage 4-C0.1: Reference cleanup (Stage 4-A empty limitations/contrast) + city persistence fields

-- ---------------------------------------------------------------------------
-- Part 1.1: Fill empty limitations / contrast_examples on Stage 4-A reference rows
-- Only updates rows where the field is null or an empty JSON array.
-- ---------------------------------------------------------------------------

update public.hd_reference_interpretations
set
  limitations = case
    when coalesce(limitations, '[]'::jsonb) = '[]'::jsonb then
      '[
        "Не использовать как финальный HR-вывод без контекста типа, стратегии и авторитета.",
        "Не делать вывод о найме только по типу Projector.",
        "Проверять проявление через реальные рабочие факты и поведение кандидата."
      ]'::jsonb
    else limitations
  end,
  contrast_examples = case
    when coalesce(contrast_examples, '[]'::jsonb) = '[]'::jsonb then
      '[{
        "contrast_context": "Тип Generator с defined Sacral и стратегией отклика.",
        "how_it_would_read": "Кандидат мог бы казаться человеком с постоянным рабочим мотором и высокой операционной выносливостью.",
        "why_current_context_is_different": "В полной карте тип Projector — сила в направлении и экспертизе по приглашению, а не в объёме моторной энергии."
      }]'::jsonb
    else contrast_examples
  end,
  updated_at = timezone('utc', now())
where language = 'ru'
  and version = 'v1'
  and element_kind = 'type'
  and element_key = 'projector';

update public.hd_reference_interpretations
set
  limitations = case
    when coalesce(limitations, '[]'::jsonb) = '[]'::jsonb then
      '[
        "Не трактовать ожидание приглашения как пассивность или отказ от инициативы.",
        "Не делать вывод о найме только по стратегии без типа и авторитета.",
        "Уточнять, как приглашение проявляется в конкретной рабочей среде."
      ]'::jsonb
    else limitations
  end,
  contrast_examples = case
    when coalesce(contrast_examples, '[]'::jsonb) = '[]'::jsonb then
      '[{
        "contrast_context": "Стратегия Generator — откликаться на возможности в моменте.",
        "how_it_would_read": "Человек мог бы казаться проактивным исполнителем, который сам берёт задачи без явного запроса.",
        "why_current_context_is_different": "Для Projector стратегия приглашения определяет корректный вход в значимые решения, а не объём самостартующих действий."
      }]'::jsonb
    else contrast_examples
  end,
  updated_at = timezone('utc', now())
where language = 'ru'
  and version = 'v1'
  and element_kind = 'strategy'
  and element_key = 'wait_for_the_invitation';

update public.hd_reference_interpretations
set
  limitations = case
    when coalesce(limitations, '[]'::jsonb) = '[]'::jsonb then
      '[
        "Не игнорировать мгновенный спленический сигнал в пользу «логичного» отложенного решения.",
        "Не делать вывод о найме только по авторитету без типа и контекста задач.",
        "Проверять, были ли решения приняты в моменте присутствия, а не под давлением."
      ]'::jsonb
    else limitations
  end,
  contrast_examples = case
    when coalesce(contrast_examples, '[]'::jsonb) = '[]'::jsonb then
      '[{
        "contrast_context": "Эмоциональный авторитет с волной и циклом ясности.",
        "how_it_would_read": "Решения требовали бы времени «прожить волну» и вернуться к вопросу позже.",
        "why_current_context_is_different": "Splenic authority даёт одноразовый телесный ответ в настоящем моменте, без эмоционального цикла."
      }]'::jsonb
    else contrast_examples
  end,
  updated_at = timezone('utc', now())
where language = 'ru'
  and version = 'v1'
  and element_kind = 'authority'
  and element_key = 'splenic';

update public.hd_reference_interpretations
set
  limitations = case
    when coalesce(limitations, '[]'::jsonb) = '[]'::jsonb then
      '[
        "Не наказывать за ошибки и итерации — для 1/3 это часть метода познания.",
        "Не делать вывод о компетентности только по скорости выхода на результат.",
        "Сопоставлять проявление профиля с типом, авторитетом и рабочей средой."
      ]'::jsonb
    else limitations
  end,
  contrast_examples = case
    when coalesce(contrast_examples, '[]'::jsonb) = '[]'::jsonb then
      '[{
        "contrast_context": "Профиль 3/5 без линии исследователя.",
        "how_it_would_read": "Человек мог бы казаться экспериментатором без потребности сначала выстроить глубокую базу знаний.",
        "why_current_context_is_different": "1/3 сочетает фундамент (линия 1) с проверкой через практику (линия 3), поэтому скорость без базы — не его механика."
      }]'::jsonb
    else contrast_examples
  end,
  updated_at = timezone('utc', now())
where language = 'ru'
  and version = 'v1'
  and element_kind = 'profile'
  and element_key = '1/3';

update public.hd_reference_interpretations
set
  limitations = case
    when coalesce(limitations, '[]'::jsonb) = '[]'::jsonb then
      '[
        "Не требовать от кандидата универсального «цельного» стиля без опоры на команду.",
        "Не делать вывод о найме только по split definition без контекста роли.",
        "Учитывать, какие люди или темы выступают мостом между двумя кластерами карты."
      ]'::jsonb
    else limitations
  end,
  contrast_examples = case
    when coalesce(contrast_examples, '[]'::jsonb) = '[]'::jsonb then
      '[{
        "contrast_context": "Single Definition — все определённые центры связаны в одном кластере.",
        "how_it_would_read": "Человек мог бы казаться самодостаточным в принятии решений без внешнего моста.",
        "why_current_context_is_different": "Split Definition описывает два кластера, между которыми нужна связка через людей или контекст."
      }]'::jsonb
    else contrast_examples
  end,
  updated_at = timezone('utc', now())
where language = 'ru'
  and version = 'v1'
  and element_kind = 'definition'
  and element_key = 'split_definition';

update public.hd_reference_interpretations
set
  limitations = case
    when coalesce(limitations, '[]'::jsonb) = '[]'::jsonb then
      '[
        "Не путать устойчивое мнение с упрямством или отказом от обратной связи.",
        "Не использовать defined Ajna как единственный критерий аналитических способностей.",
        "Читать центр вместе с каналами и воротами, которые его активируют."
      ]'::jsonb
    else limitations
  end,
  contrast_examples = case
    when coalesce(contrast_examples, '[]'::jsonb) = '[]'::jsonb then
      '[{
        "contrast_context": "Open Ajna — гибкое мышление без фиксированной рамки.",
        "how_it_would_read": "Человек мог бы легко принимать чужие концепции и менять точку зрения под аудиторию.",
        "why_current_context_is_different": "Defined Ajna даёт стабильный собственный способ обработки информации и формирования мнений."
      }]'::jsonb
    else contrast_examples
  end,
  updated_at = timezone('utc', now())
where language = 'ru'
  and version = 'v1'
  and element_kind = 'defined_center'
  and element_key = 'ajna';

update public.hd_reference_interpretations
set
  limitations = case
    when coalesce(limitations, '[]'::jsonb) = '[]'::jsonb then
      '[
        "Не перегружать постоянными публичными выступлениями без подготовки и пауз.",
        "Не трактовать defined Throat как обязанность говорить всегда и везде.",
        "Учитывать, какие каналы подключены к Throat, а не только сам центр."
      ]'::jsonb
    else limitations
  end,
  contrast_examples = case
    when coalesce(contrast_examples, '[]'::jsonb) = '[]'::jsonb then
      '[{
        "contrast_context": "Open Throat — выражение зависит от контекста и аудитории.",
        "how_it_would_read": "Человек мог бы подстраивать стиль речи и говорить «в моменте» под ситуацию.",
        "why_current_context_is_different": "Defined Throat даёт устойчивый собственный канал выражения и материализации через слово."
      }]'::jsonb
    else contrast_examples
  end,
  updated_at = timezone('utc', now())
where language = 'ru'
  and version = 'v1'
  and element_kind = 'defined_center'
  and element_key = 'throat';

update public.hd_reference_interpretations
set
  limitations = case
    when coalesce(limitations, '[]'::jsonb) = '[]'::jsonb then
      '[
        "Не обесценивать мгновенные интуитивные «нет» без контекста.",
        "Не использовать defined Spleen как доказательство паранойи или категоричности.",
        "Сопоставлять с авторитетом и каналами через Spleen."
      ]'::jsonb
    else limitations
  end,
  contrast_examples = case
    when coalesce(contrast_examples, '[]'::jsonb) = '[]'::jsonb then
      '[{
        "contrast_context": "Open Spleen — чувствительность к чужим страхам и нестабильная интуиция.",
        "how_it_would_read": "Человек мог бы нуждаться во внешней опоре для ощущения безопасности.",
        "why_current_context_is_different": "Defined Spleen несёт собственный иммунитет к риску и мгновенный телесный радар."
      }]'::jsonb
    else contrast_examples
  end,
  updated_at = timezone('utc', now())
where language = 'ru'
  and version = 'v1'
  and element_kind = 'defined_center'
  and element_key = 'spleen';

update public.hd_reference_interpretations
set
  limitations = case
    when coalesce(limitations, '[]'::jsonb) = '[]'::jsonb then
      '[
        "Не навешивать на кандидата чужую срочность и адреналиновый темп команды.",
        "Не путать defined Root с бесконечной мотивацией «делать больше».",
        "Читать Root вместе с каналами давления, а не изолированно."
      ]'::jsonb
    else limitations
  end,
  contrast_examples = case
    when coalesce(contrast_examples, '[]'::jsonb) = '[]'::jsonb then
      '[{
        "contrast_context": "Open Root — давление и срочность приходят извне.",
        "how_it_would_read": "Человек мог бы остро реагировать на дедлайны окружения и ускоряться под чужой стресс.",
        "why_current_context_is_different": "Defined Root даёт собственный ритм давления и способность задавать темп срочности."
      }]'::jsonb
    else contrast_examples
  end,
  updated_at = timezone('utc', now())
where language = 'ru'
  and version = 'v1'
  and element_kind = 'defined_center'
  and element_key = 'root';

update public.hd_reference_interpretations
set
  limitations = case
    when coalesce(limitations, '[]'::jsonb) = '[]'::jsonb then
      '[
        "Не требовать постоянной генерации идей и ответов на все вопросы команды.",
        "Не трактовать open Head как отсутствие интеллекта.",
        "Давать фильтры на входящие вопросы и информационную нагрузку."
      ]'::jsonb
    else limitations
  end,
  contrast_examples = case
    when coalesce(contrast_examples, '[]'::jsonb) = '[]'::jsonb then
      '[{
        "contrast_context": "Defined Head — собственный источник вопросов и ментального давления.",
        "how_it_would_read": "Человек мог бы стабильно генерировать темы для размышления и задавать направление мысли.",
        "why_current_context_is_different": "Open Head усиливает чужие вопросы и вдохновение, а не производит постоянное ментальное давление сам."
      }]'::jsonb
    else contrast_examples
  end,
  updated_at = timezone('utc', now())
where language = 'ru'
  and version = 'v1'
  and element_kind = 'open_center'
  and element_key = 'head';

update public.hd_reference_interpretations
set
  limitations = case
    when coalesce(limitations, '[]'::jsonb) = '[]'::jsonb then
      '[
        "Не ожидать жёстко фиксированного личного вектора без опоры на миссию организации.",
        "Не делать вывод о лояльности только по адаптивности к культуре.",
        "Регулярно сверять личные цели с направлением компании."
      ]'::jsonb
    else limitations
  end,
  contrast_examples = case
    when coalesce(contrast_examples, '[]'::jsonb) = '[]'::jsonb then
      '[{
        "contrast_context": "Defined G — устойчивое направление и идентичность.",
        "how_it_would_read": "Человек мог бы держать свой вектор независимо от смены окружения.",
        "why_current_context_is_different": "Open G гибко чувствует направление команды, но рискует потерять собственный вектор в хаосе."
      }]'::jsonb
    else contrast_examples
  end,
  updated_at = timezone('utc', now())
where language = 'ru'
  and version = 'v1'
  and element_kind = 'open_center'
  and element_key = 'g';

update public.hd_reference_interpretations
set
  limitations = case
    when coalesce(limitations, '[]'::jsonb) = '[]'::jsonb then
      '[
        "Не давить KPI «докажи, что ты лучший» без реалистичных рамок.",
        "Не трактовать open Ego как отсутствие амбиции.",
        "Следить, чтобы обещания соответствовали реальным ресурсам."
      ]'::jsonb
    else limitations
  end,
  contrast_examples = case
    when coalesce(contrast_examples, '[]'::jsonb) = '[]'::jsonb then
      '[{
        "contrast_context": "Defined Ego — стабильная воля и самооценка.",
        "how_it_would_read": "Человек мог бы уверенно обещать и держать слово как опору идентичности.",
        "why_current_context_is_different": "Open Ego чувствителен к давлению доказательства ценности и склонен переобещать."
      }]'::jsonb
    else contrast_examples
  end,
  updated_at = timezone('utc', now())
where language = 'ru'
  and version = 'v1'
  and element_kind = 'open_center'
  and element_key = 'ego';

update public.hd_reference_interpretations
set
  limitations = case
    when coalesce(limitations, '[]'::jsonb) = '[]'::jsonb then
      '[
        "Не путать эмпатию с собственной эмоциональной волной кандидата.",
        "Не ставить в роли эмоционального «регулятора» команды без границ.",
        "Давать время на восстановление после эмоционально насыщенных встреч."
      ]'::jsonb
    else limitations
  end,
  contrast_examples = case
    when coalesce(contrast_examples, '[]'::jsonb) = '[]'::jsonb then
      '[{
        "contrast_context": "Defined Solar Plexus с эмоциональным авторитетом.",
        "how_it_would_read": "Решения требовали бы прожить эмоциональную волну и дождаться ясности.",
        "why_current_context_is_different": "Open Solar Plexus усиливает эмоции окружения, но не несёт собственной волны для принятия решений."
      }]'::jsonb
    else contrast_examples
  end,
  updated_at = timezone('utc', now())
where language = 'ru'
  and version = 'v1'
  and element_kind = 'open_center'
  and element_key = 'solar_plexus';

update public.hd_reference_interpretations
set
  limitations = case
    when coalesce(limitations, '[]'::jsonb) = '[]'::jsonb then
      '[
        "Не ставить в чисто генераторную операционную нагрузку без пауз и делегирования.",
        "Не использовать open Sacral как признак «лени» или низкой мотивации.",
        "Сопоставлять с типом Projector и стратегией приглашения."
      ]'::jsonb
    else limitations
  end,
  contrast_examples = case
    when coalesce(contrast_examples, '[]'::jsonb) = '[]'::jsonb then
      '[{
        "contrast_context": "Defined Sacral у Generator — устойчивый рабочий мотор.",
        "how_it_would_read": "Человек мог бы стабильно работать длинными сессиями с внутренним откликом «да/нет».",
        "why_current_context_is_different": "Open Sacral у Projector — нормальная механика; сила в направлении, а не в объёме моторной энергии."
      }]'::jsonb
    else contrast_examples
  end,
  updated_at = timezone('utc', now())
where language = 'ru'
  and version = 'v1'
  and element_kind = 'open_center'
  and element_key = 'sacral';

update public.hd_reference_interpretations
set
  limitations = case
    when coalesce(limitations, '[]'::jsonb) = '[]'::jsonb then
      '[
        "Не допускать распыления на слишком много тем без фокуса.",
        "Не оценивать глубину только по красоте презентации.",
        "Читать канал вместе с профилем и defined Ajna/Throat."
      ]'::jsonb
    else limitations
  end,
  contrast_examples = case
    when coalesce(contrast_examples, '[]'::jsonb) = '[]'::jsonb then
      '[{
        "contrast_context": "Карта без канала 11-56 между Ajna и Throat.",
        "how_it_would_read": "Идеи могли бы оставаться внутренними без стабильного моста в коммуникацию.",
        "why_current_context_is_different": "Канал 11-56 даёт постоянную связку «исследование идеи → рассказ другим»."
      }]'::jsonb
    else contrast_examples
  end,
  updated_at = timezone('utc', now())
where language = 'ru'
  and version = 'v1'
  and element_kind = 'channel'
  and element_key = '11-56';

update public.hd_reference_interpretations
set
  limitations = case
    when coalesce(limitations, '[]'::jsonb) = '[]'::jsonb then
      '[
        "Не путать конструктивную критику качества с личными нападками.",
        "Не использовать канал как оправдание токсичной придирчивости.",
        "Нужна культура continuous improvement, иначе талант будет восприниматься как конфликт."
      ]'::jsonb
    else limitations
  end,
  contrast_examples = case
    when coalesce(contrast_examples, '[]'::jsonb) = '[]'::jsonb then
      '[{
        "contrast_context": "Среда «и так сойдёт» без культуры улучшений.",
        "how_it_would_read": "Кандидат мог бы казаться «вечно недовольным» или создающим лишнее трение.",
        "why_current_context_is_different": "В зрелой CI-культуре канал 18-58 — ключевой талант качества и доработки до рабочего уровня."
      }]'::jsonb
    else contrast_examples
  end,
  updated_at = timezone('utc', now())
where language = 'ru'
  and version = 'v1'
  and element_kind = 'channel'
  and element_key = '18-58';

update public.hd_reference_interpretations
set
  limitations = case
    when coalesce(limitations, '[]'::jsonb) = '[]'::jsonb then
      '[
        "Не втягивать в бессмысленные конфликты без объяснения «зачем» борьба.",
        "Не трактовать упорство как обязательную конфликтность.",
        "Фильтровать битвы через Splenic authority — брать только те, где есть мгновенное «да»."
      ]'::jsonb
    else limitations
  end,
  contrast_examples = case
    when coalesce(contrast_examples, '[]'::jsonb) = '[]'::jsonb then
      '[{
        "contrast_context": "Профиль, избегающий конфликтов и ищущий компромисс.",
        "how_it_would_read": "Человек мог бы уходить от борьбы и соглашаться ради сохранения мира.",
        "why_current_context_is_different": "Канал 28-38 даёт энергию осмысленной борьбы за то, что действительно важно."
      }]'::jsonb
    else contrast_examples
  end,
  updated_at = timezone('utc', now())
where language = 'ru'
  and version = 'v1'
  and element_kind = 'channel'
  and element_key = '28-38';

-- ---------------------------------------------------------------------------
-- Part 2.1: City persistence fields on hr_candidates
-- ---------------------------------------------------------------------------

alter table public.hr_candidates
  add column if not exists birth_city_label text,
  add column if not exists birth_latitude double precision,
  add column if not exists birth_longitude double precision,
  add column if not exists birth_city_source text;

-- birth_timezone already exists on hr_candidates from initial schema
