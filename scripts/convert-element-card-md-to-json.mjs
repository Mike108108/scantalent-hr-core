/**
 * One-off converter: approved Element Card MD → hd_reference_interpretations JSON.
 * Not part of runtime pipeline.
 *
 * Supported converters: type_projector, strategy_wait_for_the_invitation.
 * authority_splenic JSON is maintained from approved source (authority_splenic.v1.json).
 * profile_1_3 JSON is maintained from approved source (profile_1_3.v1.json).
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const sourceDir = join(root, 'supabase/reference/element_cards/source')
const outDir = join(root, 'supabase/reference/element_cards')

function extractTextBlock(content, startMarker, endMarker = null) {
  const start = content.indexOf(startMarker)
  if (start === -1) return ''
  const from = start + startMarker.length
  const rest = content.slice(from)
  const end = endMarker ? rest.indexOf(endMarker) : -1
  const slice = end === -1 ? rest : rest.slice(0, end)
  const match = slice.match(/```(?:text|ts)?\n([\s\S]*?)```/)
  if (match) return match[1].trim()
  return slice.trim()
}

function extractTextBlocks(content, startMarker, endMarker) {
  const start = content.indexOf(startMarker)
  if (start === -1) return []
  const from = start + startMarker.length
  const rest = content.slice(from)
  const end = rest.indexOf(endMarker)
  const slice = end === -1 ? rest : rest.slice(0, end)
  const blocks = [...slice.matchAll(/```(?:text|ts)?\n([\s\S]*?)```/g)]
  return blocks.map((m) => m[1].trim())
}

function textBlockToArray(block) {
  if (!block) return []
  return block
    .split('\n')
    .map((l) => l.trim().replace(/;+$/, ''))
    .filter(Boolean)
}

function sectionBetween(content, startHeading, endHeading) {
  const start = content.indexOf(startHeading)
  if (start === -1) return ''
  const from = start + startHeading.length
  const rest = content.slice(from)
  const end = rest.indexOf(endHeading)
  return (end === -1 ? rest : rest.slice(0, end)).trim()
}

function proseBeforeTextBlock(section) {
  const idx = section.indexOf('```')
  const text = idx === -1 ? section : section.slice(0, idx)
  return text.replace(/\n+/g, ' ').replace(/\s*---\s*$/, '').trim()
}

function sectionMarkdown(section) {
  const prose = proseBeforeTextBlock(section)
  const block = section.match(/```text\n([\s\S]*?)```/)?.[1]
  if (!block) return prose
  const bullets = block
    .trim()
    .split('\n')
    .map((l) => l.trim().replace(/;+$/, ''))
    .filter(Boolean)
    .map((l) => `- ${l}`)
    .join('\n')
  return [prose, bullets].filter(Boolean).join('\n\n')
}

function parseContrastPairs(section) {
  const pairs = []
  const chunks = section.split(/^## \d+\.\d+\.\s+/m).filter(Boolean)
  for (const chunk of chunks) {
    const title = chunk.split('\n')[0].trim()
    const leftCtx = chunk.match(/\*\*(?:Контекст слева|Левый контекст):\*\*\s*(.+)/)?.[1]?.trim()
    const leftRead = chunk.match(/\*\*Чтение слева:\*\*\s*(.+)/)?.[1]?.trim()
    const rightCtx = chunk.match(/\*\*(?:Контекст справа|Правый контекст):\*\*\s*(.+)/)?.[1]?.trim()
    const rightRead = chunk.match(/\*\*Чтение справа:\*\*\s*(.+)/)?.[1]?.trim()
    const why = chunk.match(/\*\*Почему это важно:\*\*\s*(.+)/)?.[1]?.trim()
    if (!title) continue
    pairs.push({
      contrast_context: title,
      how_it_would_read: rightRead
        ? `${rightCtx ? `${rightCtx}: ` : ''}${rightRead}`
        : rightCtx ?? '',
      why_current_context_is_different: leftRead
        ? `${leftCtx ? `${leftCtx}: ` : ''}${leftRead}${why ? ` ${why}` : ''}`
        : why ?? leftCtx ?? '',
    })
  }
  return pairs
}

function buildBaseMarkdown(content, baseStart, proStart) {
  const base = sectionBetween(content, baseStart, proStart)
  const lines = []
  const parts = base.split(/^## /m).filter(Boolean)
  for (const part of parts) {
    const heading = part.split('\n')[0].trim()
    const body = part.slice(part.indexOf('\n') + 1).trim()
    if (!heading || heading.startsWith('2.1.')) {
      const title = body.match(/\*\*(.+?)\*\*/)?.[1]
      if (title) lines.push(`## ${title}`, '')
      continue
    }
    const label = heading.replace(/^2\.\d+\.\s*/, '')
    if (label === 'Заголовок') continue
    lines.push(`## ${label}`, '')
    const textIdx = body.indexOf('```text')
    if (textIdx !== -1) {
      const prose = body.slice(0, textIdx).trim()
      if (prose) lines.push(prose, '')
      const block = body.match(/```text\n([\s\S]*?)```/)?.[1]
      if (block) {
        for (const line of block.trim().split('\n')) {
          lines.push(`- ${line.trim()}`)
        }
        lines.push('')
      }
    } else {
      lines.push(body, '')
    }
  }
  return lines.join('\n').trim()
}

