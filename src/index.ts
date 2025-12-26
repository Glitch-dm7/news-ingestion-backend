import { serve } from "bun";
import { Hono } from "hono";
import { logger } from "hono/logger"
import { setupRouter } from "./router";

const app = new Hono();

app.use("*", logger())

// router setup
setupRouter(app);

serve({
  port: 8080,
  fetch: app.fetch
})

console.log("Serving on http://localhost:8080")



// Build a small backend system that:

// - Periodically ingests a **news sitemap** (XML)
// - Parses and stores relevant fields in a database
    
//     (e.g. URL, title, publication date, keywords)
    
// - Exposes APIs to **query articles based on time filters**
//     - after / before a timestamp
//     - within a time range
//     - with pagination

// The system should:

// - Avoid duplicate entries when ingesting the same sitemap multiple times
// - Handle basic failures (invalid entries, partial failures) gracefully
// - Use a clean, reasonable schema and API design

// Non-goals: authentication, authorization, UI, or full-text search.

// Sitemap: https://www.ndtv.com/sitemap/google-news-sitemap