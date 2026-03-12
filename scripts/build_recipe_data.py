#!/usr/bin/env python3

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

CATEGORIES = [
    {"id": "all", "label": "全部", "region": "All cuisines"},
    {"id": "lu", "label": "鲁", "region": "山东菜"},
    {"id": "chuan", "label": "川", "region": "川菜（四川/重庆）"},
    {"id": "yue-min", "label": "粤闽", "region": "粤菜/闽菜"},
    {"id": "huaiyang", "label": "淮扬", "region": "淮扬菜"},
    {"id": "hui-xiang", "label": "徽湘", "region": "徽菜/湘菜"},
    {"id": "yungui", "label": "云贵", "region": "云南/贵州菜"},
    {"id": "italy-france", "label": "意法", "region": "意大利/法国菜"},
    {"id": "nanyang", "label": "南洋", "region": "东南亚菜"},
    {"id": "silk-road", "label": "Silk-Road", "region": "丝路风味"},
    {"id": "desserts", "label": "Desserts", "region": "甜点"},
    {"id": "drinks", "label": "Drinks", "region": "饮品"},
]

REQUIRED_FIELDS = [
    "id",
    "title",
    "category",
    "time",
    "servings",
    "difficulty",
    "season",
    "blurb",
    "note",
    "palette",
]

SECTION_RE = re.compile(r"^##\s+(.+)$", re.MULTILINE)
FRONTMATTER_RE = re.compile(r"^---\n(.*?)\n---\n(.*)$", re.DOTALL)
STEP_RE = re.compile(r"^\d+\.\s+(.*)$")

CATEGORY_LOOKUP = {category["id"]: category for category in CATEGORIES}


def parse_frontmatter(raw_text: str, source: Path) -> tuple[dict[str, str], str]:
    match = FRONTMATTER_RE.match(raw_text.strip())
    if not match:
        raise ValueError(f"{source}: missing frontmatter block delimited by ---")

    frontmatter_block, body = match.groups()
    metadata: dict[str, str] = {}
    for line in frontmatter_block.splitlines():
        stripped = line.strip()
        if not stripped:
            continue
        if ":" not in stripped:
            raise ValueError(f"{source}: invalid frontmatter line: {line}")
        key, value = stripped.split(":", 1)
        metadata[key.strip()] = value.strip()

    missing = [field for field in REQUIRED_FIELDS if not metadata.get(field)]
    if missing:
        raise ValueError(f"{source}: missing required fields: {', '.join(missing)}")

    return metadata, body.strip()


def split_sections(body: str) -> dict[str, list[str]]:
    sections: dict[str, list[str]] = {}
    current_section: str | None = None

    for line in body.splitlines():
        heading = SECTION_RE.match(line)
        if heading:
            current_section = heading.group(1).strip().lower()
            sections[current_section] = []
            continue
        if current_section is not None:
            sections[current_section].append(line.rstrip())

    return sections


def parse_ingredients(lines: list[str], source: Path) -> list[list[str]]:
    ingredients: list[list[str]] = []
    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue
        if not stripped.startswith(("-", "*")):
            raise ValueError(f"{source}: ingredients lines must start with '-' or '*': {line}")
        payload = stripped[1:].strip()
        if "|" not in payload:
            raise ValueError(f"{source}: ingredient must use 'name | amount' format: {line}")
        name, amount = [part.strip() for part in payload.split("|", 1)]
        if not name or not amount:
            raise ValueError(f"{source}: ingredient must include both name and amount: {line}")
        ingredients.append([name, amount])
    if not ingredients:
        raise ValueError(f"{source}: ingredients section is empty")
    return ingredients


def parse_steps(lines: list[str], source: Path) -> list[str]:
    steps: list[str] = []
    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue
        match = STEP_RE.match(stripped)
        if not match:
            raise ValueError(f"{source}: step must use numbered markdown list syntax: {line}")
        steps.append(match.group(1).strip())
    if not steps:
        raise ValueError(f"{source}: steps section is empty")
    return steps


def parse_palette(raw_palette: str, source: Path) -> list[str]:
    colors = [color.strip() for color in raw_palette.split(",") if color.strip()]
    if len(colors) != 3:
        raise ValueError(f"{source}: palette must contain exactly 3 comma-separated colors")
    for color in colors:
        if not re.fullmatch(r"#[0-9a-fA-F]{6}", color):
            raise ValueError(f"{source}: invalid color value in palette: {color}")
    return colors


def parse_recipe(source: Path) -> dict[str, object]:
    metadata, body = parse_frontmatter(source.read_text(encoding="utf-8"), source)

    category = metadata["category"]
    if category not in CATEGORY_LOOKUP or category == "all":
        raise ValueError(f"{source}: unknown category '{category}'")

    sections = split_sections(body)
    ingredients = parse_ingredients(sections.get("ingredients", []), source)
    steps = parse_steps(sections.get("steps", []), source)
    category_meta = CATEGORY_LOOKUP[category]

    return {
        "id": metadata["id"],
        "title": metadata["title"],
        "category": category,
        "categoryLabel": f"{category_meta['label']} · {category_meta['region']}",
        "blurb": metadata["blurb"],
        "time": metadata["time"],
        "servings": metadata["servings"],
        "difficulty": metadata["difficulty"],
        "season": metadata["season"],
        "note": metadata["note"],
        "palette": parse_palette(metadata["palette"], source),
        "ingredients": ingredients,
        "steps": steps,
    }


def build_recipe_data(source_dir: Path) -> dict[str, object]:
    recipe_files = sorted(source_dir.glob("*.md"))
    if not recipe_files:
        raise ValueError(f"No markdown recipes found in {source_dir}")

    recipes = [parse_recipe(path) for path in recipe_files]
    ids = [recipe["id"] for recipe in recipes]
    duplicate_ids = sorted({recipe_id for recipe_id in ids if ids.count(recipe_id) > 1})
    if duplicate_ids:
        raise ValueError(f"Duplicate recipe ids found: {', '.join(duplicate_ids)}")

    return {
        "categories": CATEGORIES,
        "recipes": recipes,
    }


def write_js_output(payload: dict[str, object], output_path: Path) -> None:
    serialized = json.dumps(payload, ensure_ascii=False, indent=2)
    output_path.write_text(
        "// Generated by scripts/build_recipe_data.py. Do not edit by hand.\n"
        f"window.RECIPE_NOTEBOOK_DATA = {serialized};\n",
        encoding="utf-8",
    )


def main() -> None:
    parser = argparse.ArgumentParser(description="Build recipe-data.js from markdown recipes")
    parser.add_argument(
        "--source-dir",
        default="content/recipes",
        help="Directory containing markdown recipe files",
    )
    parser.add_argument(
        "--output",
        default="recipe-data.js",
        help="Output JS file consumed by the frontend",
    )
    args = parser.parse_args()

    source_dir = Path(args.source_dir)
    output_path = Path(args.output)

    if not source_dir.is_absolute():
        source_dir = ROOT / source_dir
    if not output_path.is_absolute():
        output_path = ROOT / output_path

    payload = build_recipe_data(source_dir)
    write_js_output(payload, output_path)
    print(f"Built {output_path} from {len(payload['recipes'])} markdown recipes.")


if __name__ == "__main__":
    main()
