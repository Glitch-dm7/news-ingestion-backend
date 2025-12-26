import type { Config } from "drizzle-kit"

export default {
  schema: "./src/database/schema",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: "magnify.db",
  },
} satisfies Config