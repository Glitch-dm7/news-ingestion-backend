# News Sitemap Ingestion System

A backend system that ingests news articles from an XML sitemap, stores them in a SQLite database, and provides APIs to query articles with time-based filters and pagination.

## Features

- 📰 **News Ingestion**: Fetch and parses news sitemaps
- 🤖 **Automated Cron Jobs**: Hourly news ingestion via cron scheduler
- 🔄 **Duplicate Prevention**: Uses URL hashing to avoid duplicate entries
- ⏰ **Time-based Filtering**: Query articles by date ranges (after, before, between)
- 📄 **Pagination Support**: Efficient pagination for large datasets
- 🛡️ **Error Handling**: Graceful handling of partial failures and invalid entries
- 🚀 **Built with Modern Stack**: Hono, Drizzle ORM, Bun, SQLite

## Tech Stack

- **Runtime**: [Bun](https://bun.sh)
- **Framework**: [Hono](https://hono.dev)
- **Database**: SQLite with [Drizzle ORM](https://orm.drizzle.team)
- **Validation**: [Zod](https://zod.dev)
- **XML Parsing**: [fast-xml-parser](https://github.com/NaturalIntelligence/fast-xml-parser)

## Installation

1. **Install Bun** (if not already installed):
```bash
curl -fsSL https://bun.sh/install | bash
```

2. **Install dependencies**:
```bash
bun install
```

3. **Install required packages**:
```bash
bun add hono drizzle-orm drizzle-kit zod fast-xml-parser
bun add -d @types/bun
```

## Database Setup

### 2. Generate Migrations

```bash
# Generate migration files from your schema
bun drizzle-kit generate
```

This will cate migration files in the `./drizzle` dictory.

### 3. Run Migrations

```bash
# Apply migrations to your database
bun drizzle-kit migrate
```

## Running the Application

### Development Mode

```bash
bun run dev
```

The server will start on the default port 8080.

## API Endpoints

### 1. Import Articles

Manually trigger article import from the sitemap.

**Endpoint**: `POST /api/news/import`

**sponse**:
```json
{
  "success": true,
  "data": {
    "total": 100,
    "inserted": 85,
    "updated": 15,
    "failed": 0,
    "errors": []
  }
}
```

### 2. Query Articles

Get articles with optional time filters and pagination.

**Endpoint**: `GET /api/news`

**Query Parameters**:
- `after` (optional): ISO 8601 timestamp (e.g., `2024-01-01T00:00:00Z`)
- `befo` (optional): ISO 8601 timestamp
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 10, max: 100): Items per page

**Examples**:

```bash
# Get all articles (first page)
GET /api/news?page=1&limit=10

# Get articles after a date
GET /api/news?after=2024-12-01T00:00:00Z&page=1&limit=20

# Get articles before a date
GET /api/news?before=2024-12-31T23:59:59Z&page=1&limit=10

# Get articles in a date range
GET /api/news?after=2024-12-01T00:00:00Z&before=2024-12-31T23:59:59Z&page=1&limit=50
```

**Response**:
```json
{
  "success": true,
  "data": {
    "articles": [
      {
        "id": "8f3b5d7e9c2a1f4b6d8e0a3c5f7b9d1e...",
        "title": "Article Title",
        "url": "https://www.ndtv.com/...",
        "publication_date": "2024-12-26T10:30:00Z",
        "keywords": ["india", "politics", "news"],
        "updated_at": "2024-12-26T12:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

### 3. Get Article by ID

Retrieve a single article by its ID.

**Endpoint**: `GET /api/news/:id`

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "8f3b5d7e9c2a1f4b6d8e0a3c5f7b9d1e...",
    "title": "Article Title",
    "url": "https://www.ndtv.com/...",
    "publication_date": "2024-12-26T10:30:00Z",
    "keywords": ["india", "politics"],
    "updated_at": "2024-12-26T12:00:00Z"
  }
}
```

## Error Handling

The system handles errors gracefully:

- **Invalid XML**: Returns error response with details
- **Partial Failures**: Continues processing valid entries, logs failed ones
- **Duplicate URLs**: Automatically updates existing entries

## Configuration
```typescript
const xml = await fetchSitemap('YOUR_SITEMAP_URL_HERE');

```

## Development Commands

```bash
# Start development server
bun run dev

# Generate database migrations
bun drizzle-kit generate

# Apply migrations
bun drizzle-kit migrate

# Open database studio
bun drizzle-kit studio

# Check database schema
bun drizzle-kit check

# Drop all tables (caution!)
bun drizzle-kit drop
```

## Automated News Ingestion (Cron Jobs)

The system includes automated news ingestion that runs every hour to keep the database updated with the latest articles.

### Quick Setup

1. **Test the ingestion script**:
```bash
bun run scripts/ingest-news.ts
```

2. **Install the cron job**:
```bash
crontab -e
# Add this line (update the path if needed):
0 * * * * /Users/divyadarshan/Developer/GL1TCH/news-ingestion-backend/scripts/run-ingestion.sh
```

3. **Verify installation**:
```bash
crontab -l
```

### Cron Job Files

- **`scripts/ingest-news.ts`** - Main ingestion script
- **`scripts/run-ingestion.sh`** - Wrapper script with logging
- **`logs/news-ingestion.log`** - Execution logs

### Monitoring

```bash
# View real-time logs
tail -f logs/news-ingestion.log

# Check recent logs
tail -n 50 logs/news-ingestion.log
```

### Cron Schedule Options

The default schedule is hourly (`0 * * * *`). You can modify it in the crontab:

```bash
# Every 30 minutes
*/30 * * * * /path/to/scripts/run-ingestion.sh

# Every 6 hours
0 */6 * * * /path/to/scripts/run-ingestion.sh

# Daily at midnight
0 0 * * * /path/to/scripts/run-ingestion.sh
```

### Removing the Cron Job

```bash
crontab -e
# Delete the line containing the news ingestion command
```

### Manual Ingestion

You can also manually trigger ingestion at any time:

```bash
# Direct execution
bun run scripts/ingest-news.ts

# Via wrapper script (with logging)
./scripts/run-ingestion.sh
```

## Testing the API

Using `curl`:

```bash
# Import articles
curl -X POST http://localhost:8080/api/news/import

# Get articles
curl "http://localhost:8080/api/news?page=1&limit=5"

# Get articles after date
curl "http://localhost:8080/api/news?after=2024-12-01T00:00:00Z"

# Get specific article
curl http://localhost:8080/api/news/{news_hash_id}
```

## Troubleshooting

### Database locked error

If you get "database is locked" errors:
- Make sure only one instance of the app is running
- Close Drizzle Studio if open
- Check for any other processes using `magnify.db`

### Cron job not running

```bash
# Check if cron is running
sudo launchctl list | grep cron

# Check cron logs (macOS)
log show --predicate 'process == "cron"' --last 1h

# Test script manually
bun run scripts/ingest-news.ts
```

### Migrations not applying

```bash
# Reset and regenerate migrations
rm -rf drizzle/
bun drizzle-kit generate
bun drizzle-kit migrate
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
