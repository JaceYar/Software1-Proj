#!/usr/bin/env bash
# Concatenates Documentation markdown files into a single export file.
# Output: ExportDrafts/export-YYYY-MM-DD.md
#
# Usage: export-docs.sh [flags]
#   -d, --domain-model      Include Domain Model
#   -g, --diagram           Include Use Case Diagram
#   -s, --user-stories      Include User Stories
#   -u, --use-cases         Include all Use Cases
#       --case <name>       Include a specific use case by filename (without .md);
#                           may be repeated. Implies -u. E.g.: --case ProcessCheckIn
#
# If no flags are given, all sections are included.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
EXPORT_DIR="$REPO_ROOT/ExportDrafts"
DATE="$(date +%Y-%m-%d)"
OUTPUT="$EXPORT_DIR/export-$DATE.md"

inc_domain=false
inc_diagram=false
inc_stories=false
inc_cases=false
case_filter=()

usage() {
    echo "Usage: export-docs.sh [flags]"
    echo "  -d, --domain-model      Include Domain Model"
    echo "  -g, --diagram           Include Use Case Diagram"
    echo "  -s, --user-stories      Include User Stories"
    echo "  -u, --use-cases         Include all Use Cases"
    echo "      --case <name>       Include a specific use case by filename (without .md);"
    echo "                          may be repeated. Implies -u."
    echo ""
    echo "If no flags are given, all sections are included."
    exit 1
}

# Parse flags
if [[ $# -eq 0 ]]; then
    inc_domain=true inc_diagram=true inc_stories=true inc_cases=true
else
    while [[ $# -gt 0 ]]; do
        case "$1" in
            -d|--domain-model)   inc_domain=true   ;;
            -g|--diagram)        inc_diagram=true   ;;
            -s|--user-stories)   inc_stories=true   ;;
            -u|--use-cases)      inc_cases=true     ;;
            --case)
                shift
                [[ $# -eq 0 ]] && { echo "--case requires a name argument"; usage; }
                case_filter+=("$1")
                inc_cases=true
                ;;
            -h|--help)           usage              ;;
            *) echo "Unknown flag: $1"; usage       ;;
        esac
        shift
    done
fi

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

if $inc_domain;  then append_raw "$DOC/DomainModel.md";    fi
if $inc_diagram; then append_raw "$DOC/UseCaseDiagram.md"; fi

if $inc_stories; then
    echo -e "\n---\n" >> "$OUTPUT"
    echo "# User Stories" >> "$OUTPUT"
    for f in "$DOC/User-Stories/"*.md; do
        [[ -s "$f" ]] || continue
        echo "" >> "$OUTPUT"
        cat "$f" >> "$OUTPUT"
        echo "" >> "$OUTPUT"
    done
fi

if $inc_cases; then
    echo -e "\n---\n" >> "$OUTPUT"
    echo "# Use Cases" >> "$OUTPUT"
    for f in $(ls "$DOC/User-Cases/"*.md | sort); do
        [[ "$(basename "$f")" == "template.md" ]] && continue
        [[ -s "$f" ]] || continue
        if [[ ${#case_filter[@]} -gt 0 ]]; then
            base="$(basename "$f" .md)"
            match=false
            for pattern in "${case_filter[@]}"; do
                [[ "${base,,}" == "${pattern,,}" ]] && match=true && break
            done
            $match || continue
        fi
        name=$(awk -F'|' '/Use Case Name/{gsub(/^[[:space:]]+|[[:space:]]+$/, "", $3); print $3; exit}' "$f")
        echo -e "\n## $name" >> "$OUTPUT"
        echo "" >> "$OUTPUT"
        cat "$f" >> "$OUTPUT"
        echo "" >> "$OUTPUT"
    done
fi

echo "Exported to: $OUTPUT"
