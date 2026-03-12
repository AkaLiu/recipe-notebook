#!/usr/bin/env python3

from __future__ import annotations

import argparse
import shutil
from pathlib import Path

from build_recipe_data import build_recipe_data, write_js_output

ROOT = Path(__file__).resolve().parents[1]

def main() -> None:
    parser = argparse.ArgumentParser(description="Copy a markdown recipe into content/recipes and rebuild recipe-data.js")
    parser.add_argument("source", help="Path to the markdown recipe file")
    parser.add_argument(
        "--recipes-dir",
        default="content/recipes",
        help="Destination directory for recipe markdown files",
    )
    parser.add_argument(
        "--output",
        default="recipe-data.js",
        help="Output JS file consumed by the frontend",
    )
    args = parser.parse_args()

    source_path = Path(args.source).expanduser().resolve()
    recipes_dir = Path(args.recipes_dir)
    output_path = Path(args.output)

    if not recipes_dir.is_absolute():
        recipes_dir = ROOT / recipes_dir
    if not output_path.is_absolute():
        output_path = ROOT / output_path

    if not source_path.exists():
        raise FileNotFoundError(f"Recipe markdown file not found: {source_path}")
    if source_path.suffix.lower() != ".md":
        raise ValueError("Recipe file must be a .md document")

    recipes_dir.mkdir(parents=True, exist_ok=True)
    destination = recipes_dir / source_path.name

    if source_path != destination.resolve():
        shutil.copy2(source_path, destination)

    payload = build_recipe_data(recipes_dir)
    write_js_output(payload, output_path)
    print(f"Added {destination.name} and rebuilt {output_path}.")


if __name__ == "__main__":
    main()
