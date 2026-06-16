#!/usr/bin/env python3
"""One-off: line Element Card MD → line_*.v1.json (Stage 4-E6.1-D)."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SOURCE_DIR = ROOT / "supabase/reference/element_cards/source"
OUT_DIR = ROOT / "supabase/reference/element_cards"
LINE_NUMBERS = ["1", "2", "3", "4", "5", "6"]

LINE_LIMITATIONS = {
    "1": [
        "Не делать вывод, что человек медлительный, неуверенный или излишне теоретический.",
        "Line 1 показывает стиль проявления конкретной темы, а не всю личность.",
        "Не использовать line/1 как финальный вывод о человеке.",
        "Не использовать для fit_score, match_score или решения о найме.",
        "Не читать линию отдельно от gate, activation_position, profile и whole chart context.",
    ],
    "2": [
        "Не смешивать Line 2 со стратегией Проектора.",
        "Line 2 описывает естественный стиль проявления и call-out mechanics, а не всю стратегию входа в работу или отношения.",
        "Не использовать line/2 как финальный вывод о человеке.",
        "Не использовать для fit_score, match_score или решения о найме.",
        "Не читать линию отдельно от gate, activation_position, profile и whole chart context.",
    ],
    "3": [
        "Не делать вывод, что человек нестабильный, безответственный или проблемный.",
        "Line 3 описывает стиль обучения темы через практическую реальность.",
        "Не использовать line/3 как финальный вывод о человеке.",
        "Не использовать для fit_score, match_score или решения о найме.",
        "Не читать линию отдельно от gate, activation_position, profile и whole chart context.",
    ],
    "4": [
        "Не делать вывод, что человек просто общительный, экстравертный или зависимый от людей.",
        "Line 4 описывает relational style проявления конкретной темы.",
        "Не использовать line/4 как финальный вывод о человеке.",
        "Не использовать для fit_score, match_score или решения о найме.",
        "Не читать линию отдельно от gate, activation_position, profile и whole chart context.",
    ],
    "5": [
        "Не делать вывод, что человек спасатель или должен вести других.",
        "Line 5 описывает поле практического решения и проекций, а не обязанность соответствовать ожиданиям.",
        "Не использовать line/5 как финальный вывод о человеке.",
        "Не использовать для fit_score, match_score или решения о найме.",
        "Не читать линию отдельно от gate, activation_position, profile и whole chart context.",
    ],
    "6": [
        "Не делать вывод, что человек уже мудрый, отстранённый или role model.",
        "Line 6 показывает направление созревания темы, а не гарантированный уровень проявления.",
        "Не использовать line/6 как финальный вывод о человеке.",
        "Не использовать для fit_score, match_score или решения о найме.",
        "Не читать линию отдельно от gate, activation_position, profile и whole chart context.",
    ],
}


def unquote(value: str) -> str:
    value = value.strip()
    if len(value) >= 2 and value[0] == value[-1] and value[0] in ('"', "'"):
        return value[1:-1]
    return value


def section_prose(content: str, heading: str) -> str:
    start = content.find(heading)
    if start == -1:
        return ""
    rest = content[start + len(heading):].lstrip("\n")
    m = re.search(r"\n### |\n## [^#]|\n---\n", rest)
    slice_ = rest[: m.start()] if m else rest
    return slice_.strip()


def text_block_after(content: str, heading: str) -> str:
    section = section_prose(content, heading)
    m = re.search(r"```(?:text|yaml)?\n([\s\S]*?)```", section)
    return m.group(1).strip() if m else section


def text_block_to_array(block: str) -> list:
    return [line.strip() for line in block.split("\n") if line.strip()]


def extract_yaml_block(content: str, marker: str) -> dict:
    idx = content.find(marker)
    if idx == -1:
        return {}
    rest = content[idx:]
    m = re.search(r"```yaml\n([\s\S]*?)```", rest)
    if not m:
        return {}
    return parse_simple_yaml(m.group(1))


def parse_simple_yaml(yaml: str) -> dict:
    result: dict = {}
    current_key = None
    current_list = None
    current_obj = None

    for raw_line in yaml.split("\n"):
        line = raw_line.rstrip()
        stripped = line.strip()
        if not stripped or stripped.startswith("#"):
            continue

        list_item = re.match(r"^- (.+)$", stripped)
        if list_item:
            item = list_item[1].strip()
            kv = re.match(r"^([\w_]+):\s*(.*)$", item)
            if kv and isinstance(current_list, list):
                current_obj = {kv.group(1): unquote(kv.group(2))}
                current_list.append(current_obj)
            elif isinstance(current_list, list):
                current_list.append(unquote(item))
            elif current_key:
                if not isinstance(result.get(current_key), list):
                    result[current_key] = []
                result[current_key].append(unquote(item))
            continue

        indented_kv = re.match(r"^([\w_]+):\s*(.*)$", stripped)
        if indented_kv and current_obj is not None:
            current_obj[indented_kv.group(1)] = unquote(indented_kv.group(2))
            continue

        kv = re.match(r"^([\w_]+):\s*(.*)$", stripped)
        if not kv:
            continue
        key, value = kv.group(1), kv.group(2).strip()
        current_key = key
        current_obj = None
        if value == "":
            current_list = []
            result[key] = current_list
        else:
            current_list = None
            result[key] = unquote(value)

    return result


def hr_markdown(content: str) -> str:
    parts = [
        ("## Название", section_prose(content, "### Title")),
        ("## Короткая суть", section_prose(content, "### Short essence")),
        ("## Как проявляется в работе", section_prose(content, "### Work manifestation")),
        ("## Здоровое проявление", section_prose(content, "### Healthy expression")),
        ("## Искажённое проявление", section_prose(content, "### Distorted expression")),
        ("## Как использовать", section_prose(content, "### How to use")),
        ("## Что проверить в реальности", section_prose(content, "### What to check")),
        ("## Важно", section_prose(content, "### Important note")),
    ]
    return "\n\n".join(f"{h}\n\n{b}" for h, b in parts if b)


def pro_markdown(content: str, ui_pro_label: str) -> str:
    sections = [
        (f"## {ui_pro_label}", None),
        ("## Technical meaning", section_prose(content, "### Technical meaning")),
        ("## Mechanics", section_prose(content, "### Mechanics")),
        ("## Role in chart", section_prose(content, "### Role in chart")),
        ("## Contextual reading", section_prose(content, "### Contextual reading")),
        ("## Correct expression", section_prose(content, "### Correct expression")),
        ("## Not-Self expression", section_prose(content, "### Not-Self expression")),
        ("## Interpretation limits", section_prose(content, "### Interpretation limits")),
    ]
    out = []
    for heading, body in sections:
        if body is None:
            out.append(heading)
        elif body:
            out.append(f"{heading}\n\n{body}")
    return "\n\n".join(out)


def convert_line(line_num: str) -> dict:
    card_key = f"line_{line_num}"
    content = (SOURCE_DIR / f"{card_key}.md").read_text(encoding="utf-8")

    metadata = extract_yaml_block(content, "## Metadata")
    card_meta = extract_yaml_block(content, "## Card metadata")
    classical_keywords = text_block_to_array(text_block_after(content, "## Classical keywords"))
    talent_hints = text_block_to_array(text_block_after(content, "### talent_hints"))
    risk_hints = text_block_to_array(text_block_after(content, "### risk_hints"))
    management_hints = text_block_to_array(text_block_after(content, "### management_hints"))
    environment_hints = text_block_to_array(text_block_after(content, "### environment_hints"))
    context_rules = extract_yaml_block(content, "## Context rules")
    not_self_layers = extract_yaml_block(content, "## Not-self layers")
    contrast_yaml = extract_yaml_block(content, "## Contrast examples")
    source_chip = extract_yaml_block(content, "## Source chip")

    ui_base_label = card_meta.get("ui_base_label", "")
    ui_pro_label = card_meta.get("ui_pro_label", "")
    title = section_prose(content, "### Title")
    short_essence = section_prose(content, "### Short essence")
    work_manifestation = section_prose(content, "### Work manifestation")
    healthy_expression = section_prose(content, "### Healthy expression")
    distorted_expression = section_prose(content, "### Distorted expression")
    how_to_use = section_prose(content, "### How to use")
    what_to_check = section_prose(content, "### What to check")
    important_note = section_prose(content, "### Important note")
    technical_meaning = section_prose(content, "### Technical meaning")
    mechanics = section_prose(content, "### Mechanics")
    role_in_chart = section_prose(content, "### Role in chart")
    contextual_reading = section_prose(content, "### Contextual reading")
    correct_expression = section_prose(content, "### Correct expression")
    not_self_expression = section_prose(content, "### Not-Self expression")
    interpretation_limits = section_prose(content, "### Interpretation limits")

    contrast_examples = contrast_yaml.get("contrast_examples", [])
    if not isinstance(contrast_examples, list):
        contrast_examples = []

    classic_markdown = "\n\n".join(
        filter(
            None,
            [
                f"Line {line_num} · {ui_base_label}",
                ", ".join(classical_keywords),
                technical_meaning,
                mechanics,
            ],
        )
    )

    final_limitations = LINE_LIMITATIONS.get(line_num, [])

    used_in_layers = metadata.get("used_in_layers", [])

    return {
        "element_kind": "line",
        "element_key": line_num,
        "element_label": metadata.get("element_label", f"Линия {line_num}"),
        "language": "ru",
        "version": "v1",
        "source_quality": "expert_draft",
        "classic_markdown": classic_markdown,
        "hr_translation_markdown": hr_markdown(content),
        "pro_markdown": pro_markdown(content, ui_pro_label),
        "talent_hints": talent_hints,
        "risk_hints": risk_hints,
        "management_hints": management_hints,
        "environment_hints": environment_hints,
        "limitations": final_limitations,
        "base_layers": {
            "title": title,
            "base_label": ui_base_label,
            "plain_meaning": short_essence,
            "work_manifestation": work_manifestation,
            "healthy_expression": healthy_expression,
            "distorted_expression": distorted_expression,
            "strengths": "; ".join(talent_hints),
            "risks": "; ".join(risk_hints),
            "when_it_works_best": how_to_use,
            "when_talent_is_not_revealed": distorted_expression,
            "development_hints": management_hints[:5],
            "communication_hints": management_hints[:4],
            "reality_check": what_to_check,
            "important_note": important_note,
        },
        "pro_layers": {
            "hd_meaning": technical_meaning,
            "mechanics": mechanics,
            "classical_keywords": classical_keywords,
            "source_logic": (
                f"line/{line_num} describes the universal style of manifestation for a gate or "
                "activation theme. Final reading depends on gate, planet, side, activation_position, "
                "profile, type, authority and whole chart context."
            ),
            "role_in_chart": role_in_chart,
            "contextual_reading": contextual_reading,
            "correct_expression": correct_expression,
            "not_self_expression": not_self_expression,
            "pro_not_self": not_self_layers.get("pro", not_self_expression),
            "interpretation_limitations": interpretation_limits,
            "card_metadata": {
                "editorial_version": card_meta.get("editorial_version", "v0.1.1"),
                "status": card_meta.get("status", "approved_after_editorial_review"),
                "ui_base_label": ui_base_label,
                "ui_pro_label": ui_pro_label,
                "primary_layer_key": metadata.get("primary_layer_key", "pro_foundation"),
                "link_target": metadata.get("link_target", f"element://line/{line_num}"),
                "source_file": card_meta.get(
                    "source_file", f"supabase/reference/element_cards/source/{card_key}.md"
                ),
                "used_in_layers": used_in_layers,
                "methodology_note": (
                    "Universal line card: describes style of manifestation, not a final person label. "
                    "Read through gate, activation_position and whole chart context."
                ),
            },
            "ai_source_rules": {
                "allowed_uses": [
                    "использовать как supporting source для pro_foundation",
                    "использовать для уточнения стиля проявления темы в gate или activation",
                    "использовать в слоях, указанных в used_in_layers",
                    "использовать для контекстного чтения activation composition",
                ],
                "forbidden_uses": [
                    "не использовать как финальный вывод о человеке",
                    "не использовать для fit_score или match_score",
                    "не использовать для hire/no-hire decisions",
                    "не подменять line-card profile-card или activation_position",
                    "не читать line отдельно от gate и activation context",
                ],
                "preferred_layers": used_in_layers,
                "source_priority": "supporting",
                "ai_must_check": [
                    "gate",
                    "activation",
                    "activation_position",
                    "planet",
                    "side",
                    "profile",
                    "type",
                    "authority",
                ],
            },
            "source_chip": {
                "base_label": source_chip.get("base_label", ui_base_label),
                "pro_label": source_chip.get("pro_label", ui_pro_label),
                "short_role": source_chip.get("short_role", ""),
                "role_in_this_layer": source_chip.get("role_in_this_layer", ""),
                "link_target": source_chip.get("link_target", f"element://line/{line_num}"),
            },
        },
        "context_rules": {
            "primary_context": context_rules.get("primary_context", []),
            "secondary_context": context_rules.get("secondary_context", []),
            "depends_on": context_rules.get("depends_on", ""),
            "related_element_kinds": context_rules.get("related_element_kinds", []),
            "context_note": context_rules.get("context_note", ""),
        },
        "not_self_layers": {
            "base": not_self_layers.get("base", ""),
            "pro": not_self_layers.get("pro", ""),
            "warning_signals": not_self_layers.get("warning_signals", []),
            "recovery_conditions": not_self_layers.get("recovery_conditions", []),
        },
        "contrast_examples": contrast_examples,
    }


if __name__ == "__main__":
    for line_num in LINE_NUMBERS:
        card_key = f"line_{line_num}"
        card = convert_line(line_num)
        out_path = OUT_DIR / f"{card_key}.v1.json"
        out_path.write_text(json.dumps(card, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(
            "Wrote",
            out_path,
            json.dumps(
                {
                    "element_key": card["element_key"],
                    "contrast_count": len(card["contrast_examples"]),
                    "ui_base_label": card["pro_layers"]["card_metadata"]["ui_base_label"],
                },
                ensure_ascii=False,
            ),
        )
