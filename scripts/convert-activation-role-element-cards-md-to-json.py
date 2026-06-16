#!/usr/bin/env python3
"""One-off: activation_role Element Card MD → activation_role_*.v1.json (Stage 4-E6.2-C1/C2/C3)."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SOURCE_DIR = ROOT / "supabase/reference/element_cards/source"
OUT_DIR = ROOT / "supabase/reference/element_cards"

BATCH_1_CARDS = [
    "activation_role_personality_sun",
    "activation_role_design_sun",
    "activation_role_personality_earth",
    "activation_role_design_earth",
    "activation_role_personality_moon",
    "activation_role_design_moon",
]

BATCH_2_CARDS = [
    "activation_role_personality_north_node",
    "activation_role_design_north_node",
    "activation_role_personality_south_node",
    "activation_role_design_south_node",
    "activation_role_personality_mercury",
    "activation_role_design_mercury",
]

BATCH_3_CARDS = [
    "activation_role_personality_venus",
    "activation_role_design_venus",
    "activation_role_personality_mars",
    "activation_role_design_mars",
    "activation_role_personality_jupiter",
    "activation_role_design_jupiter",
]

RU_PRO_LABELS = {
    "personality_sun": "Позиция активации · Солнце Личности",
    "design_sun": "Позиция активации · Солнце Дизайна",
    "personality_earth": "Позиция активации · Земля Личности",
    "design_earth": "Позиция активации · Земля Дизайна",
    "personality_moon": "Позиция активации · Луна Личности",
    "design_moon": "Позиция активации · Луна Дизайна",
    "personality_north_node": "Позиция активации · Северный узел Личности",
    "design_north_node": "Позиция активации · Северный узел Дизайна",
    "personality_south_node": "Позиция активации · Южный узел Личности",
    "design_south_node": "Позиция активации · Южный узел Дизайна",
    "personality_mercury": "Позиция активации · Меркурий Личности",
    "design_mercury": "Позиция активации · Меркурий Дизайна",
    "personality_venus": "Позиция активации · Венера Личности",
    "design_venus": "Позиция активации · Венера Дизайна",
    "personality_mars": "Позиция активации · Марс Личности",
    "design_mars": "Позиция активации · Марс Дизайна",
    "personality_jupiter": "Позиция активации · Юпитер Личности",
    "design_jupiter": "Позиция активации · Юпитер Дизайна",
}

CLASSIC_SUMMARIES = {
    "personality_sun": (
        "Conscious Sun activation position — core self-identified theme in activation composition."
    ),
    "design_sun": (
        "Design Sun activation position — automatic central behavioral theme in activation composition."
    ),
    "personality_earth": (
        "Conscious Earth activation position — conscious grounding and stability anchor in activation composition."
    ),
    "design_earth": (
        "Design Earth activation position — automatic grounding and stability pattern in activation composition."
    ),
    "personality_moon": (
        "Conscious Moon activation position — conscious inner drive and movement impulse in activation composition."
    ),
    "design_moon": (
        "Design Moon activation position — automatic movement impulse and behavioral drive in activation composition."
    ),
    "personality_north_node": (
        "Conscious North Node activation position — conscious growth direction in activation composition."
    ),
    "design_north_node": (
        "Design North Node activation position — automatic development vector in activation composition."
    ),
    "personality_south_node": (
        "Conscious South Node activation position — conscious familiar experience in activation composition."
    ),
    "design_south_node": (
        "Design South Node activation position — automatic familiar background in activation composition."
    ),
    "personality_mercury": (
        "Conscious Mercury activation position — conscious way of speaking in activation composition."
    ),
    "design_mercury": (
        "Design Mercury activation position — automatic way of expressing in activation composition."
    ),
    "personality_venus": (
        "Conscious Venus activation position — conscious values and standards in activation composition."
    ),
    "design_venus": (
        "Design Venus activation position — values in behavior in activation composition."
    ),
    "personality_mars": (
        "Conscious Mars activation position — conscious maturation zone in activation composition."
    ),
    "design_mars": (
        "Design Mars activation position — automatic training zone in activation composition."
    ),
    "personality_jupiter": (
        "Conscious Jupiter activation position — conscious rules of growth in activation composition."
    ),
    "design_jupiter": (
        "Design Jupiter activation position — automatic scale and rules in activation composition."
    ),
}


def normalize_heading(heading: str) -> str:
    return heading.lstrip("#").strip()


def find_section_marker(content: str, heading: str) -> str:
    bare = normalize_heading(heading)
    for marker in (f"## {bare}", f"### {bare}", f"# {bare}"):
        if marker in content:
            return marker
    return f"## {bare}"


def yaml_section_marker(content: str, section_num: int, name: str) -> str:
    for marker in (f"# {section_num}. {name}", f"## {section_num}. {name}"):
        if marker in content:
            return marker
    return f"# {section_num}. {name}"


def unquote(value: str) -> str:
    value = value.strip()
    if len(value) >= 2 and value[0] == value[-1] and value[0] in ('"', "'"):
        return value[1:-1]
    return value


def section_prose(content: str, heading: str) -> str:
    marker = find_section_marker(content, heading)
    start = content.find(marker)
    if start == -1:
        return ""
    rest = content[start + len(marker):].lstrip("\n")
    m = re.search(r"\n(?:##|###) |\n---\n|\n# \d+\.", rest)
    slice_ = rest[: m.start()] if m else rest
    return slice_.strip()


def text_block_after(content: str, heading: str) -> str:
    section = section_prose(content, heading)
    m = re.search(r"```(?:text|yaml)?\n([\s\S]*?)```", section)
    return m.group(1).strip() if m else section


def text_block_to_array(block: str) -> list:
    return [line.strip() for line in block.split("\n") if line.strip()]


def unwrap_yaml_root(yaml_text: str, root_key: str) -> str:
    lines = yaml_text.split("\n")
    if not lines:
        return yaml_text
    if lines[0].strip() == f"{root_key}:":
        return "\n".join("  " + line if line.strip() else line for line in lines[1:])
    return yaml_text


def parse_folded_scalar(yaml_text: str, key: str, stop_keys=None) -> str:
    stop_keys = stop_keys or []
    m = re.search(rf"^(\s*){key}:\s*>\s*$", yaml_text, re.MULTILINE)
    if m:
        key_indent = len(m.group(1))
        rest = yaml_text[m.end():]
        lines = []
        for line in rest.split("\n"):
            if not line.strip():
                continue
            stripped = line.lstrip()
            indent = len(line) - len(stripped)
            if indent <= key_indent and re.match(r"\w[\w_]*:\s", stripped):
                break
            if indent <= key_indent + 2 and stripped.startswith("- "):
                break
            for stop_key in stop_keys:
                if re.match(rf"^{stop_key}:\s", stripped):
                    return " ".join(lines).strip()
            if indent > key_indent:
                lines.append(stripped)
            else:
                break
        return " ".join(lines).strip()
    kv = re.search(rf"^\s*{key}:\s*(.+)$", yaml_text, re.MULTILINE)
    value = kv.group(1).strip() if kv else ""
    return "" if value == ">" else value


def parse_context_rules(content: str) -> dict:
    yaml_text = unwrap_yaml_root(
        yaml_block_text(content, yaml_section_marker(content, 5, "Context rules")), "context_rules"
    )
    if not yaml_text:
        return {}
    data = parse_simple_yaml(yaml_text)
    data["depends_on"] = parse_folded_scalar(
        yaml_text, "depends_on", ["related_element_kinds", "context_note"]
    )
    data["context_note"] = parse_folded_scalar(yaml_text, "context_note")
    return data


def parse_not_self_layers(content: str) -> dict:
    yaml_text = unwrap_yaml_root(
        yaml_block_text(content, yaml_section_marker(content, 6, "Not-Self / distortion")),
        "not_self_layers",
    )
    if not yaml_text:
        return {}
    data = parse_simple_yaml(yaml_text)
    data["base"] = parse_folded_scalar(
        yaml_text, "base", ["pro", "warning_signals", "recovery_conditions"]
    )
    data["pro"] = parse_folded_scalar(
        yaml_text, "pro", ["warning_signals", "recovery_conditions"]
    )
    return data


def parse_contrast_examples(content: str) -> list:
    yaml_text = yaml_block_text(content, yaml_section_marker(content, 11, "Contrast examples"))
    if not yaml_text:
        return []
    items = []
    chunks = re.split(r"\n\s*-\s+contrast_context:\s*", yaml_text)
    for chunk in chunks[1:]:
        lines = chunk.split("\n", 1)
        contrast_context = lines[0].strip()
        body = lines[1] if len(lines) > 1 else ""
        items.append(
            {
                "contrast_context": contrast_context,
                "how_it_would_read": parse_folded_scalar(
                    body, "how_it_would_read", ["why_current_context_is_different"]
                ),
                "why_current_context_is_different": parse_folded_scalar(
                    body, "why_current_context_is_different"
                ),
            }
        )
    return items


def yaml_block_text(content: str, marker: str) -> str:
    idx = content.find(marker)
    if idx == -1:
        return ""
    rest = content[idx:]
    m = re.search(r"```yaml\n([\s\S]*?)```", rest)
    return m.group(1) if m else ""


def extract_yaml_block(content, marker, unwrap_root=None):
    yaml_text = yaml_block_text(content, marker)
    if not yaml_text:
        return {}
    if unwrap_root:
        yaml_text = unwrap_yaml_root(yaml_text, unwrap_root)
    return parse_simple_yaml(yaml_text)


def merge_multiline_yaml(content, marker, unwrap_root=None):
    yaml_text = yaml_block_text(content, marker)
    if not yaml_text:
        return {}
    if unwrap_root:
        yaml_text = unwrap_yaml_root(yaml_text, unwrap_root)
    data = parse_simple_yaml(yaml_text)
    for key in (
        "depends_on",
        "context_note",
        "source_priority_note",
        "short_role",
        "role_in_this_layer",
        "layer_relevance",
        "short_meaning",
        "healthy_expression_summary",
        "distorted_expression_summary",
        "base",
        "pro",
    ):
        folded = parse_folded_scalar(yaml_text, key)
        if folded:
            data[key] = folded
    if unwrap_root and isinstance(data.get(unwrap_root), list) and not data[unwrap_root]:
        data.pop(unwrap_root, None)
    return data


def parse_simple_yaml(yaml: str) -> dict:
    result: dict = {}
    current_key = None
    current_list = None
    current_obj = None
    nested_obj = None

    for raw_line in yaml.split("\n"):
        line = raw_line.rstrip()
        stripped = line.strip()
        if not stripped or stripped.startswith("#"):
            continue

        list_item = re.match(r"^\s*- (.+)$", stripped)
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

        indent = len(line) - len(line.lstrip())
        indented_kv = re.match(r"^([\w_]+):\s*(.*)$", stripped)
        if not indented_kv:
            continue

        key, value = indented_kv.group(1), indented_kv.group(2).strip()

        if indent >= 4 and nested_obj is not None:
            nested_obj[key] = unquote(value) if value else {}
            continue

        if indent >= 2 and current_obj is not None:
            if value == "":
                nested_obj = {}
                current_obj[key] = nested_obj
            else:
                current_obj[key] = unquote(value)
            continue

        current_key = key
        current_obj = None
        nested_obj = None
        if value == "":
            current_list = []
            result[key] = current_list
        elif value == ">":
            current_list = None
            result[key] = ""
        else:
            current_list = None
            result[key] = unquote(value)

    return result


def hr_markdown(content: str) -> str:
    parts = [
        ("## Короткая суть", section_prose(content, "## Короткая суть")),
        ("## В работе", section_prose(content, "## В работе")),
        ("## Здоровое проявление", section_prose(content, "## Здоровое проявление")),
        ("## Искажённое проявление", section_prose(content, "## Искажённое проявление")),
        ("## Как использовать руководителю", section_prose(content, "## Как использовать руководителю")),
        ("## Что проверить в реальности", section_prose(content, "## Что проверить в реальности")),
        ("## Важное ограничение", section_prose(content, "## Важное ограничение")),
    ]
    return "\n\n".join(f"{h}\n\n{b}" for h, b in parts if b)


def pro_markdown(content: str, ui_pro_label: str) -> str:
    sections = [
        (f"## {ui_pro_label}", None),
        ("## Технический смысл", section_prose(content, "## Технический смысл")),
        ("## Planet function", section_prose(content, "## Planet function")),
        ("## Side function", section_prose(content, "## Side function")),
        ("## Function in activation composition", section_prose(content, "## Function in activation composition")),
        ("## Contextual reading", section_prose(content, "## Contextual reading")),
        ("## Correct expression", section_prose(content, "## Correct expression")),
        ("## Not-Self expression", section_prose(content, "## Not-Self expression")),
        ("## Interpretation limits", section_prose(content, "## Interpretation limits")),
    ]
    out = []
    for heading, body in sections:
        if body is None:
            out.append(heading)
        elif body:
            out.append(f"{heading}\n\n{body}")
    return "\n\n".join(out)


def card_metadata_from_yaml(metadata_yaml: dict) -> dict:
    pro_layers = metadata_yaml.get("pro_layers", {})
    if isinstance(pro_layers, dict):
        card_meta = pro_layers.get("card_metadata", {})
        if isinstance(card_meta, dict):
            return card_meta
    return {}


def convert_card(card_key: str) -> dict:
    content = (SOURCE_DIR / f"{card_key}.md").read_text(encoding="utf-8")

    metadata_yaml = extract_yaml_block(content, yaml_section_marker(content, 1, "Metadata"))
    card_meta = card_metadata_from_yaml(metadata_yaml)

    element_key = metadata_yaml.get("element_key", card_key.replace("activation_role_", ""))
    element_label = metadata_yaml.get("element_label", "")
    ui_base_label = card_meta.get("ui_base_label", element_label)
    ui_pro_label = RU_PRO_LABELS.get(element_key) or card_meta.get("ui_pro_label", "")

    hints_yaml = extract_yaml_block(content, yaml_section_marker(content, 4, "Hints"))
    context_rules = parse_context_rules(content)
    not_self_layers = parse_not_self_layers(content)
    limitations_yaml = extract_yaml_block(content, yaml_section_marker(content, 7, "Limitations"))
    ai_source_rules = merge_multiline_yaml(
        content, yaml_section_marker(content, 8, "AI-source rules"), "ai_source_rules"
    )
    source_chip = merge_multiline_yaml(
        content, yaml_section_marker(content, 9, "Source chip"), "source_chip"
    )
    ai_digest = merge_multiline_yaml(
        content, yaml_section_marker(content, 10, "AI Digest"), "ai_digest"
    )
    contrast_examples = parse_contrast_examples(content)

    talent_hints = hints_yaml.get("talent_hints", [])
    risk_hints = hints_yaml.get("risk_hints", [])
    management_hints = hints_yaml.get("management_hints", [])
    environment_hints = hints_yaml.get("environment_hints", [])
    development_hints = hints_yaml.get("development_hints", [])
    communication_hints = hints_yaml.get("communication_hints", [])

    limitations = limitations_yaml.get("limitations", [])
    if not isinstance(limitations, list):
        limitations = text_block_to_array(str(limitations))

    short_essence = section_prose(content, "## Короткая суть")
    work_manifestation = section_prose(content, "## В работе")
    healthy_expression = section_prose(content, "## Здоровое проявление")
    distorted_expression = section_prose(content, "## Искажённое проявление")
    how_to_use = section_prose(content, "## Как использовать руководителю")
    what_to_check = section_prose(content, "## Что проверить в реальности")
    important_note = section_prose(content, "## Важное ограничение")

    technical_meaning = section_prose(content, "## Технический смысл")
    planet_function = section_prose(content, "## Planet function")
    side_function = section_prose(content, "## Side function")
    activation_composition = section_prose(content, "## Function in activation composition")
    contextual_reading = section_prose(content, "## Contextual reading")
    correct_expression = section_prose(content, "## Correct expression")
    not_self_expression = section_prose(content, "## Not-Self expression")
    interpretation_limits = section_prose(content, "## Interpretation limits")

    used_in_layers = metadata_yaml.get("used_in_layers", [])
    if not isinstance(used_in_layers, list):
        used_in_layers = []

    if ai_digest:
        ai_digest["pro_label"] = ui_pro_label
        ai_digest["base_label"] = ui_base_label

    link_target = source_chip.get("link_target", f"element://activation_role/{element_key}")
    source_file = card_meta.get("source_file", f"supabase/reference/element_cards/source/{card_key}.md")

    classic_markdown = "\n\n".join(
        filter(
            None,
            [
                f"activation_role/{element_key} · {ui_base_label}",
                CLASSIC_SUMMARIES.get(element_key, ""),
                technical_meaning,
                planet_function,
            ],
        )
    )

    return {
        "element_kind": "activation_role",
        "element_key": element_key,
        "element_label": element_label,
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
        "limitations": limitations,
        "base_layers": {
            "title": ui_base_label,
            "base_label": ui_base_label,
            "plain_meaning": short_essence,
            "work_manifestation": work_manifestation,
            "healthy_expression": healthy_expression,
            "distorted_expression": distorted_expression,
            "strengths": "; ".join(talent_hints[:5]) if talent_hints else "",
            "risks": "; ".join(risk_hints[:5]) if risk_hints else "",
            "when_it_works_best": how_to_use,
            "when_talent_is_not_revealed": distorted_expression,
            "development_hints": development_hints[:5] if development_hints else management_hints[:5],
            "communication_hints": communication_hints[:5] if communication_hints else management_hints[:4],
            "reality_check": what_to_check,
            "important_note": important_note,
        },
        "pro_layers": {
            "hd_meaning": technical_meaning,
            "mechanics": activation_composition,
            "planet_function": planet_function,
            "side_function": side_function,
            "source_logic": (
                f"activation_role/{element_key} describes activation_position function "
                "(planet + side) for gate+line themes. Final reading depends on gate, line, "
                "full activation key, profile, type, authority and whole chart context."
            ),
            "contextual_reading": contextual_reading,
            "correct_expression": correct_expression,
            "not_self_expression": not_self_expression,
            "pro_not_self": not_self_layers.get("pro", not_self_expression),
            "interpretation_limitations": interpretation_limits,
            "card_metadata": {
                "methodological_name": "activation_position",
                "editorial_version": card_meta.get("editorial_version", "v0.1.1"),
                "status": card_meta.get("status", "approved_after_editorial_review"),
                "ui_base_label": ui_base_label,
                "ui_pro_label": ui_pro_label,
                "primary_layer_key": metadata_yaml.get("primary_layer_key", "pro_foundation"),
                "link_target": link_target,
                "source_file": source_file,
                "used_in_layers": used_in_layers,
                "methodology_note": (
                    "activation_position card: describes planet+side function in activation composition, "
                    "not a final person label. Read through gate, line, full activation and whole chart context."
                ),
            },
            "ai_source_rules": ai_source_rules,
            "source_chip": {
                "base_label": source_chip.get("base_label", ui_base_label),
                "pro_label": ui_pro_label,
                "short_role": parse_folded_scalar(
                    yaml_block_text(content, yaml_section_marker(content, 9, "Source chip")),
                    "short_role",
                    ["role_in_this_layer"],
                )
                or source_chip.get("short_role", ""),
                "role_in_this_layer": parse_folded_scalar(
                    yaml_block_text(content, yaml_section_marker(content, 9, "Source chip")),
                    "role_in_this_layer",
                    ["link_target"],
                )
                or source_chip.get("role_in_this_layer", ""),
                "link_target": link_target,
            },
            "ai_digest": ai_digest,
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
    import sys

    batch = sys.argv[1] if len(sys.argv) > 1 else "batch3"
    if batch == "batch3":
        cards = BATCH_3_CARDS
    elif batch == "batch2":
        cards = BATCH_2_CARDS
    else:
        cards = BATCH_1_CARDS
    for card_key in cards:
        card = convert_card(card_key)
        out_path = OUT_DIR / f"{card_key}.v1.json"
        out_path.write_text(json.dumps(card, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(
            "Wrote",
            out_path,
            json.dumps(
                {
                    "element_key": card["element_key"],
                    "methodological_name": card["pro_layers"]["card_metadata"]["methodological_name"],
                    "contrast_count": len(card["contrast_examples"]),
                    "ui_pro_label": card["pro_layers"]["card_metadata"]["ui_pro_label"],
                },
                ensure_ascii=False,
            ),
        )
