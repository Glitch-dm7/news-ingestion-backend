import { timestamp } from "drizzle-orm/singlestore-core";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const news = sqliteTable("news", {
  id: text("id").notNull(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  publication_date: integer("publication_date",{ mode: "timestamp"}),
  keywords: text("keywords", { mode: 'json' }).$type<string[]>(),
  updated_at: integer("updated_at", {mode: "timestamp"}).$onUpdateFn(() => new Date)
})