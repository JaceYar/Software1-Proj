#!/usr/bin/env bash
# Concatenates all Documentation markdown files into a single export file.
# Output: ExportDrafts/export-YYYY-MM-DD.md

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
EXPORT_DIR="$REPO_ROOT/ExportDrafts"
DATE="$(date +%Y-%m-%d)"
OUTPUT="$EXPORT_DIR/export-$DATE.md"

mkdir -p "$EXPORT_DIR"

# Append a file with a divider, no added header (file has its own)
append_raw() {
    local file="$1"
    if [[ -s "$file" ]]; then
        echo -e "\n---\n" >> "$OUTPUT"
        cat "$file" >> "$OUTPUT"
        echo "" >> "$OUTPUT"
    fi
}

# Start fresh
> "$OUTPUT"

DOC="$REPO_ROOT/Documentation"

# --- Domain Model (has its own header) ---
append_raw "$DOC/DomainModel.md"

# --- Use Case Diagram (has its own header) ---
append_raw "$DOC/UseCaseDiagram.md"

# --- User Stories ---
echo -e "\n---\n" >> "$OUTPUT"
echo "# User Stories" >> "$OUTPUT"
for f in "$DOC/User-Stories/"*.md; do
    [[ -s "$f" ]] || continue
    echo "" >> "$OUTPUT"
    cat "$f" >> "$OUTPUT"
    echo "" >> "$OUTPUT"
done

# --- Use Cases (skip template) ---
echo -e "\n---\n" >> "$OUTPUT"
echo "# Use Cases" >> "$OUTPUT"
for f in $(ls "$DOC/User-Cases/"*.md | sort); do
    [[ "$(basename "$f")" == "template.md" ]] && continue
    [[ -s "$f" ]] || continue
    echo "" >> "$OUTPUT"
    cat "$f" >> "$OUTPUT"
    echo "" >> "$OUTPUT"
done

echo "Exported to: $OUTPUT"
