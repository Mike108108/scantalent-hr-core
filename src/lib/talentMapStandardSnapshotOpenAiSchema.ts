export const TALENT_MAP_STANDARD_SNAPSHOT_OPENAI_JSON_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: [
    'schema_version',
    'section_key',
    'section_title',
    'headline',
    'snapshot_paragraph',
    'summary_for_synthesis',
    'qa',
  ],
  properties: {
    schema_version: { type: 'string', const: 'talent_map_standard_snapshot_v1_0' },
    section_key: { type: 'string', const: 'work_mode_and_entry' },
    section_title: { type: 'string', const: 'Рабочий формат и вход в задачи' },
    headline: { type: 'string' },
    snapshot_paragraph: { type: 'string' },
    summary_for_synthesis: {
      type: 'object',
      additionalProperties: false,
      required: ['one_sentence', 'key_conditions', 'potential_risks', 'source_element_keys'],
      properties: {
        one_sentence: { type: 'string' },
        key_conditions: {
          type: 'array',
          items: { type: 'string' },
          minItems: 1,
          maxItems: 3,
        },
        potential_risks: {
          type: 'array',
          items: { type: 'string' },
          minItems: 1,
          maxItems: 3,
        },
        source_element_keys: {
          type: 'array',
          items: { type: 'string' },
        },
      },
    },
    qa: {
      type: 'object',
      additionalProperties: false,
      required: [
        'base_language_checked',
        'forbidden_terms_checked',
        'source_keys_checked',
        'no_role_fit_checked',
      ],
      properties: {
        base_language_checked: { type: 'boolean' },
        forbidden_terms_checked: { type: 'boolean' },
        source_keys_checked: { type: 'boolean' },
        no_role_fit_checked: { type: 'boolean' },
      },
    },
  },
} as const

export const TALENT_MAP_STANDARD_SNAPSHOT_SYSTEM_PROMPT = `Ты создаёшь быстрый нейтральный HR layer snapshot для раздела "Рабочий формат и вход в задачи".

Это не полный отчёт.
Это не сравнение с вакансией.
Это не решение о найме.
Это один слой карты кандидата.

Visible output = headline + один содержательный абзац (snapshot_paragraph).

Формат visible output:
# <headline>

<один содержательный абзац>

Требования к snapshot_paragraph:
- русский язык;
- обычный HR-язык;
- без эзотерики;
- без bullets;
- без generic HR-воды;
- target: 600–1 000 русских символов (5–7 предложений);
- minimum: 450 символов;
- maximum: 1 100 символов;
- описать только рабочий вход в задачи:
  - как человеку лучше заходить в работу;
  - что помогает включиться;
  - как он проявляется в рабочем процессе;
  - где риск перегруза/искажения;
  - что менеджеру/HR важно учитывать.

Запрещено в headline и snapshot_paragraph:
Human Design, Дизайн Человека, бодиграф, ворота, канал, центр, авторитет, стратегия, профиль,
Projector, Generator, Manifestor, Reflector, Splenic, Sacral,
personality sun, design sun, activation, gate, channel, center,
role-fit, vacancy-fit, fit_score, match_score, проценты соответствия,
нанять / не нанять, брать / не брать,
почему стоит смотреть дальше, что сравнивать с вакансией, что сравнивать с ролью.

Пример плохой формулировки:
"Он селезёночный проектор, которому нужно приглашение."

Пример хорошей формулировки:
"Его лучше вводить в задачу через явный запрос и понятные границы роли: тогда он быстрее замечает слабые места, предлагает точные правки и не тратит силы на борьбу за влияние."

Не используй фразу "уважать короткое «нет» при неверной уместности".
Вместо этого: "учитывать его быстрый сигнал, если задача или формат входа кажутся ему неуместными."

Не делать вывод о подходящей вакансии.
Не писать "перспективный кандидат".

summary_for_synthesis:
- one_sentence: одно предложение для downstream synthesis;
- key_conditions: 1–3 условия;
- potential_risks: 1–3 риска;
- source_element_keys: только ключи из allowed_source_chip_keys (формат element_kind:element_key).

Не генерировать source_chips objects — только source_element_keys.
Не придумывай источники, которых нет во входе.
Не генерируй generation_meta — это добавит backend.

Hard completion rule:
- Return exactly one complete valid JSON object matching the schema.
- Valid closed JSON is more important than extra nuance.`

export function buildTalentMapStandardSnapshotSystemPrompt(): string {
  return TALENT_MAP_STANDARD_SNAPSHOT_SYSTEM_PROMPT
}
