# News Ingestion Cron Job Setup

## Files Created:
- `scripts/ingest-news.ts` - Main ingestion script
- `scripts/run-ingestion.sh` - Wrapper script for cron job

## Setup Instructions:

### 1. Test the script manually:
```bash
bun run scripts/ingest-news.ts
```

### 2. Install the cron job (runs every hour):
```bash
# Edit crontab
crontab -e

# Add this line (adjust path as needed):
0 * * * * /Users/divyadarshan/Developer/GL1TCH/news-ingestion-backend/scripts/run-ingestion.sh
```

### 3. Verify cron job is installed:
```bash
crontab -l
```

### 4. Check logs:
```bash
tail -f logs/news-ingestion.log
```

## Cron Schedule:
- `0 * * * *` = At minute 0 of every hour (hourly)
- Logs are stored in `logs/news-ingestion.log`

## To remove the cron job:
```bash
crontab -e
# Delete the line
```

## Alternative schedules:
- Every 30 minutes: `*/30 * * * *`
- Every 6 hours: `0 */6 * * *`
- Daily at midnight: `0 0 * * *`