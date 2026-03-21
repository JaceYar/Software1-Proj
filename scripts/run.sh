#!/usr/bin/env bash

cd "$(dirname "$0")/.." || exit 1
mvn compile exec:java -Dexec.mainClass="edu.baylor.cs.App"