function buildProMarkdown(content, proStart, hintsStart) {
  const pro = sectionBetween(content, proStart, hintsStart)
  const lines = []
  const parts = pro.split(/^## /m).filter(Boolean)
  for (const part of parts) {
    const heading = part.split('\n')[0].trim()
    const body = part.slice(part.indexOf('\n') + 1).trim()
    if (heading.startsWith('3.1.')) {
      const title = body.match(/\*\*(.+?)\*\*/)?.[1]
      if (title) lines.push(`## ${title}`, '')
      continue
    }
    const label = heading.replace(/^3\.\d+\.\s*/, '')
    if (label === 'Название в интерфейсе') continue
    lines.push(`## ${label}`, '')
    const textIdx = body.indexOf('```text')
    if (textIdx !== -1) {
      const prose = body.slice(0, textIdx).trim()
      if (prose) lines.push(prose, '')
      const block = body.match(/```text\n([\s\S]*?)```/)?.[1]
      if (block) {
        for (const line of block.trim().split('\n')) {
          lines.push(`- ${line.trim()}`)
        }
        lines.push('')
      }
    } else {
      lines.push(body, '')
    }
  }
  return lines.join('\n').trim()
}

function convertProjector() {
  const md = readFileSync(join(sourceDir, 'type_projector.md'), 'utf8')
  const talentHints = textBlockToArray(
    extractTextBlock(md, '## 4.1. Подсказки по талантам', '## 4.2.'),
  )
  const riskHints = textBlockToArray(
    extractTextBlock(md, '## 4.2. Подсказки по рискам', '## 4.3.'),
  )
  const managementHints = textBlockToArray(
    extractTextBlock(md, '## 4.3. Подсказки для управления', '## 4.4.'),
  )
  const environmentHints = textBlockToArray(
    extractTextBlock(md, '## 4.4. Подсказки по среде', '## 4.5.'),
  )
  const developmentHints = textBlockToArray(
    extractTextBlock(md, '## 4.5. Подсказки по развитию', '## 4.6.'),
  )
  const communicationHints = textBlockToArray(
    extractTextBlock(md, '## 4.6. Подсказки по коммуникации', '# 5.'),
  )
  const limitations = textBlockToArray(extractTextBlock(md, '# 8. Ограничения', '# 9.'))
  const primaryContext = textBlockToArray(
    extractTextBlock(md, '## 5.1. Основной контекст', '## 5.2.'),
  )
  const secondaryContext = textBlockToArray(
    extractTextBlock(md, '## 5.2. Дополнительный контекст', '## 5.3.'),
  )
  const relatedKinds = textBlockToArray(
    extractTextBlock(md, '## 5.4. Связанные типы элементов', '## 5.5.'),
  )
  const warningSignals = textBlockToArray(
    extractTextBlock(md, '## 6.3. Предупреждающие сигналы', '## 6.4.'),
  )
  const recoveryConditions = textBlockToArray(
    extractTextBlock(md, '## 6.4. Условия восстановления', '# 7.'),
  )
  const contrastSection = sectionBetween(md, '# 7. Контрастные пары', '# 8.')
  const contrastExamples = parseContrastPairs(contrastSection)

  const baseSection = sectionBetween(md, '# 2. Пользовательский Base', '# 3.')
  const plainMeaning = proseBeforeTextBlock(
    sectionBetween(baseSection, '## 2.2. Краткая суть', '## 2.3.'),
  )
  const workManifestation = [
    proseBeforeTextBlock(sectionBetween(baseSection, '## 2.3. Как это проявляется в работе', '## 2.4.')),
    extractTextBlock(baseSection, '## 2.3. Как это проявляется в работе', '## 2.4.')
      .split('\n')
      .filter(Boolean)
      .slice(0, 5)
      .join('; '),
  ]
    .filter(Boolean)
    .join(' ')

  const healthyBlock = extractTextBlock(baseSection, '## 2.4. Здоровое проявление', '## 2.5.')
  const distortedBlock = extractTextBlock(baseSection, '## 2.5. Искажённое проявление', '## 2.6.')

  const proSection = sectionBetween(md, '# 3. Пользовательский Pro', '# 4.')
  const hdMeaning = sectionMarkdown(
    sectionBetween(proSection, '## 3.2. Технический смысл', '## 3.3.'),
  )
  const mechanics = proseBeforeTextBlock(
    sectionBetween(proSection, '## 3.3. Механика', '## 3.4.'),
  )
  const notSelfBase = proseBeforeTextBlock(
    sectionBetween(md, '## 6.1. Искажение в Base', '## 6.2.'),
  )
  const notSelfProSection = sectionBetween(md, '## 6.2. Проявление через Ложное Я в Pro', '## 6.3.')
  const notSelfPro = [
    'Проявление через Ложное Я у Проектора часто связано с горечью, раздражением, ощущением невидимости и попыткой доказать ценность через некорректную нагрузку.',
    textBlockToArray(
      extractTextBlock(notSelfProSection, 'Горечь появляется, когда Проектор:', '## 6.3.'),
    ).join('; '),
  ]
    .filter(Boolean)
    .join(' ')

  const allowedUses = textBlockToArray(
    extractTextBlock(md, '## 9.1. Разрешённые способы использования', '## 9.2.'),
  )
  const forbiddenUses = textBlockToArray(
    extractTextBlock(md, '## 9.2. Запрещённые способы использования', '## 9.3.'),
  )
  const preferredLayers = textBlockToArray(
    extractTextBlock(md, '## 9.3. Приоритетные слои', '## 9.4.'),
  )
  const aiMustCheck = textBlockToArray(
    extractTextBlock(md, '## 9.5. Что AI должен проверить', '# 10.'),
  )

  return {
    element_kind: 'type',
    element_key: 'projector',
    element_label: 'Проектор',
    language: 'ru',
    version: 'v1',
    source_quality: 'expert_draft',
    classic_markdown: hdMeaning,
    hr_translation_markdown: buildBaseMarkdown(md, '# 2. Пользовательский Base', '# 3.'),
    pro_markdown: buildProMarkdown(md, '# 3. Пользовательский Pro', '# 4.'),
    talent_hints: talentHints,
    risk_hints: riskHints,
    management_hints: managementHints,
    environment_hints: environmentHints,
    limitations,
    base_layers: {
      title: 'Точный навигатор',
      base_label: 'Точный навигатор',
      plain_meaning: plainMeaning,
      work_manifestation: workManifestation,
      healthy_expression: proseBeforeTextBlock(
        sectionBetween(baseSection, '## 2.4. Здоровое проявление', '## 2.5.'),
      ),
      distorted_expression: proseBeforeTextBlock(
        sectionBetween(baseSection, '## 2.5. Искажённое проявление', '## 2.6.'),
      ),
      strengths: textBlockToArray(healthyBlock).join('; '),
      risks: textBlockToArray(distortedBlock).join('; '),
      when_it_works_best: proseBeforeTextBlock(
        sectionBetween(baseSection, '## 2.6. Как использовать этот талант', '## 2.7.'),
      ),
      when_talent_is_not_revealed: distortedBlock,
      development_hints: developmentHints,
      communication_hints: communicationHints,
      reality_check: extractTextBlock(baseSection, '## 2.7. Что проверить в реальности', '## 2.8.'),
      important_note: proseBeforeTextBlock(
        sectionBetween(baseSection, '## 2.8. Важное уточнение', '# 3.'),
      ),
    },
    pro_layers: {
      hd_meaning: hdMeaning,
      mechanics,
      classical_keywords: [
        'invitation',
        'recognition',
        'guidance',
        'success',
        'bitterness',
        'projector',
      ],
      source_logic: 'Тип берётся из определённых центров и каналов карты; для Projector Sacral не определён.',
      pro_not_self:
        'Проявление через Ложное Я у Проектора часто связано с горечью, раздражением, ощущением невидимости и попыткой доказать ценность через некорректную нагрузку.',
      role_in_chart: proseBeforeTextBlock(
        sectionBetween(proSection, '## 3.4. Роль в карте', '## 3.5.'),
      ),
      contextual_reading: extractTextBlock(proSection, '## 3.5. Контекстное чтение', '## 3.6.'),
      correct_expression: extractTextBlock(proSection, '## 3.6. Корректное проявление', '## 3.7.'),
      not_self_expression: extractTextBlock(proSection, '## 3.7. Проявление через Ложное Я', '## 3.8.'),
      interpretation_limitations: extractTextBlock(proSection, '## 3.8. Ограничения интерпретации', '# 4.'),
      card_metadata: {
        editorial_version: 'v0.1.1',
        status: 'approved_with_editorial_cleanup',
        ui_base_label: 'Точный навигатор',
        ui_pro_label: 'Тип · Проектор',
        primary_layer_key: 'work_mode_and_entry',
        used_in_layers: [
          'work_mode_and_entry',
          'decision_and_stability',
          'main_talents',
          'communication_and_influence',
          'risks_and_distortions',
          'management_and_environment',
          'development_potential',
          'pro_foundation',
        ],
        source_file: 'supabase/reference/element_cards/source/type_projector.md',
      },
      ai_source_rules: {
        allowed_uses: allowedUses,
        forbidden_uses: forbiddenUses,
        preferred_layers: preferredLayers,
        source_priority: 'primary',
        ai_must_check: aiMustCheck,
      },
      source_chip: {
        base_label: 'Точный навигатор',
        pro_label: 'Тип · Проектор',
        short_role:
          'Задаёт базовую механику участия в работе: точность наблюдения, признанная роль и экспертное влияние.',
        link_target: 'element://type/projector',
      },
    },
    context_rules: {
      primary_context: primaryContext,
      secondary_context: secondaryContext,
      depends_on:
        'Значение type/projector зависит от сочетания с другими элементами карты. Сам по себе тип показывает базовую механику участия в работе.',
      related_element_kinds: relatedKinds,
      context_note:
        'type/projector — сильный глобальный фильтр для чтения карты. Он должен участвовать почти во всех HR-слоях.',
    },
    not_self_layers: {
      base: notSelfBase,
      pro: notSelfPro,
      warning_signals: warningSignals,
      recovery_conditions: recoveryConditions,
    },
    contrast_examples: contrastExamples,
  }
}

function buildStrategyBaseMarkdown(content) {
  const base = sectionBetween(content, '# 1. Пользовательский Base', '# 2.')
  const lines = []
  const parts = base.split(/^## /m).filter(Boolean)
  for (const part of parts) {
    const heading = part.split('\n')[0].trim()
    const body = part.slice(part.indexOf('\n') + 1).trim()
    if (heading === 'Название') {
      const title = body.trim()
      lines.push(`## ${title}`, '')
      continue
    }
    lines.push(`## ${heading}`, '')
    const textIdx = body.indexOf('```text')
    if (textIdx !== -1) {
      const prose = body.slice(0, textIdx).trim()
      if (prose) lines.push(prose, '')
      const block = body.match(/```text\n([\s\S]*?)```/)?.[1]
      if (block) {
        for (const line of block.trim().split('\n')) {
          lines.push(`- ${line.trim()}`)
        }
        lines.push('')
      }
    } else {
      lines.push(body, '')
    }
  }
  return lines.join('\n').trim()
}

function buildStrategyProMarkdown(content) {
  const pro = sectionBetween(content, '# 2. Пользовательский Pro', '# 3.')
  const lines = []
  const parts = pro.split(/^## /m).filter(Boolean)
  for (const part of parts) {
    const heading = part.split('\n')[0].trim()
    const body = part.slice(part.indexOf('\n') + 1).trim()
    lines.push(`## ${heading}`, '')
    const textIdx = body.indexOf('```text')
    if (textIdx !== -1) {
      const prose = body.slice(0, textIdx).trim()
      if (prose) lines.push(prose, '')
      const block = body.match(/```text\n([\s\S]*?)```/)?.[1]
      if (block) {
        for (const line of block.trim().split('\n')) {
          lines.push(`- ${line.trim()}`)
        }
        lines.push('')
      }
    } else {
      lines.push(body, '')
    }
  }
  return lines.join('\n').trim()
}

function convertStrategy() {
  const md = readFileSync(join(sourceDir, 'strategy_wait_for_the_invitation.md'), 'utf8')
  const baseSection = sectionBetween(md, '# 1. Пользовательский Base', '# 2.')
  const proSection = sectionBetween(md, '# 2. Пользовательский Pro', '# 3.')

  const talentHints = textBlockToArray(
    extractTextBlock(md, '## Подсказки по талантам', '## Подсказки по рискам'),
  )
  const riskHints = textBlockToArray(
    extractTextBlock(md, '## Подсказки по рискам', '## Подсказки для управления'),
  )
  const managementHints = textBlockToArray(
    extractTextBlock(md, '## Подсказки для управления', '## Подсказки по среде'),
  )
  const environmentHints = textBlockToArray(
    extractTextBlock(md, '## Подсказки по среде', '## Подсказки по развитию'),
  )
  const developmentHints = textBlockToArray(
    extractTextBlock(md, '## Подсказки по развитию', '## Подсказки по коммуникации'),
  )
  const communicationHints = textBlockToArray(
    extractTextBlock(md, '## Подсказки по коммуникации', '# 4.'),
  )
  const limitations = textBlockToArray(extractTextBlock(md, '# 7. Ограничения', '# 8.'))
  const primaryContext = textBlockToArray(
    extractTextBlock(md, '## Основной контекст', '## Дополнительный контекст'),
  )
  const secondaryContext = textBlockToArray(
    extractTextBlock(md, '## Дополнительный контекст', '## От чего зависит чтение'),
  )
  const relatedKinds = textBlockToArray(
    extractTextBlock(md, '## Связанные типы элементов', '## Контекстное примечание'),
  )
  const warningSignals = textBlockToArray(
    extractTextBlock(md, '## Предупреждающие сигналы', '## Условия восстановления'),
  )
  const recoveryConditions = textBlockToArray(
    extractTextBlock(md, '## Условия восстановления', '# 6.'),
  )
  const contrastSection = sectionBetween(md, '# 6. Контрастные пары', '# 7.')
  const contrastExamples = parseContrastPairs(contrastSection)

  const plainMeaning = proseBeforeTextBlock(
    sectionBetween(baseSection, '## Короткая суть', '## Как проявляется'),
  )
  const healthyBlock = extractTextBlock(baseSection, '## Здоровое проявление', '## Искажённое проявление')
  const distortedBlock = extractTextBlock(baseSection, '## Искажённое проявление', '## Как использовать')

  const hdMeaning = sectionMarkdown(
    sectionBetween(proSection, '## Технический смысл', '## Механика'),
  )
  const mechanics = proseBeforeTextBlock(
    sectionBetween(proSection, '## Механика', '## Роль в карте'),
  )
  const notSelfBase = proseBeforeTextBlock(
    sectionBetween(md, '## Искажение в Base', '## Проявление Ложного Я в Pro'),
  )
  const notSelfProSection = sectionBetween(
    md,
    '## Проявление Ложного Я в Pro',
    '## Предупреждающие сигналы',
  )
  const notSelfPro = [
    proseBeforeTextBlock(notSelfProSection.split('Основные механизмы:')[0]),
    textBlockToArray(
      extractTextBlock(notSelfProSection, 'Основные механизмы:', '## Предупреждающие'),
    ).join('; '),
  ]
    .filter(Boolean)
    .join(' ')

  const allowedUses = textBlockToArray(extractTextBlock(md, '## Allowed uses', '## Forbidden uses'))
  const forbiddenUses = textBlockToArray(
    extractTextBlock(md, '## Forbidden uses', '## Preferred layers'),
  )
  const preferredLayers = textBlockToArray(
    extractTextBlock(md, '## Preferred layers', '## Source priority'),
  )
  const aiMustCheck = textBlockToArray(extractTextBlock(md, '## AI must check', '# 9.'))

  return {
    element_kind: 'strategy',
    element_key: 'wait_for_the_invitation',
    element_label: 'Ждать приглашения',
    language: 'ru',
    version: 'v1',
    source_quality: 'expert_draft',
    classic_markdown: hdMeaning,
    hr_translation_markdown: buildStrategyBaseMarkdown(md),
    pro_markdown: buildStrategyProMarkdown(md),
    talent_hints: talentHints,
    risk_hints: riskHints,
    management_hints: managementHints,
    environment_hints: environmentHints,
    limitations,
    base_layers: {
      title: 'Ясный вход в роль',
      base_label: 'Ясный вход в роль',
      plain_meaning: plainMeaning,
      work_manifestation: proseBeforeTextBlock(
        sectionBetween(baseSection, '## Как проявляется в работе', '## Здоровое проявление'),
      ),
      healthy_expression: proseBeforeTextBlock(
        sectionBetween(baseSection, '## Здоровое проявление', '## Искажённое проявление'),
      ),
      distorted_expression: proseBeforeTextBlock(
        sectionBetween(baseSection, '## Искажённое проявление', '## Как использовать'),
      ),
      strengths: textBlockToArray(healthyBlock).join('; '),
      risks: textBlockToArray(distortedBlock).join('; '),
      when_it_works_best: proseBeforeTextBlock(
        sectionBetween(baseSection, '## Как использовать', '## Что проверить в реальности'),
      ),
      when_talent_is_not_revealed: distortedBlock,
      development_hints: developmentHints,
      communication_hints: communicationHints,
      reality_check: extractTextBlock(baseSection, '## Что проверить в реальности', '## Важное примечание'),
      important_note: proseBeforeTextBlock(
        sectionBetween(baseSection, '## Важное примечание', '# 2.'),
      ),
    },
    pro_layers: {
      hd_meaning: hdMeaning,
      mechanics,
      classical_keywords: ['invitation', 'recognition', 'wait for the invitation', 'projector strategy'],
      source_logic: 'Стратегия выводится из типа карты (Projector).',
      pro_not_self: notSelfPro,
      role_in_chart: proseBeforeTextBlock(
        sectionBetween(proSection, '## Роль в карте', '## Контекстное чтение'),
      ),
      contextual_reading: extractTextBlock(proSection, '## Контекстное чтение', '## Корректное проявление'),
      correct_expression: extractTextBlock(proSection, '## Корректное проявление', '## Проявление Ложного Я'),
      not_self_expression: extractTextBlock(proSection, '## Проявление Ложного Я', '## Ограничения интерпретации'),
      interpretation_limitations: extractTextBlock(
        proSection,
        '## Ограничения интерпретации',
        '# 3.',
      ),
      card_metadata: {
        editorial_version: 'v0.1',
        status: 'approved_after_minor_editorial_patch',
        ui_base_label: 'Ясный вход в роль',
        ui_pro_label: 'Стратегия · Ждать приглашения',
        primary_layer_key: 'work_mode_and_entry',
        used_in_layers: [
          'work_mode_and_entry',
          'decision_and_stability',
          'management_and_environment',
          'risks_and_distortions',
          'communication_and_influence',
          'development_potential',
          'pro_foundation',
        ],
        source_file:
          'supabase/reference/element_cards/source/strategy_wait_for_the_invitation.md',
      },
      ai_source_rules: {
        allowed_uses: allowedUses,
        forbidden_uses: forbiddenUses,
        preferred_layers: preferredLayers,
        source_priority: 'primary',
        ai_must_check: aiMustCheck,
      },
      source_chip: {
        base_label: 'Ясный вход в роль',
        pro_label: 'Стратегия · Ждать приглашения',
        short_role:
          'Показывает, как человеку лучше входить в значимые задачи, роли и зоны влияния.',
        link_target: 'element://strategy/wait_for_the_invitation',
      },
    },
    context_rules: {
      primary_context: primaryContext,
      secondary_context: secondaryContext,
      depends_on:
        'Значение стратегии зависит от типа, авторитета, роли, уровня признания, управленческой среды и реального контекста задачи.',
      related_element_kinds: relatedKinds,
      context_note:
        'strategy/wait_for_the_invitation особенно важна в слоях, связанных с рабочим входом, управлением, коммуникацией, рисками и условиями раскрытия.',
    },
    not_self_layers: {
      base: notSelfBase,
      pro: notSelfPro,
      warning_signals: warningSignals,
      recovery_conditions: recoveryConditions,
    },
    contrast_examples: contrastExamples,
  }
}

const projector = convertProjector()
const strategy = convertStrategy()

writeFileSync(join(outDir, 'type_projector.v1.json'), JSON.stringify(projector, null, 2) + '\n', 'utf8')
writeFileSync(
  join(outDir, 'strategy_wait_for_the_invitation.v1.json'),
  JSON.stringify(strategy, null, 2) + '\n',
  'utf8',
)

console.log('Wrote type_projector.v1.json')
console.log('Wrote strategy_wait_for_the_invitation.v1.json')
console.log('authority_splenic: use approved supabase/reference/element_cards/authority_splenic.v1.json')
console.log('projector hr starts:', projector.hr_translation_markdown.slice(0, 80))
console.log('projector pro starts:', projector.pro_markdown.slice(0, 80))
console.log('projector limitations:', projector.limitations.length)
console.log('projector contrast:', projector.contrast_examples.length)
console.log('strategy limitations:', strategy.limitations.length)
console.log('strategy contrast:', strategy.contrast_examples.length)
