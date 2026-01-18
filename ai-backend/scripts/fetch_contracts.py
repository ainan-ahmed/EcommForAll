"""Fetch AI contract schemas from the Java backend and generate Pydantic models.

Usage:
    AI_CONTRACTS_URL=http://localhost:8080/api/ai/contracts/schemas \
    AI_CONTRACTS_TOKEN=... \
    python scripts/fetch_contracts.py

Requires `datamodel-code-generator` to be installed. You can install tooling deps with:
    pip install .[contracts]
"""

from __future__ import annotations

import json
import os
import subprocess
import sys
import urllib.request
from pathlib import Path
from typing import Any

REPO_ROOT = Path(__file__).resolve().parent.parent
SCHEMA_PATH = REPO_ROOT / "generated" / "ai_schemas.json"
OUTPUT_MODEL_PATH = REPO_ROOT / "app" / "models" / "generated_ai.py"
DEFAULT_URL = "http://localhost:8080/api/ai/contracts/schemas"


def fetch_contracts(url: str, token: str | None) -> Path:
    """Fetch JSON schemas from backend and write to disk."""

    req = urllib.request.Request(url)
    if token:
        req.add_header("Authorization", f"Bearer {token}")

    with urllib.request.urlopen(req) as resp:  # type: ignore[call-arg]
        payload: Any = json.load(resp)

    SCHEMA_PATH.parent.mkdir(parents=True, exist_ok=True)
    SCHEMA_PATH.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    return SCHEMA_PATH


def generate_models(schema_path: Path) -> None:
    """Run datamodel-code-generator to emit Pydantic models."""

    cmd = [
        "datamodel-code-generator",
        "--input",
        str(schema_path),
        "--input-file-type",
        "jsonschema",
        "--output",
        str(OUTPUT_MODEL_PATH),
    ]
    subprocess.run(cmd, check=True)


if __name__ == "__main__":
    url = os.environ.get("AI_CONTRACTS_URL", DEFAULT_URL)
    token = os.environ.get("AI_CONTRACTS_TOKEN")

    try:
        schema_file = fetch_contracts(url, token)
        print(f"Fetched schemas to {schema_file}")
        generate_models(schema_file)
        print(f"Generated models at {OUTPUT_MODEL_PATH}")
    except subprocess.CalledProcessError as exc:
        print("datamodel-code-generator failed; is it installed?", file=sys.stderr)
        sys.exit(exc.returncode)
    except Exception as exc:  # noqa: BLE001
        print(f"Contract fetch/generation failed: {exc}", file=sys.stderr)
        sys.exit(1)
