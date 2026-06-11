/**
 * One-off: approved channel/28-38 Element Card MD → channel_28_38.v1.json
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const mdPath = join(root, 'supabase/reference/element_cards/source/channel_28_38.md')
const outPath = join(root, 'supabase/reference/element_cards/channel_28_38.v1.json')

function sectionBetween(content, startHeading, endHeading) {
  const start = content.indexOf(startHeading)
  if (start === -1) return ''
  const from = start + startHeading.length
  const rest = content.slice(from)
  const end = rest.indexOf(endHeading)
  return (end === -1 ? rest : rest.slice(0, end)).trim()
}

function extractTextBlock(content, startMarker, endMarker) {
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

function textBlockToArray(block) {
  if (!block) return []
  return block
    .split('\n')
    .map((l) => l.trim().replace(/;+$/, ''))
    .filter(Boolean)
}

function proseBeforeTextBlock(section) {
  const idx = section.indexOf('```')
  const text = idx === -1 ? section : section.slice(0, idx)
  return text.replace(/\n+/g, ' ').replace(/\s*---\s*$/, '').trim()
}

function subsectionProse(section, heading) {
  const marker = `### ${heading}`
  const start = section.indexOf(marker)
  if (start === -1) return ''
  const from = start + marker.length
  const rest = section.slice(from)
  const next = rest.search(/\n### |\n## /)
  const slice = next === -1 ? rest : rest.slice(0, next)
  return proseBeforeTextBlock(slice.trim())
}

function parseContrastPairs2838(section) {
  const pairs = []
  const chunks = section.split(/^### \d+\.\s+/m).filter(Boolean)
  for (const chunk of chunks) {
    const title = chunk.split('\n')[0].trim()
    const leftCtx = chunk.match(/left_context = (.+)/)?.[1]?.trim()
    const leftRead = chunk.match(/left_reading = (.+)/)?.[1]?.trim()
    const rightCtx = chunk.match(/right_context = (.+)/)?.[1]?.trim()
    const rightRead = chunk.match(/right_reading = (.+)/)?.[1]?.trim()
    const why = chunk.match(/why_it_matters = (.+)/)?.[1]?.trim()
    if (!title) continue
    pairs.push({
      contrast_context: title,
      how_it_would_read: rightRead
        ? `${rightCtx ? `${rightCtx} ` : ''}${rightRead}`.trim()
        : rightCtx ?? '',
      why_current_context_is_different: [leftCtx, leftRead, why].filter(Boolean).join(' '),
    })
  }
  return pairs
}

function buildBaseMarkdown(baseSection) {
  const title = 'Упорство ради смысла'
  const lines = [`## ${title}`, '']
  const sections = [
    ['Короткая суть', 'plain'],
    ['Как проявляется в работе', 'bullets'],
    ['Здоровое проявление', 'mixed'],
    ['Искажённое проявление', 'bullets'],
    ['Как использовать в работе', 'prose'],
    ['Что проверить в реальности', 'bullets'],
    ['Важное ограничение', 'prose'],
  ]
  for (const [heading, kind] of sections) {
    const marker = `### ${heading}`
    const start = baseSection.indexOf(marker)
    if (start === -1) continue
    const from = start + marker.length
    const rest = baseSection.slice(from)
    const next = rest.search(/\n### |\n## /)
    const slice = (next === -1 ? rest : rest.slice(0, next)).trim()
    lines.push(`## ${heading}`, '')
    if (kind === 'bullets') {
      const prose = proseBeforeTextBlock(slice)
      if (prose) lines.push(prose, '')
      for (const line of slice.split('\n').filter((l) => l.trim().startsWith('-'))) {
        lines.push(line.trim())
      }
      lines.push('')
    } else if (kind === 'mixed') {
      const prose = proseBeforeTextBlock(slice)
      if (prose) lines.push(prose, '')
      for (const line of slice.split('\n').filter((l) => l.trim().startsWith('-'))) {
        lines.push(line.trim())
      }
      lines.push('')
    } else {
      lines.push(slice.replace(/\n+/g, '\n\n'), '')
    }
  }
  return lines.join('\n').trim()
}

function buildProMarkdown(proSection) {
  const lines = ['## Канал 28–38 · Борьба за смысл', '']
  const map = [
    ['Technical meaning', 'Техническое значение'],
    ['Mechanics', 'Механика'],
    ['Role in chart', 'Роль в карте'],
    ['Contextual reading', 'Контекстное чтение'],
    ['Correct expression', 'Корректное проявление'],
    ['Not-Self expression', 'Not-Self проявление'],
    ['Interpretation limits', 'Ограничения интерпретации'],
  ]
  for (const [en, ru] of map) {
    const marker = `### ${en}`
    const start = proSection.indexOf(marker)
    if (start === -1) continue
    const from = start + marker.length
    const rest = proSection.slice(from)
    const next = rest.search(/\n### |\n## /)
    const slice = (next === -1 ? rest : rest.slice(0, next)).trim()
    lines.push(`## ${ru}`, '')
    const block = slice.match(/```text\n([\s\S]*?)```/)?.[1]
    if (block) {
      for (const line of block.trim().split('\n')) {
        lines.push(`- ${line.trim()}`)
      }
    } else {
      lines.push(slice, '')
    }
    lines.push('')
  }
  return lines.join('\n').trim()
}

const md = readFileSync(mdPath, 'utf8')
const baseSection = sectionBetween(md, '## 6. User-facing Base', '## 7. User-facing Pro')
const proSection = sectionBetween(md, '## 7. User-facing Pro', '## 8. Hints')

const plainMeaning = subsectionProse(baseSection, 'Короткая суть')
const workSection = sectionBetween(baseSection, '### Как проявляется в работе', '### Здоровое проявление')
const workBullets = workSection
  .split('\n')
  .filter((l) => l.trim().startsWith('-'))
  .map((l) => l.trim().replace(/^-\s*/, '').replace(/;+$/, ''))
