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
  defined_center_throat: {
    header: '-- Stage 4-E2.10: Element Card Storage — defined_center/throat',
    jsonFiles: ['defined_center_throat.v1.json'],
    outFile: '202606080001_element_card_defined_center_throat_v0_1.sql',
  },
  open_center_g: {
    header: '-- Stage 4-E2.12: Element Card Storage — open_center/g',
    jsonFiles: ['open_center_g.v1.json'],
    outFile: '202606100001_element_card_open_center_g_v0_1.sql',
  },
  open_center_ego: {
    header: '-- Stage 4-E2.14: Element Card Storage — open_center/ego',
    jsonFiles: ['open_center_ego.v1.json'],
    outFile: '202606110001_element_card_open_center_ego_v0_1.sql',
  },
  open_center_head: {
    header: '-- Stage 4-E2.16: Element Card Storage — open_center/head',
    jsonFiles: ['open_center_head.v1.json'],
    outFile: '202606110002_element_card_open_center_head_v0_1.sql',
  },
  open_center_solar_plexus: {
    header: '-- Stage 4-E2.18: Element Card Storage — open_center/solar_plexus',
    jsonFiles: ['open_center_solar_plexus.v1.json'],
    outFile: '202606110003_element_card_open_center_solar_plexus_v0_1.sql',
  },
  channel_18_58: {
    header: '-- Stage 4-E3.2: Element Card Storage — channel/18-58',
    jsonFiles: ['channel_18_58.v1.json'],
    outFile: '202606110004_element_card_channel_18_58_v0_1.sql',
  },
  channel_11_56: {
    header: '-- Stage 4-E3.4: Element Card Storage — channel/11-56',
    jsonFiles: ['channel_11_56.v1.json'],
    outFile: '202606110005_element_card_channel_11_56_v0_1.sql',
  },
  channel_28_38: {
    header: '-- Stage 4-E3.6: Element Card Storage — channel/28-38',
    jsonFiles: ['channel_28_38.v1.json'],
    outFile: '202606110006_element_card_channel_28_38_v0_1.sql',
  },
  gate_58: {
    header: '-- Stage 4-E4.2: Element Card Storage — gate/58',
    jsonFiles: ['gate_58.v1.json'],
    outFile: '202606120007_element_card_gate_58_v0_1.sql',
  },
  gate_18: {
    header: '-- Stage 4-E4.4: Element Card Storage — gate/18',
    jsonFiles: ['gate_18.v1.json'],
    outFile: '202606120008_element_card_gate_18_v0_1.sql',
  },
  gate_28: {
    header: '-- Stage 4-E4.6: Element Card Storage — gate/28',
    jsonFiles: ['gate_28.v1.json'],
    outFile: '202606120009_element_card_gate_28_v0_1.sql',
  },
  gate_38: {
    header: '-- Stage 4-E4.8: Element Card Storage — gate/38',
    jsonFiles: ['gate_38.v1.json'],
    outFile: '202606120010_element_card_gate_38_v0_1.sql',
  },
  gate_48: {
    header: '-- Stage 4-E4.10: Element Card Storage — gate/48',
    jsonFiles: ['gate_48.v1.json'],
    outFile: '202606120011_element_card_gate_48_v0_1.sql',
  },
  gate_16: {
    header: '-- Stage 4-E4.12: Element Card Storage — gate/16',
    jsonFiles: ['gate_16.v1.json'],
    outFile: '202606120012_element_card_gate_16_v0_1.sql',
  },
  gate_56: {
    header: '-- Stage 4-E4.14: Element Card Storage — gate/56',
    jsonFiles: ['gate_56.v1.json'],
    outFile: '202606120013_element_card_gate_56_v0_1.sql',
  },
  gate_11: {
    header: '-- Stage 4-E4.16: Element Card Storage — gate/11',
    jsonFiles: ['gate_11.v1.json'],
    outFile: '202606120014_element_card_gate_11_v0_1.sql',
  },
  gate_43: {
    header: '-- Stage 4-E4.18: Element Card Storage — gate/43',
    jsonFiles: ['gate_43.v1.json'],
    outFile: '202606120015_element_card_gate_43_v0_1.sql',
  },
  gate_24: {
    header: '-- Stage 4-E4.20: Element Card Storage — gate/24',
    jsonFiles: ['gate_24.v1.json'],
    outFile: '202606120016_element_card_gate_24_v0_1.sql',
  },
  gate_17: {
    header: '-- Stage 4-E4.22: Element Card Storage — gate/17',
    jsonFiles: ['gate_17.v1.json'],
    outFile: '202606120017_element_card_gate_17_v0_1.sql',
  },
  gate_52: {
    header: '-- Stage 4-E4.24: Element Card Storage — gate/52',
    jsonFiles: ['gate_52.v1.json'],
    outFile: '202606150001_element_card_gate_52_v0_1.sql',
  },
  gate_54: {
    header: '-- Stage 4-E4.26: Element Card Storage — gate/54',
    jsonFiles: ['gate_54.v1.json'],
    outFile: '202606150002_element_card_gate_54_v0_1.sql',
  },
  gate_40: {
    header: '-- Stage 4-E4.28: Element Card Storage — gate/40',
    jsonFiles: ['gate_40.v1.json'],
    outFile: '202606150003_element_card_gate_40_v0_1.sql',
  },
  gate_6: {
    header: '-- Stage 4-E4.30: Element Card Storage — gate/6',
    jsonFiles: ['gate_6.v1.json'],
    outFile: '202606150004_element_card_gate_6_v0_1.sql',
  },
  gate_8: {
    header: '-- Stage 4-E4.32: Element Card Storage — gate/8',
    jsonFiles: ['gate_8.v1.json'],
    outFile: '202606150005_element_card_gate_8_v0_1.sql',
  },
  gate_10: {
    header: '-- Stage 4-E4.34: Element Card Storage — gate/10',
    jsonFiles: ['gate_10.v1.json'],
    outFile: '202606150006_element_card_gate_10_v0_1.sql',
  },
  gate_12: {
    header: '-- Stage 4-E4.36: Element Card Storage — gate/12',
    jsonFiles: ['gate_12.v1.json'],
    outFile: '202606150007_element_card_gate_12_v0_1.sql',
  },
  gate_13: {
    header: '-- Stage 4-E4.38: Element Card Storage — gate/13',
    jsonFiles: ['gate_13.v1.json'],
    outFile: '202606150008_element_card_gate_13_v0_1.sql',
  },
  gate_15: {
    header: '-- Stage 4-E4.40: Element Card Storage — gate/15',
    jsonFiles: ['gate_15.v1.json'],
    outFile: '202606150009_element_card_gate_15_v0_1.sql',
  },
  gate_19: {
    header: '-- Stage 4-E4.42: Element Card Storage — gate/19',
    jsonFiles: ['gate_19.v1.json'],
    outFile: '202606150010_element_card_gate_19_v0_1.sql',
  },
  gate_39: {
    header: '-- Stage 4-E4.44: Element Card Storage — gate/39',
    jsonFiles: ['gate_39.v1.json'],
    outFile: '202606150011_element_card_gate_39_v0_1.sql',
  },
  lines_1_6: {
    header: '-- Stage 4-E6.1-D: Element Card Storage — line/1 … line/6',
    jsonFiles: [
      'line_1.v1.json',
      'line_2.v1.json',
      'line_3.v1.json',
      'line_4.v1.json',
      'line_5.v1.json',
      'line_6.v1.json',
    ],
    outFile: '202606160001_element_cards_lines_1_6_v0_1.sql',
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
