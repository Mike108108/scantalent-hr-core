import type { SupportedGeneratedSectionKey } from './talentMapGeneratedSections'
import { getSupportedGeneratedSectionTitle } from './talentMapGeneratedSections'

const TALENT_MAP_STANDARD_SNAPSHOT_OPENAI_JSON_SCHEMA_BODY = {
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
    section_key: { type: 'string' },
    section_title: { type: 'string' },
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

export function buildTalentMapStandardSnapshotOpenAiJsonSchema(params: {
  sectionKey: SupportedGeneratedSectionKey
  sectionTitle: string
}) {
  return {
    ...TALENT_MAP_STANDARD_SNAPSHOT_OPENAI_JSON_SCHEMA_BODY,
    properties: {
      ...TALENT_MAP_STANDARD_SNAPSHOT_OPENAI_JSON_SCHEMA_BODY.properties,
      section_key: { type: 'string', const: params.sectionKey },
      section_title: { type: 'string', const: params.sectionTitle },
    },
  }
}

export const TALENT_MAP_STANDARD_SNAPSHOT_OPENAI_JSON_SCHEMA =
  buildTalentMapStandardSnapshotOpenAiJsonSchema({
    sectionKey: 'work_mode_and_entry',
    sectionTitle: getSupportedGeneratedSectionTitle('work_mode_and_entry'),
  })

const STANDARD_SNAPSHOT_SHARED_RULES = `Это mass screening snapshot, а не полный отчёт.
Это не сравнение с вакансией.
Это не решение о найме.
Это не mini-версия Premium.
Это один слой карты кандидата — полезный после 30–60 секунд чтения.

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

Запрещено в headline и snapshot_paragraph:
Human Design, Дизайн Человека, бодиграф, ворота, канал, центр, авторитет, стратегия, профиль,
Projector, Generator, Manifestor, Reflector, Splenic, Sacral,
personality sun, design sun, activation, gate, channel, center,
role-fit, vacancy-fit, fit_score, match_score, проценты соответствия,
нанять / не нанять, брать / не брать,
почему стоит смотреть дальше, что сравнивать с вакансией, что сравнивать с ролью,
onboarding playbook, management playbook, адаптационный playbook,
управленческие инструкции по вводу в команду/процессы после найма.

Используй чистый HR-язык. Избегай полутехнических кальк:
отклик → первичная реакция на задачу / рабочая включённость;
приглашение → явный рабочий запрос / понятная роль;
интуитивный → быстрая первичная оценка уместности;
селезёночный сигнал → ранний сигнал риска;
энергетический → рабочий / поведенческий / ресурсный.

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

const WORK_MODE_STANDARD_SNAPSHOT_SECTION_FOCUS = `- описать только рабочий вход в задачи:
  - как человеку лучше заходить в работу;
  - что помогает включиться;
  - как он проявляется в рабочем процессе;
  - где риск перегруза/искажения;
  - что менеджеру/HR важно учитывать.

Пример плохой формулировки:
"Он селезёночный проектор, которому нужно приглашение."

Пример хорошей формулировки:
"Его лучше вводить в задачу через явный запрос и понятные границы роли: тогда он быстрее замечает слабые места, предлагает точные правки и не тратит силы на борьбу за влияние."

Не используй фразу "уважать короткое «нет» при неверной уместности".
Вместо этого: "учитывать ранний сигнал риска, если задача или формат входа кажутся ему неуместными."`

const DECISION_STYLE_STANDARD_SNAPSHOT_SECTION_FOCUS = `- описать только стиль принятия рабочих решений:
  - как кандидат принимает рабочие решения;
  - где возможен риск давления или ускорения;
  - что HR быстро должен заметить;
  - какие условия помогают выбору;
  - где риск искажения решения.

Пример плохой формулировки:
"У него селезёночный авторитет, ему нельзя давить."

Пример хорошей формулировки:
"Ему проще принимать рабочие решения, когда есть ясный контекст и нет искусственной срочности: тогда он быстрее замечает ранний сигнал риска и может озвучить сомнения до того, как команда зафиксирует неверный выбор."

Не используй фразу "быстрый внутренний сигнал".
Вместо этого: "ранний сигнал риска" или "быстрая первичная оценка уместности".`

function buildStandardSnapshotSectionFocus(sectionKey: SupportedGeneratedSectionKey): string {
  switch (sectionKey) {
    case 'work_mode_and_entry':
      return WORK_MODE_STANDARD_SNAPSHOT_SECTION_FOCUS
    case 'decision_style':
      return DECISION_STYLE_STANDARD_SNAPSHOT_SECTION_FOCUS
  }
}

export function buildTalentMapStandardSnapshotSystemPrompt(params: {
  sectionKey: SupportedGeneratedSectionKey
  sectionTitle: string
}): string {
  return `Ты создаёшь быстрый HR layer snapshot для массового первичного скрининга — раздел "${params.sectionTitle}".

${STANDARD_SNAPSHOT_SHARED_RULES}

${buildStandardSnapshotSectionFocus(params.sectionKey)}`
}

/** @deprecated Use buildTalentMapStandardSnapshotSystemPrompt */
export const TALENT_MAP_STANDARD_SNAPSHOT_SYSTEM_PROMPT = buildTalentMapStandardSnapshotSystemPrompt({
  sectionKey: 'work_mode_and_entry',
  sectionTitle: getSupportedGeneratedSectionTitle('work_mode_and_entry'),
})