const workProse = proseBeforeTextBlock(workSection)

const healthySection = sectionBetween(baseSection, '### Здоровое проявление', '### Искажённое проявление')
const healthyProse = proseBeforeTextBlock(healthySection)
const healthyBullets = healthySection
  .split('\n')
  .filter((l) => l.trim().startsWith('-'))
  .map((l) => l.trim().replace(/^-\s*/, '').replace(/;+$/, ''))

const distortedSection = sectionBetween(baseSection, '### Искажённое проявление', '### Как использовать в работе')
const distortedProse = proseBeforeTextBlock(distortedSection)
const distortedBullets = distortedSection
  .split('\n')
  .filter((l) => l.trim().startsWith('-'))
  .map((l) => l.trim().replace(/^-\s*/, '').replace(/;+$/, ''))

const mechanicsBlock = extractTextBlock(proSection, '### Mechanics', '### Role in chart')
const technicalBlock = extractTextBlock(proSection, '### Technical meaning', '### Mechanics')

const classicMarkdown = [
  'В классической Human Design-логике канал 28–38 известен как **Channel of Struggle** — Канал Борьбы, или **Design of Stubbornness**.',
  '',
  'Канал соединяет **Root Center** (Gate 38) и **Spleen Center** (Gate 28). Gate 38 даёт давление бороться за то, что имеет значение. Gate 28 в Spleen Center добавляет инстинктивное распознавание риска, своевременности и живой значимости.',
  '',
  'Вместе это создаёт устойчивую механику: давление найти то, что действительно имеет значение → инстинктивное распознавание риска и своевременности → готовность держаться за важное → способность проходить сопротивление ради живого смысла.',
  '',
  'Технически это **projected channel** в контексте Individual / Knowing Circuit. Корректность участия в борьбе должна проверяться через Strategy и Authority всей карты.',
].join('\n')

