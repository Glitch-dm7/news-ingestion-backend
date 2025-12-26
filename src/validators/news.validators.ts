import z from "zod";

export const newsSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  url: z.url(),
  publication_date: z.date().nullable(),
  keywords: z.array(z.string()).default([]),
  updated_at: z.date().nullable(),
})