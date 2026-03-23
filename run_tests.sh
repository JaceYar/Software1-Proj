#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
echo "Running all tests..."
mvn test
echo "Test run complete."
