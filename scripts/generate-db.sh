#!/usr/bin/env bash

cd "$(dirname "$0")/.." || exit 1

mkdir -p data

rm -f data/booking.db
sqlite3 data/booking.db < schema.sql

echo "Database created at data/booking.db"

mvn jooq-codegen:generate

echo "jOOQ classes generated in src/main/java/edu/baylor/cs/db/"
