#!/usr/bin/env python3
"""Generate SQL migration for line/1–6 element cards."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CARDS_DIR = ROOT / "supabase/reference/element_cards"
MIGRATIONS_DIR = ROOT / "supabase/migrations"
OUT_FILE = MIGRATIONS_DIR / "202606160001_element_cards_lines_1_6_v0_1.sql"
JSON_FILES = [f"line_{i}.v1.json" for i in range(1, 7)]


def sql_string(value):
    if value is None:
        return "null"
    return "'" + str(value).replace("'", "''") + "'"


def sql_json(value):
    return "'" + json.dumps(value, ensure_ascii=False).replace("'", "''") + "'::jsonb"


def row_from_card(card):
    return f"""(
  {sql_string(card['element_kind'])},
  {sql_string(card['element_key'])},
  {sql_string(card['element_label'])},
  {sql_string(card['language'])},
  {sql_string(card['version'])},
  {sql_string(card['classic_markdown'])},
  {sql_string(card['hr_translation_markdown'])},
  {sql_string(card['pro_markdown'])},
  {sql_json(card['talent_hints'])},
  {sql_json(card['risk_hints'])},
  {sql_json(card['management_hints'])},
  {sql_json(card['environment_hints'])},
  {sql_json(card['limitations'])},
  {sql_json(card['base_layers'])},
  {sql_json(card['pro_layers'])},
  {sql_json(card['context_rules'])},
  {sql_json(card['not_self_layers'])},
  {sql_json(card['contrast_examples'])},
  {sql_string(card['source_quality'])}
)"""


cards = [json.loads((CARDS_DIR / f).read_text(encoding="utf-8")) for f in JSON_FILES]

header = """-- Stage 4-E6.1-D: Element Card Storage — line/1 … line/6
-- Approved expert_draft cards from supabase/reference/element_cards/line_*.v1.json
-- DB version stays v1; editorial versions live in pro_layers.card_metadata

insert into public.hd_reference_interpretations (
  element_kind, element_key, element_label, language, version,
  classic_markdown, hr_translation_markdown, pro_markdown,
  talent_hints, risk_hints, management_hints, environment_hints, limitations,
  base_layers, pro_layers, context_rules, not_self_layers, contrast_examples,
  source_quality
) values

"""

rows = []
for card in cards:
    rows.append(f"-- line/{card['element_key']}\n{row_from_card(card)}")

footer = """

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
"""

sql = header + ",\n\n".join(rows) + footer
OUT_FILE.write_text(sql, encoding="utf-8")
print(f"Wrote {OUT_FILE} ({len(sql)} bytes)")
