#!/bin/bash

# News Ingestion Cron Job
# This script runs the news ingestion process

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Log file for cron job output
LOG_FILE="$PROJECT_DIR/logs/news-ingestion.log"

# Create logs directory if it doesn't exist
mkdir -p "$PROJECT_DIR/logs"

# Run the ingestion script and log output
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Starting scheduled news ingestion" >> "$LOG_FILE"

cd "$PROJECT_DIR"
bun run scripts/ingest-news.ts >> "$LOG_FILE" 2>&1

EXIT_CODE=$?
echo "[$(date '+%Y-%m-%d %H:%M:%S')] News ingestion completed with exit code: $EXIT_CODE" >> "$LOG_FILE"
echo "---" >> "$LOG_FILE"

exit $EXIT_CODE