const card = {
  element_kind: 'channel',
  element_key: '28-38',
  element_label: 'Channel 28-38',
  language: 'ru',
  version: 'v1',
  source_quality: 'expert_draft',
  classic_markdown: classicMarkdown,
  hr_translation_markdown: buildBaseMarkdown(baseSection),
  pro_markdown: buildProMarkdown(proSection),
  talent_hints: textBlockToArray(extractTextBlock(md, '### talent_hints', '### risk_hints')),
  risk_hints: textBlockToArray(extractTextBlock(md, '### risk_hints', '### management_hints')),
  management_hints: textBlockToArray(extractTextBlock(md, '### management_hints', '### environment_hints')),
  environment_hints: textBlockToArray(extractTextBlock(md, '### environment_hints', '### development_hints')),
  limitations: textBlockToArray(extractTextBlock(md, '## 12. Limitations', '## 13. AI-source rules')),
  base_layers: {
    title: 'Упорство ради смысла',
    base_label: 'Упорство ради смысла',
    plain_meaning: plainMeaning,
    work_manifestation: [workProse, workBullets.join('; ')].filter(Boolean).join(' '),
    healthy_expression: [healthyProse, healthyBullets.join('; ')].filter(Boolean).join(' '),
    distorted_expression: distortedProse,
    strengths: healthyBullets.join('; '),
    risks: distortedBullets.join('; '),
    when_it_works_best: subsectionProse(baseSection, 'Как использовать в работе'),
    when_talent_is_not_revealed: distortedBullets.join(';\n'),
    development_hints: textBlockToArray(extractTextBlock(md, '### development_hints', '### communication_hints')),
    communication_hints: textBlockToArray(extractTextBlock(md, '### communication_hints', '## 9. Context rules')),
    reality_check: (() => {
      const section = sectionBetween(baseSection, '### Что проверить в реальности', '### Важное ограничение')
      return section
        .split('\n')
        .filter((l) => l.trim().startsWith('-'))
        .map((l) => l.trim().replace(/^-\s*/, '').replace(/;+$/, ''))
        .join(';\n')
    })(),
    important_note: subsectionProse(baseSection, 'Важное ограничение'),
  },
  pro_layers: {
    hd_meaning:
      'Канал 28–38 (Channel of Struggle, Design of Stubbornness) соединяет Gate 38 в Root Center и Gate 28 в Spleen Center. Gate 38 даёт давление бороться за то, что имеет значение. Gate 28 добавляет инстинктивное распознавание риска, своевременности и живой значимости.',
    mechanics: proseBeforeTextBlock(sectionBetween(proSection, '### Mechanics', '### Role in chart')) +
      (mechanicsBlock ? `\n\n${mechanicsBlock.split('\n').join(' → ')}` : ''),
    classical_keywords: textBlockToArray(technicalBlock),
    source_logic:
      'channel/28-38 describes a full channel connecting Root and Spleen through gates 38 and 28. The person has a stable mechanism for finding meaningful struggle, recognizing whether a fight is worth the energy, and holding onto what truly matters. As a projected channel in Individual / Knowing Circuit context, correct participation should be verified through Strategy and Authority.',
    pro_not_self: proseBeforeTextBlock(sectionBetween(md, '### pro', '### warning_signals')),
    role_in_chart: proseBeforeTextBlock(sectionBetween(proSection, '### Role in chart', '### Contextual reading')),
    contextual_reading: extractTextBlock(proSection, '### Contextual reading', '### Correct expression')
      .split('\n')
      .filter(Boolean)
      .map((l) => l.replace(/^-\s*/, '').trim())
      .join(';\n'),
    correct_expression: (() => {
      const section = sectionBetween(proSection, '### Correct expression', '### Not-Self expression')
      return section
        .split('\n')
        .filter((l) => l.trim().startsWith('-'))
        .map((l) => l.trim().replace(/^-\s*/, '').replace(/;+$/, ''))
        .join(';\n')
    })(),
    not_self_expression: (() => {
      const section = sectionBetween(proSection, '### Not-Self expression', '### Interpretation limits')
      return section
        .split('\n')
        .filter((l) => l.trim().startsWith('-'))
        .map((l) => l.trim().replace(/^-\s*/, '').replace(/;+$/, ''))
        .join(';\n')
    })(),
    interpretation_limitations: proseBeforeTextBlock(sectionBetween(proSection, '### Interpretation limits', '## 8. Hints')),
    card_metadata: {
      editorial_version: 'v0.1.1',
      status: 'approved_after_editorial_review',
      ui_base_label: 'Упорство ради смысла',
      ui_pro_label: 'Канал 28–38 · Борьба за смысл',
      primary_layer_key: 'work_style',
      used_in_layers: textBlockToArray(extractTextBlock(md, '### used_in_layers', '### layer_source_priority')),
      source_file: 'supabase/reference/element_cards/source/channel_28_38.md',
      methodology_note:
        'AI Digest из MD является методологической выжимкой для будущего layer-specific AI input, а не отдельным top-level runtime-полем. contrast_pairs из MD маппятся в contrast_examples.',
    },
    ai_source_rules: {
      allowed_uses: textBlockToArray(extractTextBlock(md, '### allowed_uses', '### forbidden_uses')),
      forbidden_uses: textBlockToArray(extractTextBlock(md, '### forbidden_uses', '### preferred_layers')),
      preferred_layers: textBlockToArray(extractTextBlock(md, '### preferred_layers', '### source_priority')),
      source_priority: 'primary for work_style, risks_and_distortions, development_potential',
      layer_source_priority: {
        work_style: 'primary',
        risks_and_distortions: 'primary',
        development_potential: 'primary',
        main_talents: 'supporting',
        decision_and_stability: 'supporting',
        management_and_environment: 'supporting',
        communication_and_influence: 'context_only',
        pro_foundation: 'context_only',
      },
      ai_must_check: textBlockToArray(extractTextBlock(md, '### ai_must_check', '## 14. Короткая формула карточки')),
    },
    source_chip: {
      base_label: 'Упорство ради смысла',
      pro_label: 'Канал 28–38 · Борьба за смысл',
      short_role:
        'Добавляет тему устойчивости в задачах, где человек видит настоящую значимость, и риск сопротивления задачам, которые ощущаются пустыми.',
      link_target: 'element://channel/28-38',
    },
  },
  context_rules: {
    primary_context: textBlockToArray(extractTextBlock(md, '### primary_context', '### secondary_context')),
    secondary_context: textBlockToArray(extractTextBlock(md, '### secondary_context', '### depends_on')),
    depends_on: extractTextBlock(md, '### depends_on', '### related_element_kinds').replace(/\n+/g, ' ').trim(),
    related_element_kinds: textBlockToArray(
      extractTextBlock(md, '### related_element_kinds', '### context_note'),
    ),
    context_note: proseBeforeTextBlock(sectionBetween(md, '### context_note', '## 10. Not-Self / distortion')),
  },
  not_self_layers: {
    base: proseBeforeTextBlock(sectionBetween(md, '### base', '### pro')),
    pro: proseBeforeTextBlock(sectionBetween(md, '### pro', '### warning_signals')),
    warning_signals: textBlockToArray(extractTextBlock(md, '### warning_signals', '### recovery_conditions')),
    recovery_conditions: textBlockToArray(
      extractTextBlock(md, '### recovery_conditions', '## 11. Contrast pairs'),
    ),
  },
  contrast_examples: parseContrastPairs2838(sectionBetween(md, '## 11. Contrast pairs', '## 12. Limitations')),
}

writeFileSync(outPath, JSON.stringify(card, null, 2) + '\n', 'utf8')
console.log('Wrote', outPath)
console.log('contrast_examples:', card.contrast_examples.length)
console.log('talent_hints:', card.talent_hints.length)
