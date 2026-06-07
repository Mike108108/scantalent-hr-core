/**
 * One-off: generate SQL migration from element card JSON files.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const cardsDir = join(root, 'supabase/reference/element_cards')

function sqlString(value) {
  if (value == null) return 'null'
  return `'${String(value).replace(/'/g, "''")}'`
}

function sqlJson(value) {
  return `'${JSON.stringify(value).replace(/'/g, "''")}'::jsonb`
}

function rowFromCard(card) {
  return `(
  ${sqlString(card.element_kind)},
  ${sqlString(card.element_key)},
  ${sqlString(card.element_label)},
  ${sqlString(card.language)},
  ${sqlString(card.version)},
  ${sqlString(card.classic_markdown)},
  ${sqlString(card.hr_translation_markdown)},
  ${sqlString(card.pro_markdown)},
  ${sqlJson(card.talent_hints)},
  ${sqlJson(card.risk_hints)},
  ${sqlJson(card.management_hints)},
  ${sqlJson(card.environment_hints)},
  ${sqlJson(card.limitations)},
  ${sqlJson(card.base_layers)},
  ${sqlJson(card.pro_layers)},
  ${sqlJson(card.context_rules)},
  ${sqlJson(card.not_self_layers)},
  ${sqlJson(card.contrast_examples)},
  ${sqlString(card.source_quality)}
)`
}

const MIGRATION_TARGETS = {
  'stage-4-e1-1': {
    header:
      '-- Stage 4-E1.1: Element Cards Storage — type/projector + strategy/wait_for_the_invitation',
    jsonFiles: ['type_projector.v1.json', 'strategy_wait_for_the_invitation.v1.json'],
    outFile: '202606070001_element_cards_storage_projector_strategy_v0_1.sql',
  },
  authority_splenic: {
    header: '-- Stage 4-E1.3: Element Card Storage — authority/splenic',
    jsonFiles: ['authority_splenic.v1.json'],
    outFile: '202606070002_element_card_authority_splenic_v0_1.sql',
  },
  profile_1_3: {
    header: '-- Stage 4-E1.5: Element Card Storage — profile/1/3',
    jsonFiles: ['profile_1_3.v1.json'],
    outFile: '202606070003_element_card_profile_1_3_v0_1.sql',
  },
  definition_split_definition: {
    header: '-- Stage 4-E1.7: Element Card Storage — definition/split_definition',
    jsonFiles: ['definition_split_definition.v1.json'],
    outFile: '202606070004_element_card_definition_split_definition_v0_1.sql',
  },
  open_center_sacral: {
    header: '-- Stage 4-E2.2: Element Card Storage — open_center/sacral',
    jsonFiles: ['open_center_sacral.v1.json'],
    outFile: '202606070005_element_card_open_center_sacral_v0_1.sql',
  },
  defined_center_spleen: {
    header: '-- Stage 4-E2.4: Element Card Storage — defined_center/spleen',
    jsonFiles: ['defined_center_spleen.v1.json'],
    outFile: '202606070006_element_card_defined_center_spleen_v0_1.sql',
  },
  defined_center_root: {
    header: '-- Stage 4-E2.6: Element Card Storage — defined_center/root',
    jsonFiles: ['defined_center_root.v1.json'],
    outFile: '202606070007_element_card_defined_center_root_v0_1.sql',
  },
  defined_center_ajna: {
    header: '-- Stage 4-E2.8: Element Card Storage — defined_center/ajna',
    jsonFiles: ['defined_center_ajna.v1.json'],
    outFile: '202606070008_element_card_defined_center_ajna_v0_1.sql',
  },
}

const targetKey = process.argv[2] ?? 'stage-4-e1-1'
const target = MIGRATION_TARGETS[targetKey]
if (!target) {
  console.error(`Unknown target: ${targetKey}`)
  console.error('Available:', Object.keys(MIGRATION_TARGETS).join(', '))
  process.exit(1)
}

const cards = target.jsonFiles.map((file) =>
  JSON.parse(readFileSync(join(cardsDir, file), 'utf8')),
)

const sql = `${target.header}
-- Approved expert_draft cards from supabase/reference/element_cards/*.v1.json
-- DB version stays v1; editorial versions live in pro_layers.card_metadata

insert into public.hd_reference_interpretations (
  element_kind, element_key, element_label, language, version,
  classic_markdown, hr_translation_markdown, pro_markdown,
  talent_hints, risk_hints, management_hints, environment_hints, limitations,
  base_layers, pro_layers, context_rules, not_self_layers, contrast_examples,
  source_quality
) values

${cards.map((c) => `-- ${c.element_kind}/${c.element_key}\n${rowFromCard(c)}`).join(',\n\n')}

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
`

const outPath = join(root, 'supabase/migrations', target.outFile)
writeFileSync(outPath, sql, 'utf8')
console.log('Wrote', outPath)
console.log('Size:', sql.length, 'bytes')
