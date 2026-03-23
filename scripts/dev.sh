#!/usr/bin/env bash

cd "$(dirname "$0")/.." || exit 1

# Kill both servers on Ctrl+C
trap 'kill $(jobs -p) 2>/dev/null; exit 0' INT TERM

echo "Starting Spring Boot backend on :8080..."
mvn spring-boot:run &

echo "Starting React frontend on :5173..."
cd frontend && bun dev &

wait
